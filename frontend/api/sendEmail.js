export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the secret keys from Vercel
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  
  // This is your STATIC, VERIFIED email (e.g., you@gmail.com)
  const VERIFIED_SENDER = process.env.SENDGRID_FROM_EMAIL; 

  // Get data from the React app
  // 'fromEmail' here is the DYNAMIC logged-in user (e.g., user@google.com)
  const { fromEmail, toEmail, subject, body } = req.body;

  if (!SENDGRID_API_KEY || !VERIFIED_SENDER) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  // Format the email for SendGrid
  const emailData = {
    personalizations: [{ to: [{ email: toEmail }] }],
    
    // FROM: This MUST be your static, verified email
    from: { email: VERIFIED_SENDER, name: "TNGSS Contact Manager" }, 
    
    // REPLY-TO: This is the user who is logged in
    // When the contact hits "reply", it will go to this user.
    reply_to: { email: fromEmail }, 
    
    subject: subject,
    content: [{ type: 'text/plain', value: body }],
  };

  // Send the email
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("SendGrid error:", errorBody);
      return res.status(response.status).json({ error: 'Failed to send email. Check SendGrid setup.' });
    }

    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error("Email function error:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}