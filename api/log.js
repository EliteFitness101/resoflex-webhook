/**
 * RESOFLEX™ LIVE LOG ENGINE
 * Node: REF-76530788057
 * Purpose: Real-time traffic monitoring for the CEO.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function logTelegramUpdate(update) {
    const { message, callback_query, inline_query } = update;
    
    const logEntry = {
        user_id: message?.from?.id || callback_query?.from?.id || inline_query?.from?.id,
        username: message?.from?.username || callback_query?.from?.username || "anonymous",
        content: message?.text || callback_query?.data || inline_query?.query || "[Media/Other]",
        type: message ? 'message' : callback_query ? 'button' : 'inline',
        timestamp: new Date().toISOString()
    };

    // Save to the Log Vault
    const { error } = await supabase
        .from('rf_logs')
        .insert([logEntry]);

    if (error) console.error("Log Node Error:", error.message);
}

