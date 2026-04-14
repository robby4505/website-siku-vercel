/**
 * SISIKU Chatbot - Secure Backend Integration
 * PT Sinergi Insan Karya Utama
 * API Keys are secure on backend, never exposed to client
 */

// Configuration - API endpoints (no secrets here)
// These map to Netlify Functions which proxy to external APIs securely
const API_CONFIG = {
  CHAT_ENDPOINT: '/.netlify/functions/chat',
  WHATSAPP_ENDPOINT: '/.netlify/functions/whatsapp',
  PHONE_NUMBER: '6282278399722'
};

// ================= CHATBOT WIDGET CREATOR =================
function createChatbotWidget() {
  // Cek apakah widget sudah ada
  if (document.getElementById('sisiku-chatbot')) return;

  const widgetHTML = `
    <div id="sisiku-chatbot" class="sisiku-chatbot-widget">
      <!-- Toggle Button -->
      <button id="chatbot-toggle" class="chatbot-toggle-btn" aria-label="Buka Chatbot">
        <span class="toggle-logo-text">S</span>
        <span class="toggle-badge">💬</span>
      </button>

      <!-- Chat Container -->
      <div id="chatbot-container" class="chatbot-container">
        <!-- Header -->
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

        <!-- Messages Area -->
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

        <!-- Typing Indicator -->
        <div id="typing-indicator" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>

        <!-- Input Area -->
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

  // Toggle open/close
  toggleBtn?.addEventListener('click', () => {
    container.classList.add('active');
    toggleBtn.style.display = 'none';
    input?.focus();
  });

  closeBtn?.addEventListener('click', () => {
    container.classList.remove('active');
    toggleBtn.style.display = 'flex';
  });

  // Send message
  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
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

  // Auto-scroll
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
  if (sender === 'bot') {
    avatar.innerHTML = `<span class="avatar-text">S</span>`;
  } else {
    avatar.innerHTML = `<span class="avatar-text">U</span>`;
  }
  
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage
      })
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

// ================= SEND VIA WHATSAPP (SECURE BACKEND) =================
async function sendViaFlowKirim(message, phoneNumber = API_CONFIG.PHONE_NUMBER) {
  try {
    const response = await fetch(API_CONFIG.WHATSAPP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        type: 'text'
      })
    });
    
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return false;
  }
}

// ================= AUTO-INIT =================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createChatbotWidget);
} else {
  createChatbotWidget();
}