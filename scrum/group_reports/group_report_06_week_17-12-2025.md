# Raport grupowy – Sprint 6
Okres: 17.12.2025 - 07.01.2025

Zespół: Granat

Sprint typu: 3-tygodniowy

Cele sprintu:

1. Dokończenie zakładki konto

2. Frontend logowania przez Google

3. Widok podsumowania lekcji

4. Widok kampanii

5. Strona główna po zalogowaniu

6. Modyfikacja bazy danych

7. Poprawki do frontendu zadań

Postęp prac:

| Zadanie | Odpowiedzialny | Status | Komentarz |
|----------|----------------|--------|------------|
| Zakladka konto - Ustawienia konta, Slabe strony, Powtorki zadan | Mateusz | W trakcie | Wlasciwie zakonczone, wystarczy tylko dodac fetchowanie z bazy |
| Accuracy, time, xp (update lvla) + implementacja timera w zadaniach | Mateusz | Zakończone | Do poprawy synchronizacja animacji poprawnosci/bledu z przejsciem do kolejnego zadania |
| Modyfikacja bazy danych: dodanie avatarow (URL), przeniesienie zawartości user_reports do users, refactor random_values_conditions | Piotr | W trakcie | Nadal pracuję nad refactorem obsługi zadań o losowych wartościach (kolumna random_values_conditions), tak aby korzystały z parametrów zdefiniowanych w spójnym formacie JSON, stworze do tego osobne zadanie |
| Refactor autentykacji | Piotr | Zakończone |  |
| Implementacja osiągnięć | Piotr | Zakończone | Po wykonaniu każdej lekcji aktualizowane są statystyki użytkownika i sprawdzane jest czy należy przyznać użytkownikowi osiągnięcie. Wszystkie osiągnięcia są widoczne w panelu konta użytkownika (localhost:3000/account.html). Jak na razie dodałem dwa osiągnięcia za zdobycie 10 punktów doświadczenia oraz za zdobycie 50 punktów doświadczenia |
| Częściowe wykonanie komponentu dzielenia pisemnego | Łukasz | Zakończone |  |
| Projekt widoku kampanii | Łukasz | Zakończone |  |
| Front-end logowania przez Google | Mieszko | Zakończone |  |
| Strona glowna po zalogowaniu | Mieszko | Zakończone |  |

Retrospekcja:
Aplikacja jest juz bardziej rozwinieta, wypadaloby jeszcze ulepszyc front-end, ewentualnie dodac pare innych funkcjonalnosci
