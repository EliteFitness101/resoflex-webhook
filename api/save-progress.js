import { supabase } from './supabaseClient.js';

export default async function handler(req,res){

  const { email, weight, waist, glutes } = req.body;

  await supabase.from('progress').insert([
    { email, weight, waist, glutes }
  ]);

  res.status(200).json({message:"Saved"});
}
