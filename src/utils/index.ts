import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { State, Row } from 'arca-redux-v4';
import COLUMNS from './constants/columns';
import * as CELLS from './constants/cells';

export const getColumnOrder = (source: keyof State['Source']) => COLUMNS[source as keyof typeof COLUMNS] || [];

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
