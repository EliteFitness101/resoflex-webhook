export default async function handler(req, res){
  const { message, goal, level, gender } = req.body;

  const prompt = `
You are B2K, an elite fitness AI coach.

User Profile:
Goal: ${goal}
Level: ${level}
Gender: ${gender}

Personality:
- Confident
- Motivational
- Direct
- Uses Nigerian context (foods, lifestyle)

User Message:
${message}

Respond like a high-level coach.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      model:"gpt-4o-mini",
      messages:[{role:"user",content:prompt}]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  res.status(200).json({ reply });
}
