import { supabase } from './supabaseClient';

export default async function handler(req, res) {
  const { email } = req.query;

  const { data } = await supabase
    .from('users')
    .select('is_vip')
    .eq('email', email)
    .single();

  if (!data?.is_vip) {
    return res.status(403).json({ error: "VIP ONLY" });
  }

  res.status(200).json({ access: true });
}
