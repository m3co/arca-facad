import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Row } from 'arca-redux-v4';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    height: '100vh',
  },
});

interface FacadTableProps {
  rows: Row[],
}

const FacadTable: React.FunctionComponent<FacadTableProps> = ({
  rows,
}) => {
  const classes = useStyles();
  const namesCells = Object.keys(rows[0]);

  return (
    <TableContainer className={classes.table}>
      <Table size='small' stickyHeader>
        <TableHead>
          <TableRow>
            {
              namesCells.map((col, i) => (
                <TableCell key={`${col}-${String(i)}`}>{col}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row, index) => (
              <TableRow key={`$row-${String(index)}`}>
                {
                  namesCells.map((key: keyof Row, i) => (
                    <TableCell key={`key-${key}-${String(i)}}`}>
                      { row[key] }
                    </TableCell>
                  ))
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FacadTable;
