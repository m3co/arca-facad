import React, { useState } from 'react';
import toString from 'lodash/toString';
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
import { useStyles } from './styles';
import { FACAD_PRE_CFT_AAU_KEY } from '../../utils/constants/sources';

interface ArcaTableProps {
  rows: State['Source']['FACAD-CFT-AAU'] | State['Source']['FACAD-preCFT-AAU-Key'] | State['Source']['FACAD-preCFT-AAU'],
  source: keyof State['Source'],
}

const ArcaTable: React.FunctionComponent<ArcaTableProps> = ({
  rows, source,
}) => {
  const classes = useStyles();
  const namesCells = Object.keys(rows[0]);

  const [rowInEdit, rowToEditMode] = useState(-1);
  const handleEditMode = (id: number) => () => {
    rowToEditMode(id);
  };

  return (
    <Paper>
      <TableContainer className={classes.table}>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell key='action-head' />
              {
                namesCells.map((col, i) => (
                  <TableCell key={`${col}-${String(i)}`}>{col}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              [...rows].map((row, index) => (
                rowInEdit === index
                  ? (
                    <TableRow className={classes.rowEdit} key={`$row-${String(index)}`}>
                      <TableCell className={classes.actionCell} key={`$actions-${String(index)}`}>
                        <ButtonGroup variant='text' aria-label='text primary button group'>
                          <Button><DoneIcon className={classes.actionIcon} /></Button>
                          <Button><ClearIcon className={classes.actionIcon} /></Button>
                        </ButtonGroup>
                      </TableCell>
                      {namesCells.map((key: keyof Row, i) => (
                        <TableCell key={`key-${key}-${String(i)}}`}>
                          <Input
                            className={classes.input}
                            value={row[key]}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                  : (
                    <TableRow className={classes.row} key={`$row-${String(index)}`}>
                      <TableCell className={classes.actionCell} key={`$actions-${String(index)}`}>
                        <ButtonGroup variant='text' aria-label='text primary button group'>
                          <Button onClick={handleEditMode(index)}><EditIcon className={classes.actionIcon} /></Button>
                          <Button><DeleteIcon className={classes.actionIcon} /></Button>
                        </ButtonGroup>
                      </TableCell>
                      {
                        namesCells.map((key: keyof Row, i) => (
                          <TableCell key={`key-${key}-${String(i)}}`}>
                            { row[key] }
                          </TableCell>
                        ))
                      }
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

export default ArcaTable;
