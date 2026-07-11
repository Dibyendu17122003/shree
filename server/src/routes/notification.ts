import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('EMAIL_USER / EMAIL_PASS not set — email notifications disabled');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

function formatAnswers(answers: Record<string, string>): string {
  const labels: Record<string, string> = {
    date: '📅 Date',
    meet_time: '⏰ Time',
    breakfast: '🥞 Breakfast',
    lunch: '🍛 Lunch',
    afternoon_snacks: '🥟 Afternoon Snacks',
    dinner: '🍜 Dinner',
    snacks: '🍰 Dessert',
    location: '📍 Location',
    shirt_color: '👔 Shirt Color',
    pant_color: '👖 Pant Color',
    flowers: '💐 Flowers',
    vibe: '🎵 Vibe',
    activity: '🎯 Activity',
    promises: '🤝 Promises',
    main_question: '💌 Main Question',
  };

  return Object.entries(answers)
    .map(([key, value]) => {
      const label = labels[key] || key;
      return `  ${label}: ${value}`;
    })
    .join('\n');
}

router.post('/notify-completion', async (req: Request, res: Response) => {
  try {
    const { sessionId, answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      res.status(400).json({ error: 'No answers provided' });
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      res.json({ status: 'skipped', reason: 'email not configured' });
      return;
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const answersText = formatAnswers(answers);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject: `❤️ Shree said YES! — ${timestamp}`,
      text: `Someone completed the proposal! 🎉

━━━━━━━━━━━━━━━━━━━━━━━
⏱  Timestamp: ${timestamp}
🆔  Session: ${sessionId}
━━━━━━━━━━━━━━━━━━━━━━━

📋 Answers:
${answersText}

━━━━━━━━━━━━━━━━━━━━━━━
This was sent automatically from your proposal website.
`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Completion notification sent for session ${sessionId}`);
    res.json({ status: 'sent' });
  } catch (err) {
    console.error('Email notification error:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;
