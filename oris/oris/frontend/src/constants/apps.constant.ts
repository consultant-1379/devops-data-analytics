import { AppWiseTeams } from 'src/app/types/custom-types.type';

export const apps: AppWiseTeams = {
  ADC: {
    teams: [
      'Origins',
      'Augurey',
      'Pilgrim',
      'Quaranteam',
      'Aster',
      'Balaton',
      'RogerRoger',
    ],
  },
  EAS: {
    teams: [
      'Origins',
      'Augurey',
    ],
  },
};

export const options : Intl.DateTimeFormatOptions= {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: 'numeric',
  hour12: true,
};
