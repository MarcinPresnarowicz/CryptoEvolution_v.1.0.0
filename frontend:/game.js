const api = "https://cryptoevolution-v-1-0-0.onrender.com";

async function startGame() {
  const res = await fetch(`${api}/start`);
  const data = await res.json();
  document.getElementById("efekt").innerText = data.message;
  render();
}

async function move() {
  const res = await fetch(`${api}/move`, { method: "POST" });
  const data = await res.json();
  document.getElementById("efekt").innerText = `${data.efekt} (Rzut: ${data.rzut}, Pole: ${data.pole})`;
  render();
}

async function render() {
  const res = await fetch(`${api}/get_state`);
  const state = await res.json();
  const plansza = state.plansza;
  const gracze = state.gracze;

  const planszaDiv = document.getElementById("plansza");
  planszaDiv.innerHTML = "";

  plansza.forEach((pole, idx) => {
    const el = document.createElement("div");
    el.className = "pole";
    el.innerText = pole;

    gracze.forEach(g => {
      if (g.poz === idx) {
        el.classList.add("aktywny");
        el.innerText += `\n👤 ${g.imie}`;
      }
    });

    planszaDiv.appendChild(el);
  });
}