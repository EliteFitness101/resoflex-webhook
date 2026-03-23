# ResoFlex Webhook

This repository contains the **Paystack serverless webhook** for the ResoFlex fitness platform.  

## Features
- Verifies Paystack payments
- Sends Telegram notifications
- Labels users as Paid
- Triggers VIP upsell sequence

## Usage
1. Deploy `paystack-webhook.js` to Vercel or Netlify
2. Set environment variables:
   - PAYSTACK_SECRET
   - TELEGRAM_BOT_TOKEN
3. Add webhook URL to Paystack (event: charge.success)
4. Integrate with Canva Pay Now button and Payment Success page

## License
MIT
