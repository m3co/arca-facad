import React, { useRef } from 'react';
import { Row, SearchResultItem, State } from 'arca-redux-v4';
import toString from 'lodash/toString';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStyles } from './styles';
import { MATERIAL_UI_FOCUSED } from '../../utils/constants';

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
  onInputChange: (source: keyof State['Source'], cell: keyof Row, PK?: Row) =>
  (event: React.ChangeEvent<{}>, newInputValue: string) => void,
  onBlur: () => void,
}

const ArcaCombobox: React.FunctionComponent<ArcaComboboxProps> = ({
  newRow, cell, foundCell, comboboxRow, handleCombobox, onInputChange, searchResult, sourceForSearch, onKeyPress, PK, onBlur,
}) => {
  const elem = useRef(null);
  const classes = useStyles();
  const value: SearchResultItem | null = isObject(newRow[cell]) ? newRow[cell] : null;
  const isActive = [...get(elem, 'current.classList', [])].includes(MATERIAL_UI_FOCUSED);
  const options = isActive ? searchResult : [];

  return (
    <Autocomplete
      value={value}
      onChange={handleCombobox(cell, foundCell)}
      getOptionLabel={(option: SearchResultItem) => get(option, 'Label', option as unknown as string)}
      getOptionSelected={(option, value) => option.Label === get(value, 'Label', value as unknown as string)}

      inputValue={toString(comboboxRow[cell])}
      onInputChange={
        !options.some((item: SearchResultItem) => item.PK[foundCell] === comboboxRow[cell])
          ? onInputChange(sourceForSearch, cell, PK)
          : () => {}
      }

      ref={elem}
      size='small'
      onBlur={onBlur}
      className={classes.combobox}
      options={options}
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
