import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useStyles } from './styles';

interface ArcaTableHeaderProps {
  namesCells: string[],
  handleEditMode: (id: number) => (e: React.MouseEvent<HTMLButtonElement>) => void,
  withoutAddButton: boolean,
  addingRow: React.ReactNode,
  isEditMode: boolean,
}

const ArcaTableHeader: React.FunctionComponent<ArcaTableHeaderProps> = ({
  namesCells, handleEditMode, withoutAddButton, addingRow, isEditMode,
}) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell key='action-head'>
          {
            !withoutAddButton && <Button onClick={handleEditMode(-2)}><AddCircleIcon className={classes.actionIcon} /></Button>
          }
        </TableCell>
        {
          namesCells.map((col, i) => (
            <TableCell key={`${col}-${String(i)}`}>{col}</TableCell>
          ))
        }
      </TableRow>
      {
        isEditMode && addingRow
      }
    </TableHead>
  );
};

export default ArcaTableHeader;
