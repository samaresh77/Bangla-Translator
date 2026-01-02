chrome.storage.local.get(["usage"], (res) => {
  const usage = res.usage;
  if (!usage) return;

  document.getElementById("usage").innerText =
    `Today's usage: ${usage.count}/20`;
});
