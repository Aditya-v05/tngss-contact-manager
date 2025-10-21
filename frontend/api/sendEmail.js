// frontend/api/sendEmail.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Get the Resend API key from Vercel
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  // 2. Get data from the React app
  // 'fromEmail' is the logged-in user (e.g., user@google.com)
  // 'toEmail' is the contact
  const { fromEmail, toEmail, subject, body } = req.body;

  // 3. Format the email for Resend's API
  //    Resend is simpler!
  const emailData = {
    from: 'TNGSS Contact Manager <onboarding@resend.dev>', // This is required by Resend's free plan
    to: [toEmail],
    subject: subject,
    text: body,
    reply_to: fromEmail, // This is the magic: when they reply, it goes to your user
  };

  // 4. Send the email by calling Resend's API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Resend error:", errorBody);
      return res.status(response.status).json({ error: 'Failed to send email.' });
    }

    // Resend gives back the new email ID
    const data = await response.json();
    res.status(200).json({ message: 'Email sent successfully!', id: data.id });

  } catch (error) {
    console.error("Email function error:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}