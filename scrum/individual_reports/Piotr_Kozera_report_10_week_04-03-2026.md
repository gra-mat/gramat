# Raport indywidualny – Sprint 10

Imię i nazwisko: Piotr Kozera

Zespół: Granat

Numer sprintu: 10

Okres: 04.03.2026 - 11.03.2026
<br/><br/>

### Zakres moich działań:

1. Obsługa zadań z obrazkami
2. Tabela wyników (leaderboard)
3. Tymczasowe użycie starych komponentów do rozwiązywania zadań, logowania i zakładki konta użytkownika
<br/><br/>

### Wkład w projekt:

W tym sprincie dodałem możliwość wprowadzania nowego typu treści zadań (image_text). Po wprowadzeniu nazwy obrazka znajdującego się w katalogu src/frontend/exercise_images w nawiasie klamrowym (np. {image1.png}) w treści pytania w bazie danych jest on zamieniany na odpowiedni węzeł HTML podczas wyświetlania pytania. Dodatkowo znak nowej lini (\n) jest zamieniany na \<br> w HTML.
Drugą rzeczą jaką dodałem w tym sprincie jest tabela wyników, czyli leaderboard. Dzięki niej widać ranking użytkowników, ze względu na ilość uzyskanych punktów doświadczenia. Wraz z zespołem postanowiliśmy, żeby zamiast zakładki ustawień była zakładka tabeli wyników.
Po zcaleniu nowego frontendu z gałęzią main okazało się, że część nowych komponentów nie jest jeszcze gotowa do użycia, zespołowo postanowiliśmy użyć starego komponentów do rozwiązywania zadań, logowania i zakładki konta użytkownika. Poprawiłem odwołania w starych komponentach i wprowadziłem tymczasowe zmiany w nowych, aby umożliwić korzystanie z wszystkich funkcjonalności aplikacji.

### Załączniki:
- Obsługa zadań z obrazkami
  - Issue: gra-mat/gramat#91
- Tabela wyników (leaderboard)
  - Issue: gra-mat/gramat#18
- Tymczasowe użycie starych komponentów do rozwiązywania zadań, logowania i zakładki konta użytkownika
  - Issue: gra-mat/gramat#100
  - Commit: [a828124](https://github.com/gra-mat/gramat/commit/a828124f282fce10b7dfb4a8f581eab41d20f974)
<br/><br/>

### Samoocena:

| Obszar             | Ocena (1–5) | Komentarz                                               |     
| ------------------ | ----------- | ------------------------------------------------------- | 
| Zaangażowanie      | 4.5         | Rozwinąłem zaplanowaną część aplikacji i wprowadziłem tymczasowe rozwiązania dla nowego frontendu   |     
| Wkład merytoryczny | 4.5           | Wcześniej dodane funkcjonlaności dzięki moim zmianom są dostępne w obecnej wersji |    
| Komunikacja        | 4.5           | Uzgodniliśmy z zespołem w jaki sposób wykonać merge frontendu  |     
| Terminowość        | 4           | Zadanie zostało wykonane w przeznaczonym na nie czasie, ale potrzebuje zcommitować 2 z nich do nowej wersji aplikacji |     

### Refleksja:

Muszę jeszcze wrzucić na main dwa pierwsze zadania, ponieważ przez merge frontendu mam je narazie tylko na kopii lokalnej.