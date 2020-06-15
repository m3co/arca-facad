import React, { useEffect } from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { getSpecificSource, State } from 'arca-redux-v4';
import { socket } from '../redux/store';
import Loader from '../Components/Loader/Loader';
import ArcaTable from '../Components/Table/Table';
import Tabs from '../Components/Tabs/Tabs';
import { FACAD_CFT_AAU, FACAD_PRE_CFT_AAU_KEY } from '../utils/constants/sources';

interface AppProps {
  facadCft: State['Source']['FACAD-CFT-AAU'],
  facadKeys: State['Source']['FACAD-preCFT-AAU-Key'],
}

const App: React.FunctionComponent<AppProps> = ({
  facadCft, facadKeys,
}) => {
  useEffect(() => {
    socket.select(FACAD_CFT_AAU);
    socket.select(FACAD_PRE_CFT_AAU_KEY);
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
  ];

  return (
    <div className='page'>
      <Tabs tabs={tabs} />
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  facadCft: getSpecificSource(state, FACAD_CFT_AAU),
  facadKeys: getSpecificSource(state, FACAD_PRE_CFT_AAU_KEY),
});

export default connect(mapStateToProps)(App);
