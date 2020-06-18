import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { Row, State } from 'arca-redux-v4';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useStyles } from './styles';
import { socket } from '../../redux/store';
import { getColumnOrder } from '../../utils';
import { FACAD_PRE_CFT_AAU_KEY } from '../../utils/constants/sources';
import ArcaTableHeader from './TableHeader';
import ArcaRow from './Row';
import ArcaActions from './Actions';

interface ArcaTableProps {
  rows: Row[],
  source: keyof State['Source'],
}

const ArcaTable: React.FunctionComponent<ArcaTableProps> = ({
  rows, source,
}) => {
  const classes = useStyles();
  const columnsOrder = getColumnOrder(source);
  const namesCells = columnsOrder.length ? columnsOrder : Object.keys(rows[0]);

  const [rowInEdit, rowToEditMode] = useState(-1);
  const handleEditMode = (id: number) => () => {
    rowToEditMode(id);
  };

  const deleteRow = (row: Row) => () => {
    socket.delete(source, row);
  };

  useEffect(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        rowToEditMode(-1);
      }
    });
  }, []);

  const isDeleteNotSupport = source === FACAD_PRE_CFT_AAU_KEY;

  return (
    <TableContainer className={classes.table}>
      <Table size='small' stickyHeader>
        <ArcaTableHeader
          namesCells={namesCells}
          handleEditMode={handleEditMode}
          withoutAddButton={isDeleteNotSupport}
          isEditMode={rowInEdit === -2}
          addingRow={(
            <ArcaRow
              key='new-row'
              row={{} as Row}
              id={-2}
              source={source}
              namesCells={namesCells}
              rowToEditMode={rowToEditMode}
              handleEditMode={handleEditMode}
              isNewRow
            />
          )}
        />
        <TableBody>
          {
            [...rows].map((row, index) => {
              const isEditMode = rowInEdit === index;

              if (isEditMode) {
                return (
                  <ArcaRow
                    key={`$row-${String(index)}`}
                    row={row}
                    id={index}
                    source={source}
                    namesCells={namesCells}
                    rowToEditMode={rowToEditMode}
                    handleEditMode={handleEditMode}
                  />
                );
              }

              return (
                <TableRow key={`$row-${String(index)}`} className={classes.row}>
                  <TableCell className={classes.actionCell} key={`$actions-${String(index)}`}>
                    <ArcaActions
                      id={index}
                      row={row}
                      handleEditMode={handleEditMode}
                      deleteRow={!isDeleteNotSupport && deleteRow}
                    />
                  </TableCell>
                  {namesCells.map((cell: keyof Row, i) => (
                    <TableCell key={`key-${cell}-${String(i)}}`}>
                      { row[cell] }
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArcaTable;
