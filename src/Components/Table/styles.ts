import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  table: {
    height: 'calc(100vh - 96px)',
  },
  row: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  rowEdit: {
    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
  },
  action: {
    opacity: '0.6',
    fontSize: 18,
  },
  input: {
    width: '100%',
  },
});
