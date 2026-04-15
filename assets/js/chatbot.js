/**
 * SISIKU Chatbot - Vercel Integration
 */

// Configuration - API endpoints for Vercel
const API_CONFIG = {
  CHAT_ENDPOINT: '/api/chat', // PERBAIKAN: Dari /.netlify/functions/chat menjadi /api/chat
  WHATSAPP_ENDPOINT: '/api/whatsapp',
  PHONE_NUMBER: '6282278399722'
};

function createChatbotWidget() {
  if (document.getElementById('sisiku-chatbot')) return;

  const widgetHTML = `
    <div id="sisiku-chatbot" class="sisiku-chatbot-widget">
      <button id="chatbot-toggle" class="chatbot-toggle-btn" aria-label="Buka Chat">
        <span class="toggle-logo-text">S</span>
      </button>
      
      <div id="chatbot-container" class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-title">
            <h3>SISIKU</h3>
            <p>Asisten Virtual SIKU</p>
          </div>
          <button id="chatbot-close" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>

        <div id="chatbot-messages" class="chatbot-messages">
          <div class="message bot">
            <div class="message-content">
              Halo! Selamat datang di SIKU. Ada yang bisa saya bantu? 🤝
            </div>
          </div>
        </div>

        <div class="chatbot-input-area">
          <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ketik pesan Anda..." autocomplete="off">
          <button id="chatbot-send" class="chatbot-send-btn">➤</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  initChatbotEvents();
}

function initChatbotEvents() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const container = document.getElementById('chatbot-container');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messages = document.getElementById('chatbot-messages');

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
    
    // Simulasi typing indicator sederhana
    const loadingId = 'loading-' + Date.now();
    messages.innerHTML += `<div id="${loadingId}" class="message bot"><div class="message-content">...</div></div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch(API_CONFIG.CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      document.getElementById(loadingId).remove();
      addMessage(data.reply || 'Maaf, terjadi kesalahan.', 'bot');
    } catch (error) {
      document.getElementById(loadingId).remove();
      addMessage('⚠️ Gagal terhubung ke server.', 'bot');
    }
  };

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createChatbotWidget);
} else {
  createChatbotWidget();
}