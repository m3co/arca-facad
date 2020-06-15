import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { Row, State } from 'arca-redux-v4';

import { useStyles } from './styles';
import { socket } from '../../redux/store';
import { getColumnOrder } from '../../utils';
import { FACAD_PRE_CFT_AAU_KEY } from '../../utils/constants/sources';
import ArcaTableHeader from './TableHeader';
import ArcaRow from './Row';

interface ArcaTableProps {
  rows: State['Source']['FACAD-CFT-AAU'] | State['Source']['FACAD-preCFT-AAU-Key'],
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

  return (
    <TableContainer className={classes.table}>
      <Table size='small' stickyHeader>
        <ArcaTableHeader
          namesCells={namesCells}
          handleEditMode={handleEditMode}
          withoutAddButton={source === FACAD_PRE_CFT_AAU_KEY}
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
              isEditMode={rowInEdit === -2}
              deleteRow={deleteRow}
            />
          )}
        />
        <TableBody>
          {
            [...rows].map((row, index) => (
              <ArcaRow
                key={`$row-${String(index)}`}
                row={row}
                id={index}
                source={source}
                namesCells={namesCells}
                rowToEditMode={rowToEditMode}
                handleEditMode={handleEditMode}
                isEditMode={rowInEdit === index}
                deleteRow={deleteRow}
                isDeleteNotSupport={source === FACAD_PRE_CFT_AAU_KEY}
              />
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArcaTable;
