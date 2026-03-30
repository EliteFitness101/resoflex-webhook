/**
 * RESOFLEX™ MASTER ENGINE 
 * Node: REF-76530788057
 * Platform: Vercel + Supabase + Telegram
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    // 1. Handle Paystack Webhook
    if (req.headers['x-paystack-signature']) {
        return await handlePaystack(req, res);
    }

    // 2. Handle Telegram Bot Updates
    if (req.body.message || req.body.callback_query || req.body.inline_query) {
        return await handleTelegram(req, res);
    }

    res.status(200).send('ResoFlex Node Active');
}

async function handlePaystack(req, res) {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) return res.status(401).send('Unauthorized');

    const { event, data } = req.body;
    if (event === 'charge.success') {
        const { reference, amount, customer, metadata } = data;
        await supabase.from('rf_orders').insert([{
            order_id: reference,
            customer_name: metadata?.full_name,
            amount: amount / 100,
            architect_id: metadata?.referrer
        }]);
        // Trigger Telegram Alert to CEO
        await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, `💰 *NEW SALE:* ₦${amount/100}\nClient: ${metadata?.full_name}`);
    }
    return res.status(200).send('OK');
}

async function handleTelegram(req, res) {
    const { message, callback_query } = req.body;

    if (message && message.text?.startsWith('/start')) {
        const ref = message.text.split(' ')[1] || null;
        const keyboard = {
            inline_keyboard: [
                [{ text: "🍑 Glute Growth", callback_data: "goal_glutes" }],
                [{ text: "📉 Weight Loss", callback_data: "goal_shred" }],
                [{ text: "💪 Muscle Gain", callback_data: "goal_muscle" }]
            ]
        };
        await sendTelegramMessage(message.chat.id, "🏛️ *ResoFlex™ Node Active.*\nSelect your objective:", keyboard);
    }

    if (callback_query) {
        const goal = callback_query.data;
        await supabase.from('rf_leads').upsert({ telegram_id: callback_query.message.chat.id, goal: goal });
        await sendTelegramMessage(callback_query.message.chat.id, "✅ *Objective Locked.*\nTap below to launch your architecture.", {
            inline_keyboard: [[{ text: "🚀 Launch Ritual", web_app: { url: "https://alpha.resoflex.name.ng" } }]]
        });
    }
    return res.status(200).send('OK');
}

async function sendTelegramMessage(chatId, text, keyboard = null) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown', reply_markup: keyboard })
    });
}

