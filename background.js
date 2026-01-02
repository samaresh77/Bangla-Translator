const DAILY_LIMIT = 20;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-bn",
    title: "Translate to Bengali",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-bn") {
    checkLimitAndTranslate(info.selectionText, tab.id);
  }
});

function checkLimitAndTranslate(text, tabId) {
  const today = new Date().toDateString();

  chrome.storage.local.get(["usage"], (res) => {
    let usage = res.usage || { date: today, count: 0 };

    if (usage.date !== today) {
      usage = { date: today, count: 0 };
    }

    if (usage.count >= DAILY_LIMIT) {
      chrome.tabs.sendMessage(tabId, {
        type: "LIMIT_REACHED"
      });
      return;
    }

    usage.count++;
    chrome.storage.local.set({ usage });
    translate(text, tabId);
  });
}

function translate(text, tabId) {
  fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
      target: "bn",
      format: "text"
    })
  })
    .then(res => res.json())
    .then(data => {
      chrome.tabs.sendMessage(tabId, {
        type: "SHOW_TRANSLATION",
        original: text,
        translated: data.translatedText
      });

      saveHistory(text, data.translatedText);
    });
}

function saveHistory(original, translated) {
  chrome.storage.local.get(["history"], (res) => {
    const history = res.history || [];
    history.unshift({ original, translated, time: Date.now() });
    chrome.storage.local.set({ history: history.slice(0, 50) });
  });
}
