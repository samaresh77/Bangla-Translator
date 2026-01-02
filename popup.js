document.getElementById("translateBtn").addEventListener("click", () => {
  const text = document.getElementById("inputText").value;

  if (!text) return;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(text)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      let translated = "";
      data[0].forEach(item => {
        translated += item[0];
      });
      document.getElementById("output").innerText = translated;
    })
    .catch(() => {
      document.getElementById("output").innerText = "Translation failed";
    });
});
