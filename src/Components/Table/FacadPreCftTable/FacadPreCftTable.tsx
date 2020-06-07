import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from '@material-ui/core/Input';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { Row, State } from 'arca-redux-v4';
import { useStyles } from '../styles';

interface FacadPreCftTableProps {
  rows: State['Source']['FACAD-preCFT-AAU'],
}

const FacadPreCftTable: React.FunctionComponent<FacadPreCftTableProps> = ({
  rows,
}) => {
  const classes = useStyles();
  const namesCells = Object.keys(rows[0]);

  const [rowInEdit, rowToEditMode] = useState(0);
  const handleEditMode = (id: number) => () => {
    rowToEditMode(id);
  };

  return (
    <Paper>
      <TableContainer className={classes.table}>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              {
                namesCells.map((col, i) => (
                  <TableCell key={`${col}-${String(i)}`}>{col}</TableCell>
                ))
              }
              <TableCell key='action-head' />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rows.map((row, index) => (
                rowInEdit === row.ID
                  ? (
                    <TableRow className={classes.rowEdit} key={`$row-${String(index)}`}>
                      {namesCells.map((key: keyof Row, i) => (
                        <TableCell key={`key-${key}-${String(i)}}`}>
                          <Input
                            className={classes.input}
                            value={row[key]}
                            disableUnderline
                          />
                        </TableCell>
                      ))}
                      <TableCell key={`$actions-${String(index)}`}>
                        <ButtonGroup variant='text' aria-label='text primary button group'>
                          <Button><DoneIcon className={classes.action} /></Button>
                          <Button><ClearIcon className={classes.action} /></Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  )
                  : (
                    <TableRow className={classes.row} key={`$row-${String(index)}`}>
                      {
                        namesCells.map((key: keyof Row, i) => (
                          <TableCell key={`key-${key}-${String(i)}}`}>
                            { row[key] }
                          </TableCell>
                        ))
                      }
                      <TableCell key={`$actions-${String(index)}`}>
                        <ButtonGroup variant='text' aria-label='text primary button group'>
                          <Button onClick={handleEditMode(row.ID)}><EditIcon className={classes.action} /></Button>
                          <Button><DeleteIcon className={classes.action} /></Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  )
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FacadPreCftTable;
