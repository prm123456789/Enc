async function encryptText() {
  const text = document.getElementById("textInput").value;
  const method = document.getElementById("textMethod").value;
  const key = document.getElementById("textKey").value;

  const res = await fetch("/encrypt-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, method, key })
  });

  const data = await res.json();
  document.getElementById("textOutput").value = data.result || data.error;
}

async function encryptFile() {
  const file = document.getElementById("fileInput").files[0];
  const method = document.getElementById("fileMethod").value;
  const key = document.getElementById("fileKey").value;

  if (!file) return alert("Aucun fichier sélectionné.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("method", method);
  formData.append("key", key);

  const res = await fetch("/encrypt-file", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("fileOutput").value = data.result || data.error;
}

function copyResult(id) {
  const output = document.getElementById(id);
  output.select();
  document.execCommand("copy");
  alert("Texte copié !");
    }
