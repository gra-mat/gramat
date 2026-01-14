# Raport indywidualny – Sprint 7

Imię i nazwisko: Piotr Kozera

Zespół: Granat

Numer sprintu: 7

Okres: 07.01.2026 - 14.01.2026
<br/><br/>

### Zakres moich działań:

1. Refactor parametrów do rozwiązywania zadań
2. Pobieranie zadań z sesji
<br/><br/>

### Wkład w projekt:
Zmodyfikowałem aplikacje w taki sposób, aby zadania były pobieranie przez frontend z backendu z sesji, zamiast bezpośrednio z bazy danych. Dzięki temu aplikacja będzie bezpieczniejsza przeciwko oszukiwaniu i podglądaniu odpowiedzi. Nadal pracuje nad refactorem parametrów do rozwiązywania zadań. Chcę, aby były zapisywane w struktursze JSON takiej jak ta:
{
    "variables": ["a", "b"],
    "setsOfNumbers": [Z, Z],
    "ranges": [[2, 5, "cc"], [2, 5, "cc"]],
    "additional": ""
}
<br/><br/>

### Załączniki:
- Refactor parametrów do rozwiązywania zadań
  - Issue: gra-mat/gramat#83
- Pobieranie zadań z sesji
  - Issue: gra-mat/gramat#84
  - Commit: [43ab59c](https://github.com/gra-mat/gramat/commit/43ab59c31d9feb5f03ac4f99dec14d93b498ec0f)
<br/><br/>

### Samoocena:

| Obszar             | Ocena (1–5) | Komentarz                                               |     |
| ------------------ | ----------- | ------------------------------------------------------- | --- |
| Zaangażowanie      | 3.5         | Wykonałem jedno zadanie, ale dalej pracuje nad drugim   |     |
| Wkład merytoryczny | 4           | Zmiany w tych zadaniach wprowadzają większe bezpieczeństwo aplikacji i przejrzystość kodu |     |
| Komunikacja        | 4           | Zadania nie wymagały dużej koordynacji pracy z zespołem  |     |
| Terminowość        | 3           | Pracuje dalej nad parametrami do rozwiązywania zadań |     |

### Refleksja:

W następnym sprincie muszę skończyć robić parametry do rozwiązywania zadań.