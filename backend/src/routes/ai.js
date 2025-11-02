const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/suggest-slots', async (req, res) => {
  // Accept natural language like "I need a 1 hour slot next Tuesday afternoon"
  const { prompt, resourceId } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    // Prompt engineering: ask model to return JSON array of suggested ISO timestamps
    const systemPrompt = `You are an assistant that suggests available booking slots given a natural language request. Return a JSON array with objects {start: "<ISO>", end: "<ISO>", note: "<reason>"} only. Use the user's local timezone UTC for simplicity.`;
    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini', // placeholder - providers may vary
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Request: ${prompt}\nResource ID: ${resourceId || 'n/a'}` }
      ],
      max_tokens: 500,
      temperature: 0.2
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = resp.data.choices?.[0]?.message?.content || '';
    // try parse JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // fallback: return raw text
      return res.json({ raw: text });
    }
    return res.json({ suggestions: parsed });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'ai error' });
  }
});

module.exports = router;
