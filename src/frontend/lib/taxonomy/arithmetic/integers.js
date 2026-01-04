export const Integers = {
  id: 'integers',
  label: 'Liczby Całkowite (Ujemne)',
  children: {
    ops: {
      id: 'int_ops',
      label: 'Działania na całkowitych',
      errors: {
        sign_error: { code: 'ERR_SIGN', message: 'Zły znak! Minus razy minus daje plus.' },
        number_line: { code: 'ERR_LINE', message: 'Błąd na osi liczbowej.' }
      }
    }
  }
};