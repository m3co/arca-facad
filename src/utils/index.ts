import get from 'lodash/get';
import isObject from 'lodash/isObject';
import times from 'lodash/times';
import constant from 'lodash/constant';
import toString from 'lodash/toString';
import { State, Row } from 'arca-redux-v4';
import COLUMNS from './constants/columns';
import * as CELLS from './constants/cells';
import { arrOfIntCells, arrOfIntWithDotCells } from './constants/index';

export const getColumnOrder = (source: keyof State['Source']) => COLUMNS[source as keyof typeof COLUMNS] || [];
export const parseToCurrencyFormat = (value: string) => `$${value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`;
export const removeChars = (value: string) => value.replace(/\D/g, '');
export const parseToNumber = (value: string) => Number(removeChars(value));
export const parseToNumberWithDot = (value: string) => value.split('.').map(v => removeChars(v)).join('.').replace(/\.+/, '.');
export const parseToDotsFormat = (value: string, int: number) => {
  if (value.length > int) {
    return Number(value) / Number(`1${times(int, constant(0)).join('')}`);
  }

  return value;
};

export const parseCellToNumber = (cell: keyof Row, value: string) => {
  if (arrOfIntCells.includes(cell)) {
    return parseToNumber(value);
  }

  if (arrOfIntWithDotCells.includes(cell)) {
    return parseToNumberWithDot(value);
  }

  return value;
};

export const checkAllCells = (row: Row, namesCells: string[]) => {
  const result = namesCells.reduce((acc: Row, cur: keyof Row) => {
    const value = row[cur];

    if (isObject(value)) {
      switch (cur) {
        case CELLS.PROJECT:
        case CELLS.CONTRACTOR_ID:
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

export const displayCell = (cell: string, value: string) => {
  switch (cell) {
    case CELLS.ESTIMATED:
      return parseToCurrencyFormat(toString(value));
    default:
      return value;
  }
};
