import crypto from 'crypto';

export default function handler(req, res) {
  const { email, file } = req.query;

  // Create signed token
  const token = crypto
    .createHash('sha256')
    .update(email + file + process.env.SECRET_KEY)
    .digest('hex');

  const url = `/protected/${file}?token=${token}&email=${email}`;

  res.status(200).json({ url });
}
