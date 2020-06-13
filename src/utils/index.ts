import { State } from 'arca-redux-v4';
import { FACAD_CFT_AAU_COLUMNS, FACAD_PRE_CFT_AAU_KEY_COLUMNS } from './constants/columns';
import { FACAD_CFT_AAU, FACAD_PRE_CFT_AAU_KEY } from './constants/sources';

export const getColumnOrder = (source: keyof State['Source']) => {
  switch (source) {
    case FACAD_CFT_AAU:
      return FACAD_CFT_AAU_COLUMNS;
    case FACAD_PRE_CFT_AAU_KEY:
      return FACAD_PRE_CFT_AAU_KEY_COLUMNS;
    default:
      return [];
  }
};
