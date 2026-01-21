# Raport indywidualny – Sprint 8

Imię i nazwisko: Piotr Kozera

Zespół: Granat

Numer sprintu: 8

Okres: 14.01.2026 - 21.01.2026
<br/><br/>

### Zakres moich działań:

1. Refactor parametrów do generowania zadań (random_values_conditions)
2. Dodanie większej ilości zadań (exercises) do bazy danych
3. Paczka aplikacja na telefon
<br/><br/>

### Wkład w projekt:
Konsekwentnie według struktury z poprzedniego indywidualnego raportu tygodniowego zmodyfikowałem sposób zapisu parametrów do generowania zadań na taką strukturę w JSON:
{
    "variables": ["a", "b"],
    "setsOfNumbers": [Z, Z],
    "ranges": [[2, 5, "cc"], [2, 5, "cc"]],
    "additional": ""
}

Zmieniłem obsługę zapisu zadań z losowymi wartościami w klasie Exercise oraz zaktualizowałem każde zadanie w bazie danych korzystające z losowych wartości, aby używało nowego zapisu.

Do każdej lekcji w bazie danych dodałem co najmniej 8 zadań odpowiadających tematowi lekcji, aby aplikacja nie wyświetlała pustych lekcji do wykonania dla użytkownika.

W dalszym ciągu pracuje nad przeniesieniem gry do formy aplikacji na telefon. Planowałem hostować backend za pomocą Vercel, jednak to rozwiązanie nie pozwala na tworzenie sesji użytkownika przechowywanych po stronie serwera (serverless), więc implementacja tego wymagała by sporej przebudowy backendu. Postanowiłem hostować backend z wykorzystaniem okresu próbnego na Railway. Próbowałem wygenerować aplikacje WebView z wykorzystaniem generatorów online, jednak nie uzyskałem zadowalającego rezultatu. Spróbuje to zrobić ponownie, a jeśli ponownie skończy się to nie powodzeniem napisze taką aplikacje WebView samodzielnie.
<br/><br/>


### Załączniki:
- Refactor parametrów do generowania zadań (random_values_conditions)
  - Issue: gra-mat/gramat#83
  - Commit: [62cdb12](https://github.com/gra-mat/gramat/commit/62cdb12701f15fb54f77f61530dae87dfd4ad477)
- Pobieranie zadań z sesji
  - Issue: gra-mat/gramat#84
  - Commit: [43ab59c](https://github.com/gra-mat/gramat/commit/43ab59c31d9feb5f03ac4f99dec14d93b498ec0f)
<br/><br/>

### Samoocena:

| Obszar             | Ocena (1–5) | Komentarz                                               |     
| ------------------ | ----------- | ------------------------------------------------------- | 
| Zaangażowanie      | 4.5         | Dużo się dowiedziałem podejmując się zadań w tym sprincie   |     
| Wkład merytoryczny | 4           | Mój wkład w tym sprincie nie jest przełomowy, ale popycha projekt trochę do przodu |    
| Komunikacja        | 4           | Zadania nie wymagały dużej koordynacji pracy z zespołem  |     
| Terminowość        | 4           | Pracuje dalej nad aplikacją na telefon |     

### Refleksja:

Jeśli nie uda się wygenerować aplikacji WebView trzeba będzie napisać ją samemu.