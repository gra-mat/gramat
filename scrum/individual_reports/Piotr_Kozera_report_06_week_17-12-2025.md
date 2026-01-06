
# Raport indywidualny – Sprint 6

Imię i nazwisko: Piotr Kozera

Zespół: Granat

Numer sprintu: 6

Okres: 17.12.2025 - 7.01.2026
<br/><br/>

### Zakres moich działań:

1. Modyfikacja bazy danych: dodanie avatarow (URL), przeniesienie zawartości user_reports do users, refactor random_values_conditions
2. Refactor autentykacji
3. Implementacja osiągnięć
<br/><br/>

### Wkład w projekt:
Zmodyfikowałem bazę danych, aby była lepiej obsługiwać konta użytkowników. Lista zmian:
- przechowywanie linków do avatarów użytkowników w kolumnie user_avatar_url
- dodanie trzech kolumn, które wcześniej były w osobnej tabeli: user_strengths, user_weaknesses, user_suggested_exercises
- kolumna user_id ma teraz typ TEXT, ponieważ SQLite przechowuję inty do 8 bajtów, a ID z Google mogą być dłuższe
- kolumna user_password jest teraz NULLABLE (dla obsługi kont Google)

Nadal pracuję nad refactorem obsługi zadań o losowych wartościach (kolumna random_values_conditions), tak aby korzystały z parametrów zdefiniowanych w spójnym formacie JSON, stworze do tego osobne zadanie.

Zmodyfikowałem obsługę kont, aby wpełni wykorzystywać już możliwości logowania przez Google. Lista zmian:
- po zalogowaniu się (localhost:3000/login) tworzony jest obiekt User przechowywany w sesji (dostępny przez endpoint /user/logged)
- panel konta użytkownika (localhost:3000/account.html) pobiera dane użytkownika z sesji zamiast z zdefiniowanego wcześniej na sztywno propa
- dodanie przycisku do wylogowania się w panelu konta użytkownika

Dodałem również obsługę osiągnięć do gry. Po wykonaniu każdej lekcji aktualizowane są statystyki użytkownika i sprawdzane jest czy należy przyznać użytkownikowi osiągnięcie. Wszystkie osiągnięcia są widoczne w panelu konta użytkownika (localhost:3000/account.html). Jak na razie dodałem dwa osiągnięcia za zdobycie 10 punktów doświadczenia oraz za zdobycie 50 punktów doświadczenia.
<br/><br/>

### Załączniki:
- Modyfikacja bazy danych: dodanie avatarow (URL), przeniesienie zawartości user_reports do users, refactor random_values_conditions
  - Issue: gra-mat/gramat#72
  - Commit: [c414778](https://github.com/gra-mat/gramat/commit/c41477872d185998db30bfad70b931bc23e13a82)
- Refactor autentykacji
  - Issue: gra-mat/gramat#74
  - Commit: [c414778](https://github.com/gra-mat/gramat/commit/c41477872d185998db30bfad70b931bc23e13a82)
- Implementacja achievementów
  - Issue: gra-mat/gramat#75
  - Commit: [3389781](https://github.com/gra-mat/gramat/commit/33897812b2f5998e5ada327d3523b50cc0e929dc)
<br/><br/>

### Samoocena:

| Obszar             | Ocena (1–5) | Komentarz                                                                      |     |
| ------------------ | ----------- | ------------------------------------------------------------------------------ | --- |
| Zaangażowanie      | 4           | Podczas wykonywania zadań dotowałem parę rzeczy, aby usprawnić działanie gry   |     |
| Wkład merytoryczny | 4           | Gra obsługuję teraz osiągnięcia gracza                                         |     |
| Komunikacja        | 4           | Zorganizowaliśmy grupowo spotkania, na których omawialiśmy dalszy rozwój gry   |     |
| Terminowość        | 3.5         | Pracuję nadal nad obsługą zadań o losowych wartościach                         |     |

### Refleksja:

Aplikacja jest już w coraz bardziej dojrzalszym stanie, ale nadal potrzebuje więcej ciekawych funkcjonalności.