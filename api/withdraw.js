import { supabase } from './supabaseClient';

export default async function handler(req, res) {
  const { email } = req.body;

  const { data } = await supabase
    .from('earnings')
    .select('amount');

  const total = data.reduce((sum, e) => sum + e.amount, 0);

  if (total < 5000) {
    return res.status(400).json({ error: "Minimum withdrawal ₦5000" });
  }

  // TODO: Paystack transfer API
  res.status(200).json({ message: "Withdrawal initiated", amount: total });
}
