const api = "https://cryptoevolution-v-1-0-0.onrender.com";

async function startGame() {
    const res = await fetch(`${api}/start`);
    const data = await res.json();
    document.getElementById("status").innerText = data.message;
    updateBoard();
}

async function ruch() {
    const res = await fetch(`${api}/move`, { method: "POST" });
    const data = await res.json();
    document.getElementById("status").innerText = 
        `Gracz: ${data.gracz.imie}\nRzut: ${data.rzut}\nPole: ${data.pole}\nEfekt: ${data.efekt}`;
    updateBoard();
}

async function updateBoard() {
    const res = await fetch(`${api}/get_state`);
    const state = await res.json();
    let map = state.plansza.map((p, i) => {
        let g = state.gracze.find(gracz => gracz.poz === i);
        return g ? `[${g.imie[0]}]` : `[ ]`;
    });
    document.getElementById("board").innerText = map.join(" ");
