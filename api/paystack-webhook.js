import { supabase } from './supabaseClient';

export default async function handler(req, res) {
  const event = req.body;

  if (event.event === "charge.success") {
    const data = event.data;

    const email = data.customer.email;
    const amount = data.amount / 100;
    const reference = data.reference;

    // Save payment
    await supabase.from('payments').insert([{
      email,
      amount,
      reference,
      status: "success"
    }]);

    // Upgrade to VIP
    await supabase
      .from('users')
      .upsert({ email, is_vip: true });

    // Affiliate payout logic
    const { data: user } = await supabase
      .from('users')
      .select('referred_by')
      .eq('email', email)
      .single();

    if (user?.referred_by) {
      await supabase.from('earnings').insert([{
        email: user.referred_by,
        amount: amount * 0.2, // 20% commission
        source: "referral"
      }]);
    }
  }

  res.status(200).json({ received: true });
}
