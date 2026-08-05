import * as migration_20260804_143542_esquema_inicial from './20260804_143542_esquema_inicial';
import * as migration_20260804_163857_remove_atividades_quem_somos from './20260804_163857_remove_atividades_quem_somos';
import * as migration_20260805_130547_refaz_quem_somos from './20260805_130547_refaz_quem_somos';
import * as migration_20260805_162843_remove_porte_empresa from './20260805_162843_remove_porte_empresa';
import * as migration_20260805_164533_adiciona_logotipos from './20260805_164533_adiciona_logotipos';
import * as migration_20260805_172941_refaz_quem_somos_editavel from './20260805_172941_refaz_quem_somos_editavel';

export const migrations = [
  {
    up: migration_20260804_143542_esquema_inicial.up,
    down: migration_20260804_143542_esquema_inicial.down,
    name: '20260804_143542_esquema_inicial',
  },
  {
    up: migration_20260804_163857_remove_atividades_quem_somos.up,
    down: migration_20260804_163857_remove_atividades_quem_somos.down,
    name: '20260804_163857_remove_atividades_quem_somos',
  },
  {
    up: migration_20260805_130547_refaz_quem_somos.up,
    down: migration_20260805_130547_refaz_quem_somos.down,
    name: '20260805_130547_refaz_quem_somos',
  },
  {
    up: migration_20260805_162843_remove_porte_empresa.up,
    down: migration_20260805_162843_remove_porte_empresa.down,
    name: '20260805_162843_remove_porte_empresa',
  },
  {
    up: migration_20260805_164533_adiciona_logotipos.up,
    down: migration_20260805_164533_adiciona_logotipos.down,
    name: '20260805_164533_adiciona_logotipos',
  },
  {
    up: migration_20260805_172941_refaz_quem_somos_editavel.up,
    down: migration_20260805_172941_refaz_quem_somos_editavel.down,
    name: '20260805_172941_refaz_quem_somos_editavel'
  },
];
