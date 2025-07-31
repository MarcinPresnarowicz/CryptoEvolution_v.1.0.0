const api = "https://cryptoevolution-v-1-0-0.onrender.com"; // Upewnij się, że to Twój backend

async function startGame() {
    const res = await fetch(`${api}/start`);
    const data = await res.json();
    document.getElementById("log").innerText = data.message;
}

async function wykonajRuch() {
    const res = await fetch(`${api}/move`, { method: "POST" });
    const data = await res.json();
    document.getElementById("log").innerText = `Gracz: ${data.gracz.imie}, pole: ${data.pole}, rzut: ${data.rzut}, efekt: ${data.efekt}`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start").onclick = startGame;
    document.getElementById("ruch").onclick = wykonajRuch;
});
