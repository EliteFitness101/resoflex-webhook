import crypto from "crypto";
import axios from "axios";

// Set these in Vercel Dashboard Environment Variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  try {
    // 1️⃣ Verify Paystack signature
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY)
                       .update(JSON.stringify(req.body))
                       .digest("hex");
    if (hash !== req.headers["x-paystack-signature"]) return res.status(400).send("Invalid signature");

    const event = req.body;

    if(event.event === "charge.success") {
      const email = event.data.customer.email;
      const reference = event.data.reference;

      const telegramUserId = getTelegramUserIdByEmail(email);
      if(!telegramUserId) return res.status(200).send("User not found");

      // 2️⃣ Telegram Notification
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: telegramUserId,
        text: `🎉 Payment Confirmed!\nReference: ${reference}\nYour ResoFlex plan is ready!`
      });

      // 3️⃣ Label user as Paid
      setUserStatusPaid(telegramUserId);

      // 4️⃣ Trigger VIP Upsell
      await triggerVipSequence(telegramUserId);

      console.log(`Payment processed: ${email}, reference: ${reference}`);
    }

    res.status(200).send("OK");

  } catch(error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// ------------------------
// Helper Functions
// ------------------------
function getTelegramUserIdByEmail(email) {
  const db = { "customer@example.com": "123456789" }; // Map email to Telegram chat_id
  return db[email];
}

function setUserStatusPaid(userId) {
  console.log(`User ${userId} labeled as Paid`);
  // TODO: implement DB / ManyChat integration
}

async function triggerVipSequence(userId){
  const vipMessage = `💎 VIP Coaching Available!
Upgrade to VIP:
- Personal guidance
- Daily check-ins
- Faster transformation
Price: ₦5,000`;

  await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: userId,
    text: vipMessage,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Upgrade to VIP", url: "https://paystack.link/to/vip" },
          { text: "No, Thanks", callback_data: "skip_vip" }
        ]
      ]
    }
  });
}
