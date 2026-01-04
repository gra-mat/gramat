export const Fractions = {
  id: 'fractions',
  label: 'Ułamki Zwykłe i Dziesiętne',
  children: {
    common: {
      id: 'frac_common',
      label: 'Ułamki Zwykłe',
      errors: {
        denominator: { code: 'ERR_DENOM', message: 'Błąd wspólnego mianownika.' },
        reduction: { code: 'ERR_REDUCT', message: 'Nie skróciłeś ułamka.' }
      }
    },
    decimal: {
      id: 'frac_decimal',
      label: 'Ułamki Dziesiętne',
      errors: {
        comma_place: { code: 'ERR_COMMA', message: 'Przecinek w złym miejscu.' }
      }
    }
  }
};