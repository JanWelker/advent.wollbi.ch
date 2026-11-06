import * as migration_20260929_163711_initial from './20260929_163711_initial';
import * as migration_20261003_085736_design_nacht from './20261003_085736_design_nacht';
import * as migration_20261106_102610_authentik_oidc from './20261106_102610_authentik_oidc';
import * as migration_20261106_110218_signup from './20261106_110218_signup';

export const migrations = [
  {
    up: migration_20260929_163711_initial.up,
    down: migration_20260929_163711_initial.down,
    name: '20260929_163711_initial',
  },
  {
    up: migration_20261003_085736_design_nacht.up,
    down: migration_20261003_085736_design_nacht.down,
    name: '20261003_085736_design_nacht',
  },
  {
    up: migration_20261106_102610_authentik_oidc.up,
    down: migration_20261106_102610_authentik_oidc.down,
    name: '20261106_102610_authentik_oidc',
  },
  {
    up: migration_20261106_110218_signup.up,
    down: migration_20261106_110218_signup.down,
    name: '20261106_110218_signup'
  },
];
