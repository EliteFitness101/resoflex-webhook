import { supabase } from './supabaseClient.js';

export default async function handler(req,res){
  const { email } = req.body;

  await supabase
    .from('users')
    .update({ paid:false })
    .eq('email', email);

  res.status(200).send("Revoked");
}
