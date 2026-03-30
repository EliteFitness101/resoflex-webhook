/**
 * RESOFLEX™ MORNING INTELLIGENCE BRIEFING
 * Node: REF-76530788057
 * Purpose: 24h Performance Summary for the CEO.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    // Security check: Only allow Cron or Admin
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];

    // 1. Fetch Sales Data
    const { data: sales } = await supabase
        .from('rf_orders')
        .select('amount')
        .gte('created_at', yesterday.toISOString());

    // 2. Fetch Lead Data
    const { data: leads } = await supabase
        .from('rf_leads')
        .select('goal')
        .gte('created_at', yesterday.toISOString());

    const totalRevenue = sales?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const totalLeads = leads?.length || 0;
    
    // Calculate Top Goal
    const goals = leads?.reduce((acc, curr) => {
        acc[curr.goal] = (acc[curr.goal] || 0) + 1;
        return acc;
    }, {});
    const topGoal = Object.keys(goals || {}).reduce((a, b) => goals[a] > goals[b] ? a : b, "N/A");

    const reportText = `☀️ *RESOFLEX™ MORNING BRIEFING*\n` +
                       `📅 Date: ${dateString}\n\n` +
                       `💰 *Revenue:* ₦${totalRevenue.toLocaleString()}\n` +
                       `👥 *New Leads:* ${totalLeads}\n` +
                       `🎯 *Top Objective:* ${topGoal}\n\n` +
                       `🏛️ Node REF-7653: STABLE.`;

    await sendTelegramMessage(process.env.TELEGRAM_ADMIN_ID, reportText);
    res.status(200).send('Report Sent');
}

async function sendTelegramMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
    });
}

