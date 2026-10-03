import * as migration_20260929_163711_initial from './20260929_163711_initial';
import * as migration_20261003_085736_design_nacht from './20261003_085736_design_nacht';

export const migrations = [
  {
    up: migration_20260929_163711_initial.up,
    down: migration_20260929_163711_initial.down,
    name: '20260929_163711_initial',
  },
  {
    up: migration_20261003_085736_design_nacht.up,
    down: migration_20261003_085736_design_nacht.down,
    name: '20261003_085736_design_nacht'
  },
];
