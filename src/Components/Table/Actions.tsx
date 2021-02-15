import React, { Fragment } from 'react';
import { Row } from 'arca-redux-v4';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles } from './styles';

interface ArcaActionsProps {
  id: number,
  row: Row,
  handleEditMode?: (id: number) => () => void,
  deleteRow?: (row: Row) => () => void,
  onSubmit?: (e: React.MouseEvent) => void,
  onCancel?: (e: React.MouseEvent) => void,
}

const ArcaActions: React.FunctionComponent<ArcaActionsProps> = ({
  row, id, handleEditMode, deleteRow, onSubmit, onCancel,
}) => {
  const classes = useStyles();
  const isEditMode = onSubmit && onCancel;

  return (
    <Fragment>
      {
        isEditMode
          ? (
            <ButtonGroup variant='text'>
              <Button onClick={onSubmit}><CheckCircleIcon className={classes.actionIcon} /></Button>
              <Button onClick={onCancel}><CancelIcon className={classes.actionIcon} /></Button>
            </ButtonGroup>
          )
          : (
            <ButtonGroup variant='text'>
              <Button onClick={handleEditMode(id)}><EditIcon className={classes.actionIcon} /></Button>
              { deleteRow && <Button onClick={deleteRow(row)}><DeleteIcon className={classes.actionIcon} /></Button> }
            </ButtonGroup>
          )
      }
    </Fragment>
  );
};

export default ArcaActions;
