# KryptoEwolucja – Webowa gra edukacyjna

**KryptoEwolucja** to interaktywna gra planszowa w przeglądarce stworzona z wykorzystaniem Flask i HTML/JS. Uczy przez zabawę mechanizmów Web3, blockchaina oraz kryptowalut.

## 🔧 Jak uruchomić lokalnie

```bash
git clone https://github.com/twoj_uzytkownik/kryptoewolucja.git
cd kryptoewolucja
pip install -r requirements.txt
python app.py
```

Otwórz przeglądarkę i wejdź na `http://localhost:5000`.

## 🌍 Wdrożenie na Render

1. Zaloguj się do [Render.com](https://render.com)
2. Połącz repozytorium z GitHub
3. Wybierz:

   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `python app.py`

4. Zmienna środowiskowa:
   - `PORT`: automatycznie przypisywana przez Render

## 📁 Struktura projektu

```
├── app.py                 # Główny backend Flask
├── templates/
│   └── index.html         # Frontend gry
├── requirements.txt       # Lista zależności
└── save_game.json         # Plik zapisu stanu gry
```

## 📚 Funkcje gry

- Tura gracza z rzutem kością
- Karty projektów Web3 do wyboru
- Rozwój projektów z czasem
- Zapisywanie i wczytywanie gry
- Obsługa wielu graczy (PvP i PvE)

---

Projekt edukacyjny. Wszelkie prawa zastrzeżone © 2025
