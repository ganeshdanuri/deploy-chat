(function () {
  "use strict";

  var script =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  var EMBED_TOKEN = script.getAttribute("data-token") || "";
  var API_BASE = script.getAttribute("data-api") || "http://localhost:8000";
  var POSITION = script.getAttribute("data-position") || "bottom-right";
  var primaryColor = script.getAttribute("data-color") || "#4f46e5";

  if (!EMBED_TOKEN) {
    console.warn("[DeployMind Widget] Missing data-token attribute.");
    return;
  }

  /* ───────────────────────────────────────────────────────────── */
  /*  ChatGPT-Style Markdown Renderer (Safe)                      */
  /* ───────────────────────────────────────────────────────────── */

  function renderMarkdown(text) {
    if (!text) return "";

    function escHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    return escHtml(text)
      .replace(/```([\s\S]*?)```/g, function (_, code) {
        return (
          '<pre class="dm-pre"><code class="dm-code-block">' +
          code +
          "</code></pre>"
        );
      })
      .replace(/`([^`]+)`/g, '<code class="dm-code">$1</code>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  /* ───────────────────────────────────────────────────────────── */
  /*  Styling (ChatGPT Inspired)                                   */
  /* ───────────────────────────────────────────────────────────── */

  var posRight = POSITION.includes("right");
  var posBottom = POSITION.includes("bottom");

  var css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

#dm-widget-root * {
  box-sizing:border-box;
  margin:0;
  font-family: 'Inter', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Root positioning */
#dm-widget-root{
  position:fixed;
  ${posRight ? "right:24px;" : "left:24px;"}
  ${posBottom ? "bottom:24px;" : "top:24px;"}
  z-index:99999;
  display:flex;
  flex-direction:column;
  align-items:${posRight ? "flex-end" : "flex-start"};
  gap:12px;
}

/* Bubble Button */
#dm-bubble{
  width:56px;
  height:56px;
  border-radius:50%;
  background:var(--dm-primary, #10a37f);
  border:none;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 8px 20px rgba(0,0,0,.15);
}
#dm-bubble svg{width:24px;height:24px;fill:white;}

/* Chat Window */
#dm-chat-window{
  width:400px;
  height:600px;
  border-radius:16px;
  background:#ffffff;
  box-shadow:0 10px 40px rgba(0,0,0,.15);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  opacity:0;
  transform:translateY(10px);
  pointer-events:none;
  transition:all .2s ease;
}
#dm-chat-window.open{
  opacity:1;
  transform:translateY(0);
  pointer-events:auto;
}

/* Header */
#dm-header{
  padding: 20px;
  background: var(--dm-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dm-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dm-header-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dm-header-avatar svg {
  width: 20px;
  height: 20px;
  fill: white;
}
.dm-header-info {
  display: flex;
  flex-direction: column;
}
.dm-header-name {
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
}
.dm-header-status {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
  margin-top: 2px;
}
.dm-status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
}
#dm-close {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px;
  margin: -8px;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
#dm-close:hover {
  opacity: 1;
}
#dm-close svg {
  width: 20px;
  height: 20px;
}

/* Messages area */
#dm-messages{
  flex:1;
  overflow-y:auto;
  padding:24px 20px;
  background:#f7f7f8;
  display:flex;
  flex-direction:column;
  gap:18px;
}

/* Message Row */
.dm-msg{
  display:flex;
  width:100%;
}
.dm-msg.dm-user{
  justify-content:flex-end;
}
.dm-msg.dm-bot{
  justify-content:flex-start;
  gap:10px;
}

/* Bubble */
.dm-bubble-text{
  max-width: calc(100% - 48px);
  padding:12px 14px;
  border-radius:16px;
  font-size:14px;
  line-height:1.5;
  word-break:break-word;
}

/* Bot bubble */
.dm-msg.dm-bot .dm-bubble-text{
  background:#ffffff;
  color:#111827;
  border:1px solid #e5e7eb;
  border-top-left-radius: 4px;
}

/* User bubble */
.dm-msg.dm-user .dm-bubble-text{
  background:var(--dm-primary, #10a37f);
  color:white;
  border-bottom-right-radius: 4px;
}

/* Markdown inside bubble */
.dm-code{
  background:rgba(0,0,0,.05);
  padding:2px 6px;
  border-radius:6px;
  font-family:monospace;
  font-size:12px;
}
.dm-pre{
  background:#1e1e1e;
  color:#a6e3a1;
  padding:12px;
  border-radius:8px;
  overflow-x:auto;
  margin-top:8px;
  font-size:12px;
}
.dm-code-block{
  font-family:monospace;
  white-space:pre;
}

/* Input */
#dm-input-area{
  padding:16px;
  background:#ffffff;
  border-top:1px solid #e5e7eb;
  display:flex;
  gap:10px;
}
#dm-input{
  flex:1;
  border:1px solid #e5e7eb;
  border-radius:12px;
  padding:12px;
  font-size:14px;
  outline:none;
  resize:none;
}
#dm-send{
  width:42px;
  height:42px;
  border:none;
  border-radius:10px;
  background:var(--dm-primary, #10a37f);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
}
#dm-send svg{width:20px;height:20px;fill:white;}

/* Message Avatars */
.dm-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}
.dm-bot .dm-avatar {
  background: var(--dm-primary);
  margin-right: 8px;
}
.dm-user .dm-avatar {
  background: #f3f4f6;
  margin-left: 8px;
}
.dm-avatar svg {
  width: 16px;
  height: 16px;
}

/* Animations */
@keyframes dm-slide-in {
  from { opacity: 0; transform: translateY(12px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.dm-msg {
  animation: dm-slide-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

#dm-bubble {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
#dm-bubble:hover {
  transform: scale(1.1);
}
#dm-bubble:active {
  transform: scale(0.9);
}

/* Footer Branding */
#dm-footer{
  padding: 8px 16px;
  background: #ffffff;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
}
#dm-footer span{
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}
#dm-footer svg{
  width: 14px;
  height: 14px;
}

/* Typing Indicator */
.dm-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}
.dm-dot {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: dm-bounce 1.4s infinite ease-in-out both;
}
.dm-dot:nth-child(1) { animation-delay: -0.32s; }
.dm-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes dm-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
`;

  /* ───────────────────────────────────────────────────────────── */
  /*  Icons                                                        */
  /* ───────────────────────────────────────────────────────────── */

  var ICON_CHAT =
    '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>';

  var ICON_SEND =
    '<svg viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2z"/></svg>';

  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  var ICON_LOGO_PATH =
    '<g fill="white" transform="translate(100 100) scale(0.88)"><path d="M -18 -82 L 18 -82 L 18 -48 Q 18 -38 28 -44 L 55 -60 L 70 -45 L 26 -20 Q 12 -12 0 -12 Q -12 -12 -26 -20 L -70 -45 L -55 -60 L -28 -44 Q -18 -38 -18 -48 Z"/><path d="M -18 82 L 18 82 L 18 48 Q 18 38 28 44 L 55 60 L 70 45 L 26 20 Q 12 12 0 12 Q -12 12 -26 20 L -70 45 L -55 60 L -28 44 Q -18 38 -18 48 Z"/><path d="M -82 -18 L -82 18 L -48 18 Q -38 18 -44 28 L -60 55 L -45 70 L -20 26 Q -12 12 -12 0 Q -12 -12 -20 -26 L -45 -70 L -60 -55 L -44 -28 Q -38 -18 -48 -18 Z"/><path d="M 82 -18 L 82 18 L 48 18 Q 38 18 44 28 L 60 55 L 45 70 L 20 26 Q 12 12 12 0 Q 12 -12 20 -26 L 45 -70 L 60 -55 L 44 -28 Q 38 -18 48 -18 Z"/></g>';

  var ICON_LOGO =
    '<svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="#4667ff"/>' +
    ICON_LOGO_PATH +
    "</svg>";

  var ICON_USER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  var ICON_BOT =
    '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    ICON_LOGO_PATH +
    "</svg>";

  /* ───────────────────────────────────────────────────────────── */
  /*  State                                                        */
  /* ───────────────────────────────────────────────────────────── */

  var isOpen = false;
  var botName = "Assistant";
  var greeting = "Hi! How can I help you today?";

  /* ───────────────────────────────────────────────────────────── */

  function injectStyles() {
    var style = document.createElement("style");
    style.id = "dm-styles";
    style.textContent =
      css + ` :root { --dm-primary: ${primaryColor}; }`;
    document.head.appendChild(style);
  }

  function buildWidget() {
    var root = document.createElement("div");
    root.id = "dm-widget-root";
    root.innerHTML = `
      <div id="dm-chat-window">
        <div id="dm-header">
          <div class="dm-header-left">
            <div class="dm-header-avatar">${ICON_BOT}</div>
            <div class="dm-header-info">
              <div class="dm-header-name">${botName}</div>
              <div class="dm-header-status">
                <span class="dm-status-dot"></span>
                Online
              </div>
            </div>
          </div>
          <button id="dm-close">${ICON_CLOSE}</button>
        </div>
        <div id="dm-messages"></div>
        <div id="dm-input-area">
          <textarea id="dm-input" rows="1" placeholder="Message..."></textarea>
          <button id="dm-send">${ICON_SEND}</button>
        </div>
        <a href="https://deploymind.ai" target="_blank" id="dm-footer">
          <span>Powered by DeployMind</span>
          ${ICON_LOGO}
        </a>
      </div>
      <button id="dm-bubble">${ICON_CHAT}</button>
    `;
    document.body.appendChild(root);
  }

  function appendMessage(text, isUser) {
    var container = document.getElementById("dm-messages");
    var row = document.createElement("div");
    row.className = "dm-msg " + (isUser ? "dm-user" : "dm-bot");

    var avatar = document.createElement("div");
    avatar.className = "dm-avatar";
    avatar.innerHTML = isUser ? ICON_USER : ICON_BOT;

    var bubble = document.createElement("div");
    bubble.className = "dm-bubble-text";
    bubble.innerHTML = isUser ? text : renderMarkdown(text);

    if (isUser) {
      row.appendChild(bubble);
      row.appendChild(avatar);
    } else {
      row.appendChild(avatar);
      row.appendChild(bubble);
    }

    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function toggleTyping(show) {
    var container = document.getElementById("dm-messages");
    var existing = document.getElementById("dm-typing-indicator");

    if (show && !existing) {
      var row = document.createElement("div");
      row.id = "dm-typing-indicator";
      row.className = "dm-msg dm-bot";
      row.innerHTML = `
        <div class="dm-avatar">${ICON_BOT}</div>
        <div class="dm-bubble-text dm-typing">
          <div class="dm-dot"></div>
          <div class="dm-dot"></div>
          <div class="dm-dot"></div>
        </div>
      `;
      container.appendChild(row);
      container.scrollTop = container.scrollHeight;
    } else if (!show && existing) {
      existing.remove();
    }
  }

  function sendMessage(text) {
    if (!text.trim()) return;

    appendMessage(text, true);
    toggleTyping(true);

    fetch(API_BASE + "/api/widget/" + EMBED_TOKEN + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    })
      .then(async (r) => {
        toggleTyping(false);
        const data = await r.json();
        if (!r.ok) {
          throw new Error(data.detail || "Server error");
        }
        return data;
      })
      .then((data) => {
        appendMessage(data.response || "No response received.", false);
      })
      .catch((err) => {
        toggleTyping(false);
        appendMessage("Error: " + err.message, false);
      });
  }

  function toggleChat() {
    isOpen = !isOpen;
    var win = document.getElementById("dm-chat-window");
    win.classList.toggle("open", isOpen);

    if (isOpen && document.getElementById("dm-messages").children.length === 0) {
      appendMessage(greeting, false);
    }
  }

  function init() {
    fetch(API_BASE + "/api/widget/" + EMBED_TOKEN + "/info")
      .then((r) => r.json())
      .then((data) => {
        if (data.name) botName = data.name;
        if (data.greeting) greeting = data.greeting;
      })
      .catch((err) => {
        console.error("[DeployMind Widget] Failed to load config:", err);
      })
      .finally(() => {
        injectStyles();
        buildWidget();

        document
          .getElementById("dm-bubble")
          .addEventListener("click", toggleChat);

        document
          .getElementById("dm-close")
          .addEventListener("click", toggleChat);

        var input = document.getElementById("dm-input");
        var send = document.getElementById("dm-send");

        send.addEventListener("click", function () {
          sendMessage(input.value);
          input.value = "";
        });

        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send.click();
          }
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();