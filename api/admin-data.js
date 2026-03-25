import { supabase } from './supabaseClient.js';

export default async function handler(req,res){

  const { data: users } = await supabase.from('users').select('*');
  const { data: referrals } = await supabase.from('referrals').select('*');

  const revenue = users
    ?.filter(u=>u.paid)
    .reduce((sum,u)=> sum + (u.plan === 'VIP' ? 5000 : 1000),0);

  res.status(200).json({
    revenue,
    users,
    referrals
  });
}
