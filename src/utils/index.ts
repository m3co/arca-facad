import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { State, Row } from 'arca-redux-v4';
import { FACAD_CFT_AAU_COLUMNS, FACAD_PRE_CFT_AAU_KEY_COLUMNS } from './constants/columns';
import { FACAD_CFT_AAU, FACAD_PRE_CFT_AAU_KEY } from './constants/sources';
import * as CELLS from './constants/cells';

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

export const checkAllCells = (row: Row, namesCells: string[]) => {
  const result = namesCells.reduce((acc: Row, cur: keyof Row) => {
    const value = row[cur];

    if (isObject(value)) {
      switch (cur) {
        case CELLS.PROJECT:
          acc[cur] = get(value, 'PK.ID', '' as never);
          break;
        case CELLS.CONSTRAINT_FIELD:
        case CELLS.KEYNOTE_FIELD:
        case CELLS.QUANTITY_FIELD:
          acc[cur] = get(value, 'PK.Field', '' as never);
          break;
        default:
          acc[cur] = get(value, `PK.${cur}`, '' as never);
          break;
      }
    } else {
      acc[cur] = value;
    }

    return acc;
  }, {} as Row);

  return result;
};
