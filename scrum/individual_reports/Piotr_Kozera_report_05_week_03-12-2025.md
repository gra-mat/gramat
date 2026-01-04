
# Raport indywidualny – Sprint 5

Imię i nazwisko: Piotr Kozera

Zespół: Granat

Numer sprintu: 5

Okres: 3.12.2025 - 17.12.2025
<br/><br/>

### Zakres moich działań:

1. Wprowadzenie klas i endpointów reprezentujących pozostałe tabele w bazie danych (backend)
2. Logowanie przez Google
<br/><br/>

### Wkład w projekt:
Rozbudowałem backend o endpointy do pobierania pozostałych typów encji (użytkownik, feedback, dział matematyki, etc.). Zaimplementowałem również logowanie użytkownika aplikacji przez Google po stronie backendu z prostą stroną z odnośnikiem do logowania i stroną do wyświetlenia zdjęcia użytkownika i jego nazwy. Wymagana jest jednak poprawa przejrzystości kodu i przemyślenie struktury endpointów związanych z autentykacją i logowaniem użytkownika, a także wykorzystanie możliwości jakie daje taki sposób logowania poprzez zapisywanie postepów gracza oraz wyświetlanie jego profilu w interfejsie aplikacji.
<br/><br/>

### Załączniki:
- Wprowadzenie klas i endpointów reprezentujących pozostałe tabele w bazie danych (backend)
  - Issue: gra-mat/gramat#54
  - Commit: [abb8f5d](https://github.com/gra-mat/gramat/commit/abb8f5d67de6fbedc1d2b8effbd4742a98ec09dc)
- Logowanie użytkownika z Google API (backend)
  - Issue: gra-mat/gramat#49
  - Commit: [69b580c](https://github.com/gra-mat/gramat/commit/69b580c99e8a658556a10fab54f0a7893eb2f016)
<br/><br/>

### Samoocena:

| Obszar             | Ocena (1–5) | Komentarz                                                                      |     |
| ------------------ | ----------- | ------------------------------------------------------------------------------ | --- |
| Zaangażowanie      | 4           | Rozbudowałem REST API i zrobiłem logowanie przez Google, ale struktura kodu logowania i autentykacji wymaga poprawy |     |
| Wkład merytoryczny | 4           | Dzięki tej zmianie frontend może zostać rozbudowany o obsługę kolejnych rzeczy |     |
| Komunikacja        | 3.5         | Potrzebna będzię zrobić jeszcze dokumentacje użycia REST API                   |     |
| Terminowość        | 4.5         | Wykonałem zaplanowane zadania, jednak muszę poprawić część drugiego z nich     |     |

### Refleksja:

Potrzeba wprowadzić więcej 'corowych' funkcjonalności do tej aplikacji.
