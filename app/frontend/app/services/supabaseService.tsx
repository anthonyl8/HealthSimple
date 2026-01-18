import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = .env.local.VITE_SUPABASE_URL
const supabaseKey = .env.local.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const [createSessionData, setCreateSessionData] = useState([]);
const [sessionInfoData, setSessionInfoData] = useState([]);

export async function getCreateSessionData() => {
    let { data, error } = await supabase.from("create_session").select("*");
    if (error) {
        console.error(error);
        throw new Error("Create session data could not be loaded");
    }
    return data;
}

export async function getSessionInfoData() => {
    let { data, error } = await supabase.from("sessions_info").select("*");
    if (error) {
        console.error(error);
        throw new Error("Sessions info data could not be loaded");
    }
    return data;
}

export async function getGoodMommentsData() => {
    let { data, error } = await supabase.from("good_moments").select("*");
    if (error) {
        console.error(error);
        throw new Error("Good momments data could not be loaded");
    }
    return data;
}

export async function addNewSessionDataToTable(newSessionData: any) => {
    
}