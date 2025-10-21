// This is our Vercel Serverless Function
// It runs securely on Vercel's servers, not in the browser

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Get the data from the React app
  const { fromEmail, toEmail, subject, body } = req.body;
  
  // 3. Get the secret API key from Vercel's environment
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  if (!SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  // 4. Format the email for SendGrid's API
  const emailData = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: { email: fromEmail, name: "TNGSS Contact Manager" }, // 'fromEmail' MUST be your verified Single Sender
    reply_to: { email: fromEmail }, // So they reply to you
    subject: subject,
    content: [{ type: 'text/plain', value: body }],
  };

  // 5. Send the email by calling SendGrid's API
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
      // If SendGrid gives an error, log it and send it back
      const errorBody = await response.json();
      console.error("SendGrid error:", errorBody);
      return res.status(response.status).json({ error: 'Failed to send email.' });
    }

    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error("Email function error:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}