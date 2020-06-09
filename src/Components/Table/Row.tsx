import React, { useState } from 'react';
import toString from 'lodash/toString';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Input from '@material-ui/core/Input';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { Row, State } from 'arca-redux-v4';
import { useStyles } from './styles';
import { FACAD_PRE_CFT_AAU_KEY } from '../../utils/constants/sources';

interface ArcaRowProps {
  row: State['Source']['FACAD-CFT-AAU'][0] | State['Source']['FACAD-preCFT-AAU-Key'][0] | State['Source']['FACAD-preCFT-AAU'][0],
  source: keyof State['Source'],
  id: number,
  namesCells: string[],
  handleEditMode: (id: number) => void,
}

const ArcaRow: React.FunctionComponent<ArcaRowProps> = ({
  row, source, id, namesCells, handleEditMode,
}) => {
  const classes = useStyles();

  const [newRow, handleNewRow] = useState(row);
  const handleChange = (cell: keyof Row) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNewRow({
      ...newRow,
      [cell]: event.target.value,
    });
  };

  const onSubmit = () => {
    console.log('update', newRow);
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
          <Input
            onKeyPress={onKeyPress}
            className={classes.input}
            value={toString(newRow[cell])}
            onChange={handleChange(cell)}
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
      default:
        return getDisabledInput(value);
    }
  };

  return (
    <TableRow className={classes.rowEdit}>
      <TableCell className={classes.actionCell} key={`$actions-${String(id)}`}>
        <ButtonGroup variant='text' aria-label='text primary button group'>
          <Button onClick={onSubmit}><DoneIcon className={classes.actionIcon} /></Button>
          <Button onClick={onCancel}><ClearIcon className={classes.actionIcon} /></Button>
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
