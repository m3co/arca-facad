import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Tabs as TabsMain, Tab as TabTitle } from '@material-ui/core';
import Tab from './Tab';

interface TabsProps {
  tabs: {
    label: string | number | React.ReactNode,
    value: string | number | React.ReactNode,
  }[]
}

const useStyles = makeStyles({
  root: {
    color: 'initial',
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#61dafb',
  },
});

const useStylesTab = makeStyles({
  root: {
    flex: 1,
    maxWidth: 'none',
  },
});

const useStylesBar = makeStyles({
  root: {
    marginTop: 12,
  },
});

const Tabs: React.FunctionComponent<TabsProps> = ({
  tabs,
}) => {
  const classes = useStyles();
  const classesTab = useStylesTab();
  const classesBar = useStylesBar();

  const [currentTab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div>
      <AppBar classes={classesBar} position='static'>
        <TabsMain classes={classes} value={currentTab} onChange={handleChange} centered>
          {
            tabs.map((tab, index) => (
              <TabTitle classes={classesTab} label={tab.label} id={`simple-tab-${index}`} key={`${tab.label}-${String(index)}`} />
            ))
          }
        </TabsMain>
      </AppBar>
      {
        tabs.map((tab, index) => (
          <Tab value={currentTab} index={index} key={String(index)}>
            {tab.value}
          </Tab>
        ))
      }
    </div>
  );
};

export default Tabs;
