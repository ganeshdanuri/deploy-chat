(function () {
  "use strict";

  /* ───────────────────────────────────────────────────────────── */
  /*  1. Configuration & Constants                                 */
  /* ───────────────────────────────────────────────────────────── */

  const script = document.currentScript || (function () {
    const s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();

  const CONFIG = {
    token: script.getAttribute("data-token") || "",
    apiBase: script.getAttribute("data-api") || "http://localhost:8000",
    position: script.getAttribute("data-position") || "bottom-right",
    primaryColor: script.getAttribute("data-color") || "#4f46e5",
    secondaryColor: script.getAttribute("data-secondary-color") || "#f1f5f9"
  };

  if (!CONFIG.token) {
    console.warn("[DeployChat Widget] Missing data-token attribute.");
    return;
  }

  const ASSETS = {
    ICONS: {
      CLOSE: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      CHAT: `
        <svg width="800px" height="800px" viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <style type="text/css">
            .st0{fill:white;opacity:0.6;}
            .st1{fill:white;}
            .st2{fill:var(--dm-primary);}
          </style>
          <g>
            <path class="st0" d="M58.5,43.2C59,55.8,69.2,66.2,81.7,67.2c3.5,0.2,7-0.2,10.2-1.2c1.7-0.6,8,2.6,11.6,4.4c0.9,0.4,2-0.4,1.6-1.4   c-1.3-3.5-3.2-9.2-2.3-10.2c4.3-4.9,6.8-11.5,6.3-18.7c-0.9-12.6-11.4-22.8-24.1-23.4C70.1,15.9,57.8,28.2,58.5,43.2z"/>
            <path class="st1" d="M82.2,64.8c-0.8,17.8-15.1,32.5-32.8,33.9c-5,0.3-9.8-0.3-14.4-1.7c-2.3-0.8-11.2,3.6-16.4,6.2   c-1.2,0.6-2.8-0.6-2.2-2c1.9-5,4.5-12.9,3.3-14.4c-6.1-6.9-9.5-16.2-8.9-26.4C12.1,42.7,27,28.3,44.8,27.5   C65.8,26.4,83.1,43.8,82.2,64.8z"/>
            <g>
              <path class="st2" d="M37.4,53.4h18.4c1.2,0,2.3-1.1,2.3-2.3s-1.1-2.3-2.3-2.3H37.4c-1.2,0-2.3,1.1-2.3,2.3    C34.9,52.3,36,53.4,37.4,53.4z"/>
              <path class="st2" d="M55.8,72.6H37.4c-1.2,0-2.3,1.1-2.3,2.3s1.1,2.3,2.3,2.3h18.4c1.2,0,2.3-1.1,2.3-2.3    C58.2,73.7,57.1,72.6,55.8,72.6z"/>
              <path class="st2" d="M65.2,60.6H27.9c-1.2,0-2.3,1.1-2.3,2.3s1.1,2.3,2.3,2.3H65c1.2,0,2.3-1.1,2.3-2.3    C67.5,61.7,66.4,60.6,65.2,60.6z"/>
            </g>
          </g>
        </svg>`,
      SEND: `
        <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path id="angle-right-a" d="M6.45591671,5.04196137 C6.85383224,5.42495181 6.86593141,6.05800118 6.48294097,6.45591671 C6.09995053,6.85383224 5.46690117,6.86593141 5.06898564,6.48294097 L0.597305951,2.1789859 C0.199390421,1.79599546 0.187291244,1.16294609 0.570281683,0.76503056 C0.953272122,0.367115031 1.58632149,0.355015854 1.98423702,0.738006292 L6.45591671,5.04196137 Z"/>
            <path id="angle-right-c" d="M4.58578644,6 L0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L6.70710678,5.29289322 C7.09763107,5.68341751 7.09763107,6.31658249 6.70710678,6.70710678 L1.70710678,11.7071068 C1.31658249,12.0976311 0.683417511,12.0976311 0.292893219,11.7071068 C-0.0976310729,11.3165825 -0.0976310729,10.6834175 0.292893219,10.2928932 L4.58578644,6 Z"/>
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(8 6)">
            <g transform="translate(0 1)">
              <mask id="angle-right-b" fill="#ffffff">
                <use xlink:href="#angle-right-a"/>
              </mask>
              <use fill="currentColor" opacity="0.3" fill-rule="nonzero" xlink:href="#angle-right-a"/>
              <g fill="currentColor" mask="url(#angle-right-b)">
                <rect width="24" height="24" transform="translate(-8 -7)"/>
              </g>
            </g>
            <g transform="translate(1)">
              <mask id="angle-right-d" fill="#ffffff">
                <use xlink:href="#angle-right-c"/>
              </mask>
              <use fill="currentColor" opacity="0.5" fill-rule="nonzero" xlink:href="#angle-right-c"/>
              <g fill="currentColor" mask="url(#angle-right-d)">
                <rect width="24" height="24" transform="translate(-9 -6)"/>
              </g>
            </g>
          </g>
        </svg>`,
      LOGO_PATH: '<g fill="white" transform="translate(100 100) scale(0.88)"><path d="M -18 -82 L 18 -82 L 18 -48 Q 18 -38 28 -44 L 55 -60 L 70 -45 L 26 -20 Q 12 -12 0 -12 Q -12 -12 -26 -20 L -70 -45 L -55 -60 L -28 -44 Q -18 -38 -18 -48 Z"/><path d="M -18 82 L 18 82 L 18 48 Q 18 38 28 44 L 55 60 L 70 45 L 26 20 Q 12 12 0 12 Q -12 12 -26 20 L -70 45 L -55 60 L -28 -44 Q -18 -38 -18 -48 Z"/><path d="M -82 -18 L -82 18 L -48 18 Q -38 18 -44 28 L -60 55 L -45 70 L -20 26 Q -12 12 -12 0 Q -12 -12 -20 -26 L -45 -70 L -60 -55 L -44 -28 Q -38 -18 -48 -18 Z"/><path d="M 82 -18 L 82 18 L 48 18 Q 38 18 44 28 L 60 55 L 45 70 L 20 26 Q 12 12 12 0 Q 12 -12 20 -26 L 45 -70 L 60 -55 L 44 -28 Q 38 -18 48 -18 Z"/></g>',
      USER: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path id="user-c" d="M9,10 C6.23857625,10 4,7.76142375 4,5 C4,2.23857625 6.23857625,0 9,0 C11.7614237,0 14,2.23857625 14,5 C14,7.76142375 11.7614237,10 9,10 Z M9,8 C10.6568542,8 12,6.65685425 12,5 C12,3.34314575 10.6568542,2 9,2 C7.34314575,2 6,3.34314575 6,5 C6,6.65685425 7.34314575,8 9,8 Z M1.99975067,20.0223292 C1.98741862,20.5744762 1.52981788,21.0120827 0.977670834,20.9997507 C0.425523784,20.9874186 -0.0120827307,20.5298179 0.000249326899,19.9776708 C0.145759691,13.46269 3.22368513,11 8.99994472,11 C15.0478478,11 18.1410179,13.4818866 17.9949389,20.0223292 C17.9826068,20.5744762 17.5250061,21.0120827 16.972859,20.9997507 C16.420712,20.9874186 15.9831055,20.5298179 15.9954375,19.9776708 C16.1173753,14.5181134 13.8803831,13 8.99994472,13 C4.37762816,13 2.12225712,14.53731 1.99975067,20.0223292 Z"/>
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(3 1)">
            <g transform="translate(1 5)">
              <mask id="user-b">
                <use xlink:href="#user-a"/>
              </mask>
              <use fill="currentColor" opacity="0.4" xlink:href="#user-a"/>
              <g fill="currentColor" mask="url(#user-b)">
                <rect width="24" height="24" transform="translate(-4 -6)"/>
              </g>
            </g>
            <mask id="user-d" fill="#ffffff">
              <use xlink:href="#user-c"/>
            </mask>
            <use fill="currentColor" fill-rule="nonzero" xlink:href="#user-c"/>
          </g>
        </svg>`,
      BOT: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <polygon id="comment-a" points="0 0 19 0 19 3 16.637 3 15.732 7.26 10.79 3 0 3"/>
            <path id="comment-c" d="M3,2 C2.44771525,2 2,2.44771525 2,3 L2,13 C2,13.5522847 2.44771525,14 3,14 L13,14 L17,18 L17,14 L19,14 C19.5522847,14 20,13.5522847 20,13 L20,3 C20,2.44771525 19.5522847,2 19,2 L3,2 Z M19,16 L19,18 C19,19.7818097 16.8457162,20.6741433 15.5857864,19.4142136 L12.1715729,16 L3,16 C1.34314575,16 0,14.6568542 0,13 L0,3 C0,1.34314575 1.34314575,0 3,0 L19,0 C20.6568542,0 22,1.34314575 22,3 L22,13 C22,14.6568542 20.6568542,16 19,16 Z M5,7 L17,7 C17.5522847,7 18,6.55228475 18,6 C18,5.44771525 17.5522847,5 17,5 L5,5 C4.44771525,5 4,5.44771525 4,6 C4,6.55228475 4.44771525,7 5,7 Z M5,11 L12,11 C12.5522847,11 13,10.5522847 13,10 C13,9.44771525 12.5522847,9 12,9 L5,9 C4.44771525,9 4,9.44771525 4,10 C4,10.5522847 4.44771525,11 5,11 Z"/>
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(1 3)">
            <g transform="translate(2 12)">
              <mask id="comment-b" fill="#ffffff">
                <use xlink:href="#comment-a"/>
              </mask>
              <use fill="currentColor" opacity="0.3" xlink:href="#comment-a"/>
              <g fill="currentColor" mask="url(#comment-b)">
                <rect width="24" height="24" transform="translate(-3 -15)"/>
              </g>
            </g>
            <mask id="comment-d" fill="#ffffff">
              <use xlink:href="#comment-c"/>
            </mask>
            <use fill="currentColor" fill-rule="nonzero" xlink:href="#comment-c"/>
            <g fill="currentColor" mask="url(#comment-d)">
              <rect width="24" height="24" transform="translate(-1 -3)"/>
            </g>
          </g>
        </svg>`
    }
  };

  ASSETS.ICONS.LOGO = `<svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="var(--dm-primary)"/>${ASSETS.ICONS.LOGO_PATH}</svg>`;

  /* ───────────────────────────────────────────────────────────── */
  /*  2. Utilities                                                 */
  /* ───────────────────────────────────────────────────────────── */

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
        .replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="dm-pre"><code class="dm-code-block">${code}</code></pre>`)
        .replace(/`([^`]+)`/g, '<code class="dm-code">$1</code>')
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
    }
  };

  /* ───────────────────────────────────────────────────────────── */
  /*  3. Chat Widget Implementation                                */
  /* ───────────────────────────────────────────────────────────── */

  const ChatWidget = {
    isOpen: false,
    botName: "Assistant",
    greeting: "Hi! How can I help you today?",
    elements: {},
    chatHistory: [],
    sessionId: null,

    init() {
      const storageKey = `dm_session_${CONFIG.token}`;
      let sid = sessionStorage.getItem(storageKey);
      if (!sid) {
        sid = "sess_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        sessionStorage.setItem(storageKey, sid);
      }
      this.sessionId = sid;

      this.fetchInfo()
        .finally(() => {
          this.injectStyles();
          this.buildUI();
          this.bindEvents();
        });
    },

    async fetchInfo() {
      try {
        const r = await fetch(`${CONFIG.apiBase}/api/widget/${CONFIG.token}/info`);
        const data = await r.json();
        if (data.name) this.botName = data.name;
        if (data.greeting) this.greeting = data.greeting;
      } catch (err) {
        console.error("[DeployChat Widget] Failed to load config:", err);
      }
    },

    injectStyles() {
      const posRight = CONFIG.position.includes("right");
      const posBottom = CONFIG.position.includes("bottom");

      const style = document.createElement("style");
      style.id = "dm-styles";
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        :root { 
          --dm-primary: ${CONFIG.primaryColor}; 
          --dm-secondary: ${CONFIG.secondaryColor};
        }
        #dm-widget-root * { box-sizing:border-box; margin:0; font-family: 'Inter', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #dm-widget-root { position:fixed; ${posRight ? "right:24px;" : "left:24px;"} ${posBottom ? "bottom:24px;" : "top:24px;"} z-index:99999; display:flex; flex-direction:column; align-items:${posRight ? "flex-end" : "flex-start"}; gap:12px; }
        #dm-bubble { width:56px; height:56px; border-radius:50%; background:var(--dm-primary, #10a37f); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,.15); color:white; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        #dm-bubble svg { width:32px; height:32px; fill:currentColor; }
        #dm-bubble:hover { transform: scale(1.1); }
        #dm-bubble:active { transform: scale(0.9); }
        #dm-chat-window { width:400px; height:600px; border-radius:16px; background:#ffffff; box-shadow:0 10px 40px rgba(0,0,0,.15); display:flex; flex-direction:column; overflow:hidden; opacity:0; transform:translateY(10px); pointer-events:none; transition:all .2s ease; }
        #dm-chat-window.open { opacity:1; transform:translateY(0); pointer-events:auto; }
        #dm-header { padding: 20px; background: var(--dm-primary); color: white; display: flex; align-items: center; justify-content: space-between; }
        .dm-header-left { display: flex; align-items: center; gap: 12px; }
        .dm-header-avatar { width: 36px; height: 36px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        #dm-header svg { fill: white; }
        .dm-header-info { display: flex; flex-direction: column; }
        .dm-header-name { font-weight: 600; font-size: 15px; line-height: 1.2; }
        .dm-header-status { font-size: 12px; display: flex; align-items: center; gap: 6px; opacity: 0.9; margin-top: 2px; }
        .dm-status-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2); }
        #dm-close { background: none; border: none; cursor: pointer; color: white; padding: 8px; margin: -8px; opacity: 0.7; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; }
        #dm-close:hover { opacity: 1; }
        #dm-close svg { width: 20px; height: 20px; }
        #dm-messages { flex:1; overflow-y:auto; padding:24px 20px; background:#f7f7f8; display:flex; flex-direction:column; gap:18px; }
        .dm-msg { display:flex; width:100%; animation: dm-slide-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .dm-msg.dm-user { justify-content:flex-end; }
        .dm-msg.dm-bot { justify-content:flex-start; gap:10px; }
        .dm-bubble-text { max-width: calc(100% - 48px); padding:12px 14px; border-radius:16px; font-size:14px; line-height:1.5; word-break:break-word; }
        .dm-msg.dm-bot .dm-bubble-text { background:#ffffff; color:#111827; border:1px solid #e5e7eb; border-top-left-radius: 4px; }
        .dm-msg.dm-user .dm-bubble-text { background:var(--dm-primary, #10a37f); color:white; border-bottom-right-radius: 4px; }
        .dm-code { background:rgba(0,0,0,.05); padding:2px 6px; border-radius:6px; font-family:monospace; font-size:12px; }
        .dm-pre { background:#1e1e1e; color:#a6e3a1; padding:12px; border-radius:8px; overflow-x:auto; margin-top:8px; font-size:12px; }
        .dm-code-block { font-family:monospace; white-space:pre; }
        #dm-input-area { padding:16px; background:#ffffff; border-top:1px solid #e5e7eb; display:flex; gap:10px; }
        #dm-input { flex:1; border:1px solid #e5e7eb; border-radius:12px; padding:12px; font-size:14px; outline:none; resize:none; }
        #dm-send { width:42px; height:42px; border:none; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; background: var(--dm-primary); transition: opacity 0.2s, transform 0.2s; color:white; }
        #dm-send:hover { opacity: 0.9; transform: scale(1.05); }
        #dm-send:active { transform: scale(0.95); }
        #dm-send svg { width:24px; height:24px; fill:currentColor; }
        .dm-avatar { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 4px; }
        .dm-bot .dm-avatar { margin-right: 8px; color: var(--dm-primary); }
        .dm-user .dm-avatar { background: var(--dm-secondary); margin-left: 8px; color: #64748b; }
        .dm-avatar svg { width: 18px; height: 18px; fill: currentColor; }
        #dm-footer { padding: 8px 16px; background: #ffffff; border-top: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; }
        #dm-footer span { font-size: 11px; color: #9ca3af; font-weight: 500; }
        #dm-footer svg { width: 14px; height: 14px; }
        .dm-typing { display: flex; align-items: center; gap: 4px; padding: 12px 16px; }
        .dm-dot { width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: dm-bounce 1.4s infinite ease-in-out both; }
        .dm-dot:nth-child(1) { animation-delay: -0.32s; }
        .dm-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes dm-slide-in { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dm-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `;
      document.head.appendChild(style);
    },

    buildUI() {
      const root = document.createElement("div");
      root.id = "dm-widget-root";
      root.innerHTML = `
        <div id="dm-chat-window">
          <div id="dm-header">
            <div class="dm-header-left">
              <div class="dm-header-avatar">${ASSETS.ICONS.LOGO}</div>
              <div class="dm-header-info">
                <div class="dm-header-name">${this.botName}</div>
                <div class="dm-header-status">
                  <span class="dm-status-dot"></span> Online
                </div>
              </div>
            </div>
            <button id="dm-close">${ASSETS.ICONS.CLOSE}</button>
          </div>
          <div id="dm-messages"></div>
          <div id="dm-input-area">
            <textarea id="dm-input" rows="1" placeholder="Message..."></textarea>
            <button id="dm-send">${ASSETS.ICONS.SEND}</button>
          </div>
          <a href="https://deploychat.ai" target="_blank" id="dm-footer">
            <span>Powered by DeployChat</span>
            ${ASSETS.ICONS.LOGO}
          </a>
        </div>
        <button id="dm-bubble">${ASSETS.ICONS.CHAT}</button>
      `;
      document.body.appendChild(root);

      this.elements = {
        window: document.getElementById("dm-chat-window"),
        messages: document.getElementById("dm-messages"),
        input: document.getElementById("dm-input"),
        send: document.getElementById("dm-send"),
        bubble: document.getElementById("dm-bubble"),
        close: document.getElementById("dm-close")
      };
    },

    bindEvents() {
      this.elements.bubble.addEventListener("click", () => this.toggleChat());
      this.elements.close.addEventListener("click", () => this.toggleChat());
      this.elements.send.addEventListener("click", () => this.handleSendMessage());
      this.elements.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    },

    toggleChat() {
      this.isOpen = !this.isOpen;
      this.elements.window.classList.toggle("open", this.isOpen);
      if (this.isOpen && this.elements.messages.children.length === 0) {
        this.appendMessage(this.greeting, false);
      }
    },

    appendMessage(text, isUser) {
      const row = document.createElement("div");
      row.className = `dm-msg ${isUser ? "dm-user" : "dm-bot"}`;

      const avatar = `<div class="dm-avatar">${isUser ? ASSETS.ICONS.USER : ASSETS.ICONS.BOT}</div>`;
      const bubble = `<div class="dm-bubble-text">${isUser ? Utils.escHtml(text) : Utils.renderMarkdown(text)}</div>`;

      row.innerHTML = isUser ? bubble + avatar : avatar + bubble;
      this.elements.messages.appendChild(row);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    },

    toggleTyping(show) {
      const existing = document.getElementById("dm-typing-indicator");
      if (show && !existing) {
        const row = document.createElement("div");
        row.id = "dm-typing-indicator";
        row.className = "dm-msg dm-bot";
        row.innerHTML = `
          <div class="dm-avatar">${ASSETS.ICONS.BOT}</div>
          <div class="dm-bubble-text dm-typing">
            <div class="dm-dot"></div><div class="dm-dot"></div><div class="dm-dot"></div>
          </div>
        `;
        this.elements.messages.appendChild(row);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      } else if (!show && existing) {
        existing.remove();
      }
    },

    handleSendMessage() {
      const text = this.elements.input.value.trim();
      if (!text) return;

      this.elements.input.value = "";
      this.appendMessage(text, true);
      this.toggleTyping(true);

      this.chatHistory.push({ role: "user", content: text });

      fetch(`${CONFIG.apiBase}/api/widget/${CONFIG.token}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: this.sessionId,
          history: this.chatHistory.slice(0, -1)
        }),
      })
        .then(async (r) => {
          this.toggleTyping(false);
          const data = await r.json();
          if (!r.ok) throw new Error(data.detail || "Server error");

          const botResponse = data.response || "No response received.";
          this.chatHistory.push({ role: "assistant", content: botResponse });
          this.appendMessage(botResponse, false);
        })
        .catch((err) => {
          this.toggleTyping(false);
          this.appendMessage("Error: " + err.message, false);
        });
    }
  };

  /* ───────────────────────────────────────────────────────────── */
  /*  4. Initialization                                            */
  /* ───────────────────────────────────────────────────────────── */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ChatWidget.init());
  } else {
    ChatWidget.init();
  }
})();