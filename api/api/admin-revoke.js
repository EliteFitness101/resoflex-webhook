import { supabase } from './supabaseClient';

export default async function handler(req,res){
  const { email } = req.body;

  // 1. Disable user
  await supabase
    .from('users')
    .update({ paid:false })
    .eq('email', email);

  // 2. Delete active links
  await supabase
    .from('temp_links')
    .delete()
    .eq('email', email);

  res.status(200).json({ status:'revoked' });
}
