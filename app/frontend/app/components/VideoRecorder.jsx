import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const liveVideoRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // 1. Request audio and video access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // 2. Show live preview to the user
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }

      // 3. Initialize MediaRecorder
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      // 4. Handle data chunks
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // 5. Handle recording stop
      recorder.onstop = () => {
        const completeBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(completeBlob);
        setVideoURL(url);
        
        // Stop all tracks to turn off camera/mic hardware lights
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Please allow camera and microphone access.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Wellness Begins!</h2>
      
      <div style={{ marginBottom: '20px' }}>
        {/* Live Preview / Recorded Result */}
        <video 
          ref={liveVideoRef} 
          src={!recording ? videoURL : undefined}
          autoPlay 
          muted={recording} // Mute live preview to avoid feedback loops
          controls={!recording}
          style={{ width: '100%', maxWidth: '500px', backgroundColor: '#000' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!recording ? (
          <button onClick={startRecording} style={btnStyle}>Start Recording</button>
        ) : (
          <button onClick={stopRecording} style={{...btnStyle, backgroundColor: 'red'}}>Stop Recording</button>
        )}

        {videoURL && !recording && (
          <a href={videoURL} download="recording.webm" style={linkStyle}>
            Download Recording
          </a>
        )}
      </div>
    </div>
  );
};

// Simple styles
const btnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' };
const linkStyle = { padding: '10px 20px', textDecoration: 'none', backgroundColor: '#28a745', color: '#fff', borderRadius: '5px' };

export default VideoRecorder;