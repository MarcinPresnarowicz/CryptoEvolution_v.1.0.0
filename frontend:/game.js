const API_BASE = "https://cryptoevolution-v-1-0-0.onrender.com";

async function startGame() {
    const res = await fetch(`${API_BASE}/start`);
    const data = await res.json();
    alert(data.message);
    updateState();
}

async function rollDice() {
    const res = await fetch(`${API_BASE}/move`, {
        method: "POST",
    });
    const data = await res.json();
    document.getElementById("status").innerText = `Gracz: ${data.gracz.imie}\nPole: ${data.pole}\nEfekt: ${data.efekt}\nPortfel: ${data.gracz.portfel}`;
    updateState();
}

async function updateState() {
    const res = await fetch(`${API_BASE}/get_state`);
    const data = await res.json();

    const playersDiv = document.getElementById("players");
    playersDiv.innerHTML = "";
    data.gracze.forEach(g => {
        const el = document.createElement("div");
        el.innerText = `👤 ${g.imie} | Pozycja: ${g.poz} | 💰: ${g.portfel}`;
        playersDiv.appendChild(el);
    });

    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    data.plansza.forEach((p, i) => {
        const el = document.createElement("div");
        el.className = "field";
        const playerOnField = data.gracze.find(g => g.poz === i);
        el.innerText = `${i}: ${p}${playerOnField ? ` 🎯 ${playerOnField.imie}` : ""}`;
        boardDiv.appendChild(el);
    });
}

async function showProjects() {
    const res = await fetch(`${API_BASE}/projekty_dostepne`);
    const data = await res.json();
    const projectDiv = document.getElementById("projects");
    projectDiv.innerHTML = "";
    data.projekty.forEach((p, i) => {
        const btn = document.createElement("button");
        btn.innerText = `🔧 ${p.nazwa} – Zwrot: ${p.zwrot} zł w ${p.tur_pozostalo} tur`;
        btn.onclick = () => pickProject(i);
        projectDiv.appendChild(btn);
    });
}

async function pickProject(index) {
    const res = await fetch(`${API_BASE}/wybierz_projekt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ index })
    });
    const data = await res.json();
    alert(data.message);
    updateState();
}

document.getElementById("startBtn").onclick = startGame;
document.getElementById("rollBtn").onclick = rollDice;
document.getElementById("projectsBtn").onclick = showProjects;
