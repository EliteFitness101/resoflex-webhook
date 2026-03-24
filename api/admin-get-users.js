import { supabase } from './supabaseClient';

export default async function handler(req,res){
  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending:false });

  res.status(200).json(data);
}
