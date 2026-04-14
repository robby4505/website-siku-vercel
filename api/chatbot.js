/**
 * SISIKU Chatbot - Secure Backend Integration for Vercel
 */

// Configuration - API endpoints for Vercel
const API_CONFIG = {
  CHAT_ENDPOINT: '/api/chat', // PERBAIKAN: Dari /.netlify/functions/chat menjadi /api/chat
  WHATSAPP_ENDPOINT: '/api/whatsapp',
  PHONE_NUMBER: '6282278399722'
};

// ================= CHATBOT WIDGET CREATOR =================
function createChatbotWidget() {
  if (document.getElementById('sisiku-chatbot')) return;

  const widgetHTML = `
    <div id="sisiku-chatbot" class="sisiku-chatbot-widget">
      <button id="chatbot-toggle" class="chatbot-toggle-btn" aria-label="Buka Chat">
        <span class="toggle-logo-text">S</span>
        <span class="toggle-badge">1</span>
      </button>
      
      <div id="chatbot-container" class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-logo">
            <span class="logo-text">S</span>
          </div>
          <div class="chatbot-title">
            <h3>SISIKU</h3>
            <p>Asisten Virtual SIKU</p>
          </div>
          <button id="chatbot-close" class="chatbot-close-btn" aria-label="Tutup">&times;</button>
        </div>

        <div id="chatbot-messages" class="chatbot-messages">
          <div class="message bot">
            <div class="message-avatar">
              <span class="avatar-text">S</span>
            </div>
            <div class="message-content">
              Halo! Selamat datang di SIKU. Saya SISIKU, asisten virtual yang siap membantu. Ada yang bisa saya bantu? 🤝
            </div>
          </div>
        </div>

        <div id="typing-indicator" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>

        <div class="chatbot-input-area">
          <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ketik pesan Anda..." autocomplete="off">
          <button id="chatbot-send" class="chatbot-send-btn" aria-label="Kirim">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  initChatbotEvents();
}

// ================= EVENT HANDLERS =================
function initChatbotEvents() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const container = document.getElementById('chatbot-container');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messages = document.getElementById('chatbot-messages');
  const typing = document.getElementById('typing-indicator');

  toggleBtn?.addEventListener('click', () => {
    container.classList.add('active');
    toggleBtn.style.display = 'none';
    input?.focus();
  });

  closeBtn?.addEventListener('click', () => {
    container.classList.remove('active');
    toggleBtn.style.display = 'flex';
  });

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    typing.classList.add('active');
    scrollToBottom();

    try {
      const reply = await callOpenRouterAPI(text);
      typing.classList.remove('active');
      addMessage(reply, 'bot');
    } catch (error) {
      console.error('Chatbot error:', error);
      typing.classList.remove('active');
      addMessage('⚠️ Maaf, terjadi kesalahan koneksi. Silakan hubungi kami via WhatsApp: 0822-7839-9722', 'bot');
    }
  };

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }
}

// ================= ADD MESSAGE TO UI =================
function addMessage(text, sender) {
  const messages = document.getElementById('chatbot-messages');
  if (!messages) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = `<span class="avatar-text">${sender === 'bot' ? 'S' : 'U'}</span>`;

  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(content);
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// ================= CALL BACKEND CHAT API (SECURE) =================
async function callOpenRouterAPI(userMessage) {
  try {
    const response = await fetch(API_CONFIG.CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${err.error?.message || 'Unknown'}`);
    }

    const data = await response.json();
    return data.reply || 'Maaf, saya tidak bisa memproses permintaan ini.';
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

// ================= AUTO-INIT =================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createChatbotWidget);
} else {
  createChatbotWidget();
}