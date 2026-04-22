(function () {
  "use strict";

  /* ─────────────────────────────────────────────────────────────
     1. Configuration
  ───────────────────────────────────────────────────────────── */

  const script = document.currentScript || (function () {
    const s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();

  const CONFIG = {
    token:        script.getAttribute("data-token") || "",
    apiBase:      script.getAttribute("data-api")      || "https://api.deploychat.in",
    position:     script.getAttribute("data-position") || "bottom-right",
    primaryColor: script.getAttribute("data-color")    || "#1D2020",
    bubbleRadius: script.getAttribute("data-radius")   || "12px",
  };

  if (!CONFIG.token) {
    console.warn("[DeployChat Widget] Missing data-token attribute.");
    return;
  }

  /* ─────────────────────────────────────────────────────────────
     2. Icons  — clean 24×24 stroked SVGs
  ───────────────────────────────────────────────────────────── */

  const ICONS = {
    CHAT: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8.5L4 21.5V18H5a3 3 0 0 1-3-3V6Z"/>
    </svg>`,

    CLOSE: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>`,

    SEND: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>`,

    BOT: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
      stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v1m0 16v1M3 12h1m16 0h1M5.636 5.636l.707.707m11.314 11.314.707.707M5.636 18.364l.707-.707m11.314-11.314.707-.707"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>`,

    USER: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
      stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>`,
  };

  /* ─────────────────────────────────────────────────────────────
     3. Utilities
  ───────────────────────────────────────────────────────────── */

  const Utils = {
    escHtml(str) {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },

    renderMarkdown(text) {
      if (!text) return "";
      return this.escHtml(text)
        .replace(/```([\s\S]*?)```/g, (_, c) => `<pre class="dm-pre"><code class="dm-code-block">${c}</code></pre>`)
        .replace(/`([^`]+)`/g, '<code class="dm-code">$1</code>')
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
    },
  };

  /* ─────────────────────────────────────────────────────────────
     4. Widget
  ───────────────────────────────────────────────────────────── */

  const ChatWidget = {
    isOpen: false,
    botName: "Assistant",
    greeting: "Hi! How can I help you today?",
    elements: {},
    chatHistory: [],
    sessionId: null,
    widgetToken: null,

    init() {
      const storageKey = `dm_session_${CONFIG.token}`;
      let sid = sessionStorage.getItem(storageKey);
      if (!sid) {
        sid = "sess_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        sessionStorage.setItem(storageKey, sid);
      }
      this.sessionId = sid;

      this.widgetTokenPromise = this.fetchWidgetToken();
      this.fetchInfo().finally(() => {
        this.injectFont();
        this.injectStyles();
        this.buildUI();
        this.bindEvents();
      });
    },

    async fetchInfo() {
      try {
        const r = await fetch(`${CONFIG.apiBase}/api/widget/${CONFIG.token}/info`);
        const d = await r.json();
        if (d.name)     this.botName  = d.name;
        if (d.greeting) this.greeting = d.greeting;
      } catch (e) {
        console.error("[DeployChat Widget] Failed to load config.", e);
      }
    },

    async fetchWidgetToken() {
      try {
        const r = await fetch(
          `${CONFIG.apiBase}/api/widget/${CONFIG.token}/init?session_id=${encodeURIComponent(this.sessionId)}`
        );
        const d = await r.json();
        if (d.widget_token) this.widgetToken = d.widget_token;
      } catch (e) {
        console.error("[DeployChat Widget] Failed to obtain widget token.", e);
      }
    },

    injectFont() {
      if (document.getElementById("dm-font")) return;
      const link = document.createElement("link");
      link.id   = "dm-font";
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    },

    injectStyles() {
      const right  = CONFIG.position.includes("right");
      const bottom = CONFIG.position.includes("bottom");

      const css = document.createElement("style");
      css.id = "dm-styles";
      css.textContent = `
        #dm-widget-root {
          --dm-primary:     ${CONFIG.primaryColor};
          --dm-primary-fg:  #ffffff;
          --dm-primary-sub: ${CONFIG.primaryColor}18;

          --dm-bg:      #ffffff;
          --dm-surface: #F5F5F4;
          --dm-border:  #E7E5E4;
          --dm-text:    #1D2020;
          --dm-muted:   #6B6E6E;
          --dm-lime:    #D4FB5F;

          --dm-r-xs: 6px;
          --dm-r-sm: 10px;
          --dm-r-md: 14px;
          --dm-r-lg: 18px;

          --dm-shadow:      0 2px 8px rgba(29,32,32,.06), 0 0 0 1px rgba(29,32,32,.05);
          --dm-shadow-lift: 0 8px 32px rgba(29,32,32,.10), 0 0 0 1px rgba(29,32,32,.06);
        }

        #dm-widget-root *, #dm-widget-root *::before, #dm-widget-root *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }
        #dm-widget-root button { cursor: pointer; font-family: inherit; }
        #dm-widget-root a      { text-decoration: none; }

        #dm-widget-root {
          position: fixed;
          ${right  ? "right: 20px;" : "left: 20px;"}
          ${bottom ? "bottom: 20px;" : "top: 20px;"}
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          align-items: ${right ? "flex-end" : "flex-start"};
          gap: 12px;
          -webkit-font-smoothing: antialiased;
          letter-spacing: -0.005em;
        }

        /* ── Launcher bubble ── */
        #dm-bubble {
          width: 50px;
          height: 50px;
          border-radius: ${CONFIG.bubbleRadius};
          background: var(--dm-primary);
          border: none;
          color: var(--dm-primary-fg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--dm-shadow);
          transition: transform 0.16s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.16s ease;
          flex-shrink: 0;
        }
        #dm-bubble svg  { width: 22px; height: 22px; }
        #dm-bubble:hover  { transform: scale(1.07); box-shadow: var(--dm-shadow-lift); }
        #dm-bubble:active { transform: scale(0.93); }

        /* ── Chat window ── */
        #dm-chat-window {
          width: 370px;
          max-height: 560px;
          border-radius: var(--dm-r-lg);
          background: var(--dm-bg);
          border: 1px solid var(--dm-border);
          box-shadow: var(--dm-shadow-lift);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px) scale(0.97);
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.34,1.2,0.64,1);
        }
        #dm-chat-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        /* ── Header ── */
        #dm-header {
          padding: 14px 16px 13px;
          background: var(--dm-bg);
          border-bottom: 1px solid var(--dm-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .dm-header-left { display: flex; align-items: center; gap: 10px; }
        .dm-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--dm-r-sm);
          background: var(--dm-primary);
          color: var(--dm-primary-fg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dm-header-avatar svg { width: 18px; height: 18px; }
        .dm-header-name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--dm-text);
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .dm-header-status {
          font-size: 11px;
          font-weight: 500;
          color: var(--dm-muted);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 3px;
        }
        .dm-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }
        #dm-close {
          width: 28px; height: 28px;
          border: none; background: none;
          color: var(--dm-muted);
          border-radius: var(--dm-r-xs);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.12s, color 0.12s;
          margin: -4px -4px -4px 0;
        }
        #dm-close:hover { background: var(--dm-surface); color: var(--dm-text); }
        #dm-close svg { width: 15px; height: 15px; }

        /* ── Messages ── */
        #dm-widget-root #dm-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px 14px;
          background: var(--dm-surface);
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
          min-height: 0;
        }
        #dm-messages::-webkit-scrollbar { width: 3px; }
        #dm-messages::-webkit-scrollbar-track { background: transparent; }
        #dm-messages::-webkit-scrollbar-thumb { background: var(--dm-border); border-radius: 2px; }

        .dm-msg {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          animation: dm-up 0.2s ease forwards;
        }
        .dm-msg.dm-user { justify-content: flex-end; }
        .dm-msg.dm-bot  { justify-content: flex-start; }

        .dm-bubble-text {
          max-width: 76%;
          padding: 9px 13px !important;
          font-size: 13px;
          line-height: 1.6;
          word-break: break-word;
        }
        .dm-msg.dm-bot .dm-bubble-text {
          background: var(--dm-bg);
          color: var(--dm-text);
          border: 1px solid var(--dm-border);
          border-radius: var(--dm-r-md) var(--dm-r-md) var(--dm-r-md) 4px;
        }
        .dm-msg.dm-user .dm-bubble-text {
          background: var(--dm-primary);
          color: var(--dm-primary-fg);
          border-radius: var(--dm-r-md) var(--dm-r-md) 4px var(--dm-r-md);
        }

        .dm-code {
          font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
          background: var(--dm-surface);
          color: var(--dm-text);
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 11.5px;
        }
        .dm-pre {
          background: #18181b;
          color: #d4d4d8;
          padding: 10px 12px;
          border-radius: var(--dm-r-sm);
          overflow-x: auto;
          margin-top: 6px;
          font-size: 11.5px;
        }
        .dm-code-block { font-family: ui-monospace, 'Cascadia Code', Menlo, monospace; white-space: pre; }

        .dm-avatar {
          width: 24px; height: 24px;
          border-radius: var(--dm-r-xs);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dm-bot  .dm-avatar { background: var(--dm-primary-sub); color: var(--dm-primary); }
        .dm-user .dm-avatar { background: var(--dm-border); color: var(--dm-muted); }
        .dm-avatar svg { width: 13px; height: 13px; }

        /* ── Input ── */
        #dm-widget-root #dm-input-area {
          padding: 10px 12px;
          background: var(--dm-bg);
          border-top: 1px solid var(--dm-border);
          display: flex;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }
        #dm-widget-root #dm-input {
          flex: 1;
          border: 1px solid var(--dm-border);
          border-radius: var(--dm-r-sm);
          padding: 8px 11px;
          font-size: 13px;
          font-family: inherit;
          color: var(--dm-text);
          background: var(--dm-surface);
          outline: none;
          resize: none;
          line-height: 1.55;
          max-height: 110px;
          transition: border-color 0.15s, background 0.15s;
        }
        #dm-widget-root #dm-input::placeholder { color: var(--dm-muted); }
        #dm-widget-root #dm-input:focus { border-color: var(--dm-primary); background: var(--dm-bg); }

        #dm-send {
          width: 34px; height: 34px;
          flex-shrink: 0;
          border: none;
          border-radius: var(--dm-r-sm);
          background: var(--dm-primary);
          color: var(--dm-primary-fg);
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.14s, transform 0.14s;
        }
        #dm-send:hover  { opacity: 0.82; }
        #dm-send:active { transform: scale(0.91); }
        #dm-send svg { width: 15px; height: 15px; }

        /* ── Footer ── */
        #dm-footer {
          padding: 6px 12px;
          background: var(--dm-bg);
          border-top: 1px solid var(--dm-border);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-shrink: 0;
          color: var(--dm-muted);
          transition: color 0.12s;
        }
        #dm-footer:hover { color: var(--dm-text); }
        #dm-footer span {
          font-size: 10.5px;
          font-weight: 500;
        }
        .dm-footer-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--dm-lime);
          flex-shrink: 0;
        }

        /* ── Typing ── */
        .dm-typing { display: flex; align-items: center; gap: 3px; padding: 3px 2px; }
        .dm-dot {
          width: 4px; height: 4px;
          background: var(--dm-muted);
          border-radius: 50%;
          animation: dm-bounce 1.3s infinite ease-in-out both;
        }
        .dm-dot:nth-child(1) { animation-delay: -0.26s; }
        .dm-dot:nth-child(2) { animation-delay: -0.13s; }
        .dm-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes dm-up {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dm-bounce {
          0%, 80%, 100% { transform: scale(0.55); opacity: 0.35; }
          40%            { transform: scale(1);    opacity: 1; }
        }

        @media (max-width: 420px) {
          #dm-chat-window { width: calc(100vw - 28px); max-height: 72dvh; }
          #dm-widget-root { ${right ? "right: 14px;" : "left: 14px;"} bottom: 14px; }
        }
      `;
      document.head.appendChild(css);
    },

    buildUI() {
      const root = document.createElement("div");
      root.id = "dm-widget-root";

      try {
        const hostFont = window.getComputedStyle(document.body).fontFamily;
        const ua = /^("?times( new roman)?"?|"?serif"?|"?sans-serif"?|"?monospace"?)$/i;
        if (hostFont && !ua.test(hostFont.trim())) {
          root.style.fontFamily = `${hostFont}, 'Onest', ui-sans-serif, system-ui, sans-serif`;
        } else {
          root.style.fontFamily = `'Onest', ui-sans-serif, system-ui, sans-serif`;
        }
      } catch (_) {
        root.style.fontFamily = `'Onest', ui-sans-serif, system-ui, sans-serif`;
      }

      root.innerHTML = `
        <div id="dm-chat-window">
          <div id="dm-header">
            <div class="dm-header-left">
              <div class="dm-header-avatar">${ICONS.BOT}</div>
              <div>
                <div class="dm-header-name">${this.botName}</div>
                <div class="dm-header-status">
                  <span class="dm-status-dot"></span>Online
                </div>
              </div>
            </div>
            <button id="dm-close" aria-label="Close chat">${ICONS.CLOSE}</button>
          </div>
          <div id="dm-messages" role="log" aria-live="polite"></div>
          <div id="dm-input-area">
            <textarea id="dm-input" rows="1" placeholder="Message…" aria-label="Message"></textarea>
            <button id="dm-send" aria-label="Send">${ICONS.SEND}</button>
          </div>
          <a href="https://deploychat.ai" target="_blank" rel="noopener" id="dm-footer">
            <span class="dm-footer-dot"></span>
            <span>Powered by DeployChat</span>
          </a>
        </div>
        <button id="dm-bubble" aria-label="Open chat">${ICONS.CHAT}</button>
      `;

      document.body.appendChild(root);

      this.elements = {
        window:   root.querySelector("#dm-chat-window"),
        messages: root.querySelector("#dm-messages"),
        input:    root.querySelector("#dm-input"),
        send:     root.querySelector("#dm-send"),
        bubble:   root.querySelector("#dm-bubble"),
        close:    root.querySelector("#dm-close"),
      };
    },

    bindEvents() {
      this.elements.bubble.addEventListener("click", () => this.toggleChat());
      this.elements.close.addEventListener("click", () => this.toggleChat());
      this.elements.send.addEventListener("click", () => this.handleSend());
      this.elements.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.handleSend(); }
      });
      this.elements.input.addEventListener("input", () => {
        const el = this.elements.input;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 110) + "px";
      });
    },

    toggleChat() {
      this.isOpen = !this.isOpen;
      this.elements.window.classList.toggle("open", this.isOpen);
      if (this.isOpen && this.elements.messages.children.length === 0) {
        this.appendMessage(this.greeting, false);
      }
      if (this.isOpen) setTimeout(() => this.elements.input.focus(), 220);
    },

    appendMessage(text, isUser) {
      const row = document.createElement("div");
      row.className = `dm-msg ${isUser ? "dm-user" : "dm-bot"}`;
      const avatar = `<div class="dm-avatar">${ICONS.USER}</div>`;
      const bubble = `<div class="dm-bubble-text">${isUser ? Utils.escHtml(text) : Utils.renderMarkdown(text)}</div>`;
      // bot messages: bubble only (no avatar); user messages: bubble + avatar
      row.innerHTML = isUser ? bubble + avatar : bubble;
      this.elements.messages.appendChild(row);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    },

    setInputDisabled(disabled) {
      this.elements.input.disabled = disabled;
      this.elements.send.disabled = disabled;
      this.elements.send.style.opacity = disabled ? "0.5" : "";
      this.elements.input.style.opacity = disabled ? "0.6" : "";
    },

    toggleTyping(show) {
      const id = "dm-typing-indicator";
      if (show && !document.getElementById(id)) {
        const row = document.createElement("div");
        row.id = id;
        row.className = "dm-msg dm-bot";
        row.innerHTML = `
          <div class="dm-bubble-text dm-typing">
            <div class="dm-dot"></div>
            <div class="dm-dot"></div>
            <div class="dm-dot"></div>
          </div>`;
        this.elements.messages.appendChild(row);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      } else if (!show) {
        document.getElementById(id)?.remove();
      }
    },

    handleSend() {
      const text = this.elements.input.value.trim();
      if (!text) return;
      this.elements.input.value = "";
      this.elements.input.style.height = "auto";
      this.appendMessage(text, true);
      this.toggleTyping(true);
      this.setInputDisabled(true);
      this.chatHistory.push({ role: "user", content: text });

      const doFetch = (token) =>
        fetch(`${CONFIG.apiBase}/api/widget/${CONFIG.token}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            session_id: this.sessionId,
            history: this.chatHistory.slice(0, -1),
            widget_token: token,
          }),
        });

      const sendMessage = async () => {
        try {
          // Wait for the token if the /init call is still in flight
          if (!this.widgetToken) await this.widgetTokenPromise;
          let r = await doFetch(this.widgetToken);
          // Token expired — refresh once and retry
          if (r.status === 403) {
            await this.fetchWidgetToken();
            r = await doFetch(this.widgetToken);
          }
          this.toggleTyping(false);
          this.setInputDisabled(false);
          const d = await r.json();
          if (!r.ok) throw new Error(d.detail || "Server error");
          const reply = d.response || "No response received.";
          this.chatHistory.push({ role: "assistant", content: reply });
          this.appendMessage(reply, false);
        } catch (err) {
          this.toggleTyping(false);
          this.setInputDisabled(false);
          this.appendMessage("Error: " + err.message, false);
        }
      };

      sendMessage();
    },
  };

  /* ─────────────────────────────────────────────────────────────
     5. Boot
  ───────────────────────────────────────────────────────────── */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ChatWidget.init());
  } else {
    ChatWidget.init();
  }
})();
