import os
from typing import AsyncIterator, List, Dict, Optional
from openai import AsyncOpenAI  # Use the async client for FastAPI
from tenacity import retry, stop_after_attempt, wait_exponential
from backend.src.core.supabase import supabase
from backend.src.core.config import settings
from backend.src.core.utils import Utils

# Import services
from backend.src.services.elevenlabs import ElevenLabsService

# Configure OpenAI Async Client
# Assumes settings.OPENAI_API_KEY exists in your .env
aclient = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

class LLMStreamError(Exception):
    pass

class AgentService:
    def __init__(self, token: Optional[str] = None, history: Optional[List[Dict[str, str]]] = None):
        self.supabase = supabase
        self.client = aclient
        # OpenAI model name (e.g., "gpt-4o" or "gpt-4o-mini")
        self.model_name = "gpt-4o-mini" 
        self.chat_history: List[Dict[str, str]] = history if history else []

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=0.5, min=0.5, max=4),
        reraise=True,
    )
    async def _send_message_stream(self, user_text: str, system_prompt: str, max_tokens: int = 300):
        """
        Internal method to call OpenAI Chat Completions with streaming.
        """
        # Prepare messages list: [System, ...History, Current User Message]
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add historical messages (standardizing roles for OpenAI)
        for msg in self.chat_history:
            role = "assistant" if msg["role"] in ["model", "assistant"] else "user"
            messages.append({"role": role, "content": msg["content"]})
            
        # Add the new user input
        messages.append({"role": "user", "content": user_text})

        return await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            stream=True,
            max_tokens=max_tokens,
            temperature=0.4
        )

    async def llm_token_stream(
        self,
        user_text: str,
        system_prompt: str = "You are a calm, concise wellness assistant for HealthSimple.",
        max_tokens: int = 300,
        request_id: Optional[str] = None,
    ) -> AsyncIterator[str]:
        """
        Streams tokens from OpenAI and updates history.
        """
        try:
            response_stream = await self._send_message_stream(
                user_text, 
                system_prompt=system_prompt, 
                max_tokens=max_tokens
            )
            
            full_response = ""
            async for chunk in response_stream:
                # OpenAI structure: chunk.choices[0].delta.content
                if chunk.choices and chunk.choices[0].delta.content:
                    text_chunk = chunk.choices[0].delta.content
                    full_response += text_chunk
                    yield text_chunk
            
            # Update history for this instance
            self.chat_history.append({"role": "user", "content": user_text})
            self.chat_history.append({"role": "assistant", "content": full_response})

        except Exception as e:
            # Important: Log the error here to debug during nwhacks
            print(f"OpenAI Stream Error: {e}")
            raise LLMStreamError("Unexpected OpenAI streaming failure") from e
    
    async def generate_audio_stream(self, user_text: str):
        """
        Generates audio stream from OpenAI text (Async).
        """
        token_stream = self.llm_token_stream(user_text)
        
        async for phrase in Utils.async_speech_chunks(token_stream):
            async for audio_chunk in ElevenLabsService.elevenlabs_stream(phrase):
                yield audio_chunk

    async def formulate_response(self, auth_id: str, features: dict):
        """
        Evaluates the user's biometrics and updates their state in Postgres/Supabase.
        """
        current_vibe = "Relaxed"
        if features:
            # Example: logic based on biometric input
            current_vibe = "Stressed"
        
        data = {
            "user_id": auth_id, 
            "stress_score": 50 if current_vibe == "Stressed" else 10, 
            "vibe": current_vibe,
            "note": f"Features processed: {features}"
        }
        
        try:
            # Note: supabase-py is synchronous unless using their specific async client,
            # but usually runs fine in FastAPI.
            self.supabase.table("emotional_logs").insert(data).execute()
        except Exception as e:
            print(f"Error logging to Supabase: {e}")
        
        return current_vibe

    async def get_calming_suggestion(self, user_id: str):
        return "Let's take a deep breath together."