export const PracticalBranch = {
  id: 'practical',
  label: 'Obliczenia Praktyczne',
  children: {
    time: {
      id: 'prac_time',
      label: 'Zegar i Kalendarz',
      errors: {
        time_format: { code: 'ERR_TIME', message: 'Pomieszałeś minuty z godzinami (system 60-tkowy).' }
      }
    },
    money: {
      id: 'prac_money',
      label: 'Obliczenia Pieniężne',
      errors: {
        currency: { code: 'ERR_CURR', message: 'Złe przeliczenie groszy na złote.' }
      }
    },
    measures: {
      id: 'prac_measure',
      label: 'Miary i Wagi',
      children: {
        length: { id: 'meas_len', label: 'Długość (mm, cm, m, km)' },
        mass: { id: 'meas_mass', label: 'Masa (g, dag, kg, t)' }
      }
    }
  }
};