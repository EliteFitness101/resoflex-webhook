export default function handler(req,res){
  console.log("User accessed:", req.query.email);
  res.status(200).send("Logged");
}
