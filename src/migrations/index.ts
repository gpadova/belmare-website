import * as migration_20260804_143542_esquema_inicial from './20260804_143542_esquema_inicial';
import * as migration_20260804_163857_remove_atividades_quem_somos from './20260804_163857_remove_atividades_quem_somos';

export const migrations = [
  {
    up: migration_20260804_143542_esquema_inicial.up,
    down: migration_20260804_143542_esquema_inicial.down,
    name: '20260804_143542_esquema_inicial',
  },
  {
    up: migration_20260804_163857_remove_atividades_quem_somos.up,
    down: migration_20260804_163857_remove_atividades_quem_somos.down,
    name: '20260804_163857_remove_atividades_quem_somos'
  },
];
