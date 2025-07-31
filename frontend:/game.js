const api = "https://cryptoevolution-v-1-0-0.onrender.com";

// Funkcja startująca grę
async function startGame() {
    try {
        const res = await fetch(`${api}/start`);
        const data = await res.json();
        document.getElementById("log").innerText = data.message;
    } catch (err) {
        document.getElementById("log").innerText = "Błąd połączenia z serwerem.";
        console.error(err);
    }
}

// Funkcja wykonująca ruch
async function wykonajRuch() {
    try {
        const res = await fetch(`${api}/move`, { method: "POST" });
        const data = await res.json();
        document.getElementById("log").innerText =
            `🎲 ${data.gracz.imie} rzucił: ${data.rzut}\n` +
            `🟦 Pole: ${data.pole}\n` +
            `📜 Efekt: ${data.efekt}\n` +
            `💰 Portfel: ${data.gracz.portfel} zł`;
    } catch (err) {
        document.getElementById("log").innerText = "Nie udało się wykonać ruchu.";
        console.error(err);
    }
}

// Przypisanie zdarzeń do przycisków po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start").onclick = startGame;
    document.getElementById("ruch").onclick = wykonajRuch;
});
