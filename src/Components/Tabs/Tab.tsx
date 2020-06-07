import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface TabProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const useStyles = makeStyles({
  root: {
    marginTop: 12,
    marginBottom: 24,
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
});

const Tab: React.FunctionComponent<TabProps> = ({
  children, index, value,
}) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
};

export default Tab;
