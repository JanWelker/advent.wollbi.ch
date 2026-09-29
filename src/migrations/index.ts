import * as migration_20260929_163711_initial from './20260929_163711_initial';

export const migrations = [
  {
    up: migration_20260929_163711_initial.up,
    down: migration_20260929_163711_initial.down,
    name: '20260929_163711_initial'
  },
];
