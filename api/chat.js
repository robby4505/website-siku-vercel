// api/chat.js (SERVER SIDE)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    // Menggunakan Qwen 2.5 7B sesuai permintaan Anda
    const model = 'qwen/qwen-2.5-7b-instruct'; 

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'SIKU Local Dev'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Anda adalah SISIKU, asisten virtual profesional dari PT Sinergi Insan Karya Utama (SIKU). Jawab dengan sopan, ringkas, dan fokus pada konsultasi manajemen, SDM, pelatihan, serta administrasi bisnis. Gunakan bahasa Indonesia.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'OpenRouter API error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan ini.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}