chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_TRANSLATION") {
    alert("বাংলা অনুবাদ:\n\n" + msg.text);
  }
});
