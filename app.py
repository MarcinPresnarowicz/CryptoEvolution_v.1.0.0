from flask import Flask, jsonify, session, request
from flask_cors import CORS
import random, os, json

app = Flask(__name__)
app.secret_key = 'krypto_secret_key'
CORS(app)

plansza = [
    "Start", "Szansa", "Projekt", "DAO", "Quiz", "Wsparcie", "Pułapka", "Premia", "MetaDAO",
    "Szansa", "DAO", "Quiz", "Projekt", "Wsparcie", "Pułapka", "Premia", "Szansa", "Quiz",
    "MetaDAO", "Projekt", "DAO", "Wsparcie", "Pułapka", "Premia", "Quiz", "Szansa", "Projekt",
    "MetaDAO", "Premia", "Start"
]

projekty = [
    {"nazwa": "NFT Marketplace", "tur_pozostalo": 3, "zwrot": 200},
    {"nazwa": "Platforma DeFi", "tur_pozostalo": 4, "zwrot": 250},
    {"nazwa": "Gra Web3", "tur_pozostalo": 2, "zwrot": 150},
    {"nazwa": "Portfel Mobilny", "tur_pozostalo": 3, "zwrot": 180},
    {"nazwa": "MetaDAO Community", "tur_pozostalo": 5, "zwrot": 300}
]

def nowy_gracz(imie, bot=False):
    return {"imie": imie, "poz": 0, "portfel": 1000, "projekty": [], "bot": bot}

@app.route("/")
def index():
    return "✅ API KryptoEwolucja działa poprawnie!"

@app.route("/start")
def start():
    session['gracze'] = [nowy_gracz("Ty"), nowy_gracz("Bot1", True)]
    session['plansza'] = plansza
    session['tura'] = 0
    session['ostatnia_karta'] = {}
    session['propozycje_projektow'] = []
    return jsonify({"message": "Gra rozpoczęta"})

@app.route("/projekty_dostepne")
def projekty_dostepne():
    wybory = random.sample(projekty, 2)
    session['propozycje_projektow'] = wybory
    return jsonify({"projekty": wybory})

@app.route("/wybierz_projekt", methods=["POST"])
def wybierz_projekt():
    index = request.json.get("index", -1)
    gracze = session.get("gracze", [])
    tura = session.get("tura", 0)
    propozycje = session.get("propozycje_projektow", [])
    if gracze and 0 <= index < len(propozycje):
        gracz = gracze[(tura - 1) % len(gracze)]
        gracz['projekty'].append(propozycje[index])
        session['ostatnia_karta'] = propozycje[index]
        session['gracze'] = gracze
        session['propozycje_projektow'] = []
        return jsonify({"message": f"Wybrano projekt {propozycje[index]['nazwa']}"})
    return jsonify({"message": "Błędny wybór projektu."})

@app.route("/move", methods=["POST"])
def move():
    gracze = session.get("gracze", [])
    tura = session.get("tura", 0)
    if not gracze:
        return jsonify({"message": "Brak graczy!"})
    gracz = gracze[tura % len(gracze)]
    rzut = random.randint(1, 6)
    gracz['poz'] = (gracz['poz'] + rzut) % len(plansza)
    pole = plansza[gracz['poz']]
    efekt = ""

    for p in gracz['projekty']:
        p['tur_pozostalo'] -= 1
    zwroty = [p for p in gracz['projekty'] if p['tur_pozostalo'] <= 0]
    for z in zwroty:
        gracz['portfel'] += z['zwrot']
        efekt += f" Projekt {z['nazwa']} zakończony: +{z['zwrot']} zł. "
        gracz['projekty'].remove(z)

    if pole == "Projekt":
        efekt += " Wybierz projekt."
    elif pole == "Szansa":
        efekt += " Losuj kartę Szansy."
    elif pole == "DAO":
        efekt += " Głosowanie w DAO."
    elif pole == "Quiz":
        efekt += " Rozwiąż quiz!"
    elif pole == "Pułapka":
        efekt += " Strata 100 zł!"
        gracz['portfel'] = max(0, gracz['portfel'] - 100)
    elif pole == "Premia":
        efekt += " Otrzymujesz premię 150 zł!"
        gracz['portfel'] += 150
    elif pole == "Wsparcie":
        efekt += " Otrzymujesz wsparcie od innego gracza."
    elif pole == "MetaDAO":
        efekt += " Spotkanie MetaDAO. Możliwe decyzje sieciowe."

    session['gracze'] = gracze
    session['tura'] = tura + 1
    return jsonify({"gracz": gracz, "rzut": rzut, "pole": pole, "efekt": efekt})

@app.route("/get_state")
def get_state():
    return jsonify({
        "gracze": session.get("gracze", []),
        "plansza": session.get("plansza", []),
        "ostatnia_karta": session.get("ostatnia_karta", {}),
        "propozycje_projektow": session.get("propozycje_projektow", [])
    })

@app.route("/save_game", methods=["POST"])
def save_game():
    stan = {
        "gracze": session.get("gracze", []),
        "plansza": session.get("plansza", plansza),
        "tura": session.get("tura", 0),
        "ostatnia_karta": session.get("ostatnia_karta", {}),
        "propozycje_projektow": session.get("propozycje_projektow", [])
    }
    with open("save_game.json", "w") as f:
        json.dump(stan, f)
    return jsonify({"message": "Gra zapisana."})

@app.route("/load_game")
def load_game():
    try:
        with open("save_game.json") as f:
            stan = json.load(f)
        session.update(stan)
        return jsonify({"message": "Gra wczytana."})
    except Exception as e:
        return jsonify({"message": f"Błąd: {str(e)}"})

# Uruchamianie lokalne tylko jeśli nie Render
if __name__ == '__main__' and os.environ.get("RENDER") != "true":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
