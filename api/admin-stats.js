import { supabase } from './supabaseClient';

export default async function handler(req, res) {

  const users = await supabase.from('users').select('*');
  const payments = await supabase.from('payments').select('*');
  const earnings = await supabase.from('earnings').select('*');

  res.status(200).json({
    totalUsers: users.data.length,
    totalRevenue: payments.data.reduce((a,b)=>a+b.amount,0),
    totalPayouts: earnings.data.reduce((a,b)=>a+b.amount,0)
  });
}
