/**
 * RESOFLEX™ WELCOME & SEGMENTATION ENGINE
 * Node: REF-76530788057
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    const { message, callback_query } = req.body;

    // Handle initial /start
    if (message && message.text === '/start') {
        return await sendWelcomeMenu(message.chat.id);
    }

    // Handle Goal Selection
    if (callback_query) {
        const goal = callback_query.data;
        const chatId = callback_query.message.chat.id;
        const firstName = callback_query.from.first_name;

        // Save Lead to Supabase for Retargeting
        await supabase.from('rf_leads').upsert({
            telegram_id: chatId,
            name: firstName,
            goal: goal,
            status: 'Onboarding'
        });

        return await sendGoalConfirmation(chatId, goal);
    }

    res.status(200).send('OK');
}

async function sendWelcomeMenu(chatId) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const keyboard = {
        inline_keyboard: [
            [{ text: "🍑 Glute Growth", callback_data: "glute_growth" }],
            [{ text: "📉 Weight Loss", callback_data: "weight_loss" }],
            [{ text: "💪 Muscle Gain", callback_data: "muscle_gain" }]
        ]
    };

    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: "🏛️ *Welcome to the ResoFlex™ Empire.*\n\nTo build your personalized architecture, select your primary goal below:",
            parse_mode: "Markdown",
            reply_markup: keyboard
        })
    });
}

async function sendGoalConfirmation(chatId, goal) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const labels = {
        "glute_growth": "Mavia Beauty Aesthetic",
        "weight_loss": "Elite Shredding",
        "muscle_gain": "Buchi Hypertrophy"
    };

    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `✅ *Objective Locked: ${labels[goal]}*\n\nYour personalized node is preparing. Tap below to enter the portal.`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [[{ text: "🚀 Launch Portal", web_app: { url: "https://alpha.resoflex.name.ng" } }]]
            }
        })
    });
}

