export const NaturalNumbers = {
  id: 'natural_numbers',
  label: 'Liczby Naturalne',
  children: {
    addition: {
      id: 'nat_addition',
      label: 'Dodawanie',
      errors: {
        basic_calc: { code: 'ERR_CALC', message: 'Błąd rachunkowy.' },
        off_by_one: { code: 'ERR_ONE', message: 'Pomyłka o 1 (błąd liczenia).' },
        carry_error: { code: 'ERR_CARRY', message: 'Zapomniałeś przenieść dziesiątkę dalej.' },
        typo: { code: 'ERR_TYPO', message: 'Czeski błąd (przestawione cyfry).' }
      }
    },
    subtraction: {
      id: 'nat_subtraction',
      label: 'Odejmowanie',
      errors: {
        basic_calc: { code: 'ERR_CALC', message: 'Błąd rachunkowy.' },
        borrow_error: { code: 'ERR_BORROW', message: 'Błąd w pożyczaniu (z dziesiątek/setek).' },
        reverse_sub: { code: 'ERR_REV_SUB', message: 'Odjąłeś mniejszą od większej na odwrót.' }
      }
    },
    multiplication: {
      id: 'nat_multiplication',
      label: 'Mnożenie',
      errors: {
        table_error: { code: 'ERR_MULT_TABLE', message: 'Błąd tabliczki mnożenia.' }
      }
    },
    division: {
      id: 'nat_division',
      label: 'Dzielenie',
      errors: {
        remainder_error: { code: 'ERR_DIV_REM', message: 'Błąd w reszcie z dzielenia.' }
      }
    }
  }
};