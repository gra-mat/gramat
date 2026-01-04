import { NaturalNumbers } from './arithmetic/natural.js';
import { Integers } from './arithmetic/integers.js';
import { Fractions } from './arithmetic/fractions.js';

export const ArithmeticBranch = {
  id: 'arithmetic',
  label: 'Liczby i Działania',
  children: {
    natural_numbers: NaturalNumbers,
    integers: Integers,
    fractions: Fractions
  }
};