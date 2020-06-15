import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Row, State, getSearchResult, SearchResultItem,
} from 'arca-redux-v4';
import toString from 'lodash/toString';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useStyles } from './styles';
import {
  FACAD_PRE_CFT_AAU_KEY, FACAD_CFT_AAU, AAU, FACAD_BUILT_IN_CATEGORIES,
  FACAD_PARAMS_BIC, PROJECTS,
} from '../../utils/constants/sources';
import { socket } from '../../redux/store';
import { REPORT_TYPE } from '../../utils/constants/selects';
import ArcaActions from './Actions';
import ArcaCombobox from './Combobox';
import { ID, FIELD } from '../../utils/constants/cells';
import { checkAllCells } from '../../utils';

interface ArcaRowProps {
  row: Row,
  source: keyof State['Source'],
  id: number,
  namesCells: string[],
  handleEditMode: (id: number) => () => void,
  rowToEditMode: (id: number) => void,
  isEditMode: boolean,
  deleteRow: (row: Row) => () => void,
  isDeleteNotSupport?: boolean,
}

const ArcaRow: React.FunctionComponent<ArcaRowProps> = ({
  row, source, id, namesCells, handleEditMode, isEditMode, deleteRow, isDeleteNotSupport, rowToEditMode,
}) => {
  const searchResult = useSelector(getSearchResult) || [];
  const classes = useStyles();

  const [comboboxRow, setComboboxRow] = useState(row);
  const [newRow, handleNewRow] = useState(row);

  const handleChange = (cell: keyof Row) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNewRow({
      ...newRow,
      [cell]: event.target.value,
    });
  };

  const handleSearch = (source: keyof State['Source'], cell: keyof Row, value: string, PK?: Row) => {
    setComboboxRow({
      ...comboboxRow,
      [cell]: value,
    });

    socket.search(source, {
      Search: value,
      Limit: 10,
      PK,
    });
  };

  const handleCombobox = (cell: keyof Row, foundCell: keyof Row) => (event: any, newValue: SearchResultItem | null) => {
    handleNewRow({
      ...newRow,
      [cell]: newValue,
    });

    setComboboxRow({
      ...comboboxRow,
      [cell]: get(newValue, `PK[${foundCell}]`, ''),
    });
  };

  const onInputChange = (source: keyof State['Source'], cell: keyof Row, PK?: Row) => (event: React.ChangeEvent<{}>, newInputValue: string) => {
    handleSearch(source, cell, toString(newInputValue), PK);
  };

  const onSubmit = () => {
    socket.update(source, checkAllCells(newRow, namesCells), row);
    rowToEditMode(-1);
  };

  const onCancel = () => {
    rowToEditMode(-1);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const getDisabledInput = (value: string) => (
    <Input className={classes.input} value={value} disabled />
  );

  const getComboboxProps = (cell: keyof Row) => ({
    newRow: newRow,
    cell: cell,
    comboboxRow: comboboxRow,
    searchResult: searchResult,
    onKeyPress: onKeyPress,
    handleCombobox: handleCombobox,
    onInputChange: onInputChange,
  });

  const getFacadKeysInput = (cell: keyof Row, value: string) => {
    switch (cell) {
      case 'Key':
        return (
          <ArcaCombobox
            {...getComboboxProps(cell)}
            sourceForSearch={AAU}
            foundCell={cell}
            PK={ { Expand: false } as Row }
          />
        );
      default:
        return getDisabledInput(value);
    }
  };

  const getFacadCftInput = (cell: keyof Row, value: string) => {
    switch (cell) {
      case 'Project':
        return (
          <ArcaCombobox
            {...getComboboxProps(cell)}
            sourceForSearch={PROJECTS}
            foundCell={ID as never}
          />
        );
      case 'Family':
      case 'Type':
        return (
          <Input
            className={classes.input}
            value={newRow[cell]}
            onChange={handleChange(cell)}
          />
        )
      case 'Key':
        return (
          <ArcaCombobox
            {...getComboboxProps(cell)}
            sourceForSearch={AAU}
            foundCell={cell}
            PK={{
              Expand: false,
              ...( isObject(get(newRow, 'Project')) ? { Project: get(newRow, 'Project.PK.ID') } : {} ),
            } as Row}
          />
        );
      case 'BuiltInCategory':
        return (
          <ArcaCombobox
            {...getComboboxProps(cell)}
            sourceForSearch={FACAD_BUILT_IN_CATEGORIES}
            foundCell={cell}
          />
        );
      case 'ReportType':
        return (
          <Select
            value={newRow[cell]}
            onChange={handleChange(cell)}
            className={classes.select}
          >
            {
              REPORT_TYPE.map((TYPE, i) => <MenuItem key={`${TYPE}-${String(i)}`} value={TYPE}>{TYPE}</MenuItem>)
            }
          </Select>
        );
      case 'KeynoteField':
      case 'ConstraintField':
      case 'QuantityField':
        return (
          <ArcaCombobox
            {...getComboboxProps(cell)}
            sourceForSearch={FACAD_PARAMS_BIC}
            foundCell={FIELD as never}
            PK={{
              ...( isObject(get(newRow, 'BuiltInCategory')) ? { BuiltInCategory: get(newRow, 'BuiltInCategory.PK.BuiltInCategory') } : {} ),
              ...( get(newRow, 'ReportType') ? { ReportType: get(newRow, 'ReportType') } : {} ),
            } as Row}
          />
        );
      default:
        return getDisabledInput(value);
    }
  };

  const getInput = (source: keyof State['Source'], cell: keyof Row, value: string) => {
    switch (source) {
      case FACAD_PRE_CFT_AAU_KEY:
        return getFacadKeysInput(cell, value);
      case FACAD_CFT_AAU:
        return getFacadCftInput(cell, value);
      default:
        return getDisabledInput(value);
    }
  };

  return (
    <TableRow className={ isEditMode ? classes.rowEdit : classes.row }>
      <TableCell className={classes.actionCell} key={`$actions-${String(id)}`}>
        <ArcaActions
          id={id}
          row={row}
          isEditMode={isEditMode}
          isDeleteNotSupport={isDeleteNotSupport}
          handleEditMode={handleEditMode}
          deleteRow={deleteRow}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </TableCell>
      {namesCells.map((cell: keyof Row, i) => (
        <TableCell key={`key-${cell}-${String(i)}}`}>
          {
            isEditMode
              ? getInput(source, cell, toString(row[cell]))
              : row[cell]
          }
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ArcaRow;
