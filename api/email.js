export async function sendEmail(email, name, plan){
  const accessLink = `${process.env.SITE_URL}/thank-you?email=${email}&name=${name}`;

  await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE,
      template_id: process.env.EMAILJS_TEMPLATE,
      user_id: process.env.EMAILJS_PUBLIC,
      template_params: {
        email: email,
        name: name,
        plan: plan,
        link: accessLink
      }
    })
  });
}
