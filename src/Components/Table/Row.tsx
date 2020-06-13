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
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Input from '@material-ui/core/Input';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStyles } from './styles';
import {
  FACAD_PRE_CFT_AAU_KEY, FACAD_CFT_AAU, FACAD_PRE_CFT_AAU, AAU,
} from '../../utils/constants/sources';
import { socket } from '../../redux/store';

interface ArcaRowProps {
  row: State['Source']['FACAD-CFT-AAU'][0] | State['Source']['FACAD-preCFT-AAU-Key'][0],
  source: keyof State['Source'],
  id: number,
  namesCells: string[],
  handleEditMode: (id: number) => void,
}

const ArcaRow: React.FunctionComponent<ArcaRowProps> = ({
  row, source, id, namesCells, handleEditMode,
}) => {
  const searchResult = useSelector(getSearchResult) || [];
  const classes = useStyles();

  const [inputValue, setInputValue] = useState(row);
  const [newRow, handleNewRow] = useState(row);

  const handleChange = (source: keyof State['Source'], cell: keyof Row, value: string) => {
    setInputValue({
      ...inputValue,
      [cell]: value,
    });

    socket.search(source, {
      Search: value,
      Limit: 10,
      PK: {
        Expand: false,
      } as Row,
    });
  };

  const handleSelect = (cell: keyof Row) => (event: any, newValue: SearchResultItem | null) => {
    handleNewRow({
      ...newRow,
      [cell]: newValue,
    });

    setInputValue({
      ...inputValue,
      [cell]: get(newValue, `PK[${cell}]`, ''),
    });
  };

  const onInputChange = (cell: keyof Row) => (event: React.ChangeEvent<{}>, newInputValue: string) => {
    const isSelectedKey = searchResult.some((item: SearchResultItem) => item.PK[cell] === inputValue[cell]);

    if (!isSelectedKey) {
      handleChange(AAU, cell, toString(newInputValue));
    }
  };

  const onSubmit = () => {
    switch (source) {
      case FACAD_PRE_CFT_AAU_KEY:
        socket.update(source, {
          ...newRow,
          Key: get(newRow, 'Key.PK.Key', ''),
        }, row);
        break;
      default:
        break;
    }
    handleEditMode(-1);
  };

  const onCancel = () => {
    handleEditMode(-1);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const getDisabledInput = (value: string) => (
    <Input className={classes.input} value={value} disabled />
  );

  const getFacadKeysInput = (cell: keyof Row, value: string) => {
    switch (cell) {
      case 'Key':
        return (
          <Autocomplete
            value={isObject(newRow[cell]) ? newRow[cell] : null}
            onChange={handleSelect(cell)}
            getOptionLabel={(option: SearchResultItem) => get(option, 'Label', option as unknown as string)}
            getOptionSelected={(option, value) => option.Label === get(value, 'Label', value as unknown as string)}

            inputValue={toString(inputValue[cell])}
            onInputChange={onInputChange(cell)}

            style={{ width: 300 }}
            options={searchResult}
            renderInput={params => (
              <TextField
                {...params}
                onKeyPress={onKeyPress}
                className={classes.textField}
              />
            )}
          />
        );
      default:
        return getDisabledInput(value);
    }
  };

  const getFacadCftInput = (cell: keyof Row, value: string) => {
    switch (cell) {
      default:
        return getDisabledInput(value);
    }
  };

  const getFacadPreCftInput = (cell: keyof Row, value: string) => {
    switch (cell) {
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
      case FACAD_PRE_CFT_AAU:
        return getFacadPreCftInput(cell, value);
      default:
        return getDisabledInput(value);
    }
  };

  return (
    <TableRow className={classes.rowEdit}>
      <TableCell className={classes.actionCell} key={`$actions-${String(id)}`}>
        <ButtonGroup variant='text' aria-label='text primary button group'>
          <Button onClick={onSubmit}><CheckCircleIcon className={classes.actionIcon} /></Button>
          <Button onClick={onCancel}><CancelIcon className={classes.actionIcon} /></Button>
        </ButtonGroup>
      </TableCell>
      {namesCells.map((cell: keyof Row, i) => (
        <TableCell key={`key-${cell}-${String(i)}}`}>
          { getInput(source, cell, toString(row[cell])) }
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ArcaRow;
