let tooltip;

function createTooltip(text, x, y) {
  if (tooltip) tooltip.remove();

  tooltip = document.createElement("div");
  tooltip.innerHTML = `
    <div style="font-weight:bold;margin-bottom:5px;">বাংলা অর্থ</div>
    <div>${text}</div>
    <button id="speakBtn">🔊</button>
  `;

  Object.assign(tooltip.style, {
    position: "absolute",
    top: y + 12 + "px",
    left: x + 12 + "px",
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    maxWidth: "320px",
    zIndex: 999999
  });

  document.body.appendChild(tooltip);

  document.getElementById("speakBtn").onclick = () => {
    chrome.tts.speak(text, { lang: "bn-BD", rate: 0.9 });
  };
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_TRANSLATION") {
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    createTooltip(msg.translated, rect.left + scrollX, rect.top + scrollY);
  }

  if (msg.type === "LIMIT_REACHED") {
    alert("Daily free limit reached. Upgrade coming soon!");
  }
});
