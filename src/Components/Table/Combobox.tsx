import React from 'react';
import { Row, SearchResultItem, State } from 'arca-redux-v4';
import toString from 'lodash/toString';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStyles } from './styles';

interface ArcaComboboxProps {
  newRow: Row,
  cell: keyof Row,
  foundCell: keyof Row,
  comboboxRow: Row,
  searchResult: SearchResultItem[],
  sourceForSearch: keyof State['Source'],
  PK?: Row,
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  handleCombobox: (cell: keyof Row, foundCell: keyof Row) => (event: any, newValue: SearchResultItem | null) => void,
  onInputChange: (source: keyof State['Source'], cell: keyof Row, PK?: Row) => (event: React.ChangeEvent<{}>, newInputValue: string) => void,
}

const ArcaCombobox: React.FunctionComponent<ArcaComboboxProps> = ({
  newRow, cell, foundCell, comboboxRow, handleCombobox, onInputChange, searchResult, sourceForSearch, onKeyPress, PK,
}) => {
  const classes = useStyles();

  return (
    <Autocomplete
      value={isObject(newRow[cell]) ? newRow[cell] : null}
      onChange={handleCombobox(cell, foundCell)}
      getOptionLabel={(option: SearchResultItem) => get(option, 'Label', option as unknown as string)}
      getOptionSelected={(option, value) => option.Label === get(value, 'Label', value as unknown as string)}

      inputValue={toString(comboboxRow[cell])}
      onInputChange={
        !searchResult.some((item: SearchResultItem) => item.PK[foundCell] === comboboxRow[cell])
          ? onInputChange(sourceForSearch, cell, PK)
          : () => {}
      }

      className={classes.combobox}
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
};

export default ArcaCombobox;
