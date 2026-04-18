// assets/js/chatbot.js
// Buat widget chat SIKU jika belum ada
(function () {
  const widgetId = 'sisiku-chatbot-widget';
  if (document.getElementById(widgetId)) return;

  const widget = document.createElement('div');
  widget.id = widgetId;
  widget.className = 'sisiku-chatbot-widget';

  widget.innerHTML = `
    <button class="chatbot-toggle-btn" aria-label="Buka chat SIKU">
      <span class="toggle-logo-text">SIKU</span>
    </button>
    <div class="chatbot-container" aria-hidden="true">
      <div class="chatbot-header">
        <div>
          <strong>Chat SIKU</strong>
          <p style="margin:0; font-size:0.85rem; opacity:0.8;">Asisten virtual bisnis</p>
        </div>
        <button class="chatbot-close-btn" aria-label="Tutup chat" style="background:none;border:none;color:#fff;font-size:1.25rem;cursor:pointer;">×</button>
      </div>
      <div class="chatbot-messages"></div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" placeholder="Tulis pesan Anda..." aria-label="Pesan" />
        <button class="chatbot-send-btn" aria-label="Kirim pesan">➤</button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const toggleBtn = widget.querySelector('.chatbot-toggle-btn');
  const closeBtn = widget.querySelector('.chatbot-close-btn');
  const container = widget.querySelector('.chatbot-container');
  const messagesEl = widget.querySelector('.chatbot-messages');
  const inputEl = widget.querySelector('.chatbot-input');
  const sendBtn = widget.querySelector('.chatbot-send-btn');

  function addMessage(content, role = 'bot') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}`;
    messageEl.innerHTML = `<div class="message-content">${content}</div>`;
    messagesEl.appendChild(messageEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setActive(active) {
    container.classList.toggle('active', active);
    container.setAttribute('aria-hidden', active ? 'false' : 'true');
    if (active) {
      inputEl.focus();
    }
  }

  function showError(message) {
    addMessage(`<strong>Kesalahan:</strong> ${message}`, 'bot');
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    inputEl.value = '';
    addMessage('Sedang mengetik...', 'bot');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      const botResponse = data.reply || data.error || 'Maaf, saya tidak bisa memproses permintaan ini.';

      const typingMessage = messagesEl.querySelector('.message.bot:last-child .message-content');
      if (typingMessage && typingMessage.textContent === 'Sedang mengetik...') {
        typingMessage.textContent = botResponse;
      } else {
        addMessage(botResponse, 'bot');
      }
    } catch (err) {
      const typingMessage = messagesEl.querySelector('.message.bot:last-child .message-content');
      if (typingMessage && typingMessage.textContent === 'Sedang mengetik...') {
        typingMessage.textContent = 'Terjadi gangguan koneksi. Silakan coba lagi nanti.';
      } else {
        showError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
      console.error('Chatbot fetch error:', err);
    }
  }

  toggleBtn.addEventListener('click', () => {
    setActive(!container.classList.contains('active'));
    if (container.classList.contains('active') && messagesEl.children.length === 0) {
      addMessage('Halo! Saya SIKU, asisten virtual untuk konsultasi manajemen dan SDM. Silakan ajukan pertanyaan Anda.', 'bot');
    }
  });

  closeBtn.addEventListener('click', () => setActive(false));

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
})();