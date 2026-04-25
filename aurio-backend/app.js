import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('aurio backend is running');
});

// Main AI endpoint
app.post('/api/tools', async (req, res) => {
  const { tool, input } = req.body;

  // Validate tool
  if (tool !== 'task-breaker') {
    return res.status(400).json({ error: 'Unknown tool' });
  }

  // Build prompt for DeepSeek
  const prompt = `Break down the task "${input}" into clear, numbered steps. Use simple, direct language. Each step should be an action.`;

  try {
    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',  // DeepSeek's standard model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    res.json({ result });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`aurio backend listening on port ${port}`);
});
