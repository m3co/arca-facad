import React, { useEffect } from 'react';
import { Store } from 'redux';
import { useSelector } from 'react-redux';
import { getSpecificSource } from 'arca-redux-v4';
import { socket } from '../redux/store';
import Loader from '../Components/Loader/Loader';
import ArcaTable from '../Components/Table/Table';
import Tabs from '../Components/Tabs/Tabs';
import { FACAD_CFT_AAU, FACAD_PRE_CFT_AAU_KEY, APU_ASSIGN } from '../utils/constants/sources';

const App: React.FunctionComponent = () => {
  const facadCft = useSelector((state: Store) => getSpecificSource(state, FACAD_CFT_AAU));
  const facadKeys = useSelector((state: Store) => getSpecificSource(state, FACAD_PRE_CFT_AAU_KEY));
  const assign = useSelector((state: Store) => getSpecificSource(state, APU_ASSIGN));

  useEffect(() => {
    socket.select(FACAD_CFT_AAU);
    socket.select(FACAD_PRE_CFT_AAU_KEY);
    socket.select(APU_ASSIGN);
  }, []);

  const tabs = [
    {
      value: facadKeys.length ? <ArcaTable rows={facadKeys} source={FACAD_PRE_CFT_AAU_KEY} /> : <Loader />,
      label: 'Keys',
    },
    {
      value: facadCft.length ? <ArcaTable rows={facadCft} source={FACAD_CFT_AAU} /> : <Loader />,
      label: 'CFT',
    },
    {
      value: assign.length ? <ArcaTable rows={assign} source={APU_ASSIGN} /> : <Loader />,
      label: 'Assign',
    },
  ];

  return (
    <div className='page'>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default App;
