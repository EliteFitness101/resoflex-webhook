/**
 * RESOFLEX™ AI & VISUALIZATION ENGINE
 * Node: REF-76530788057
 * AI: Gemini-2.5-Flash | Image: Imagen-4.0
 */

const apiKey = ""; // Environment handles this

export default async function handler(req, res) {
    const { message } = req.body;
    if (!message || !message.text) return res.status(200).send('OK');

    const chatId = message.chat.id;
    const text = message.text;

    // 1. Image Generation Trigger
    if (text.toLowerCase().startsWith('make image')) {
        const prompt = text.replace('make image', '').trim();
        return await generateImage(chatId, prompt);
    }

    // 2. AI Explanation Trigger (Default)
    return await generateTextResponse(chatId, text);
}

async function generateTextResponse(chatId, prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: `Answer as ResoFlex AI Coach: ${prompt}` }] }],
        systemInstruction: { parts: [{ text: "You are the Resonance Fitness AI. High-status, professional, expert in Nigerian body transformation." }] }
    };

    const result = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
    const data = await result.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    await sendToTelegram(chatId, responseText);
}

async function generateImage(chatId, promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
    const payload = { instances: { prompt: promptText }, parameters: { sampleCount: 1 } };

    const result = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
    const data = await result.json();
    const imageUrl = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;

    await sendToTelegram(chatId, "🎨 *Visualizing your idea...*", null, imageUrl);
}

async function sendToTelegram(chatId, text, keyboard = null, photo = null) {
    const method = photo ? 'sendPhoto' : 'sendMessage';
    const body = photo ? { chat_id: chatId, photo: photo, caption: text, parse_mode: 'Markdown' } : { chat_id: chatId, text: text, parse_mode: 'Markdown', reply_markup: keyboard };
    
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}
