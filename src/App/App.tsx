import React, { useEffect } from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { getSpecificSource, State } from 'arca-redux-v4';
import { socket } from '../redux/store';
import Loader from '../Components/Loader/Loader';
import ArcaTable from '../Components/Table/Table';
import Tabs from '../Components/Tabs/Tabs';
import { FACAD_PRE_CFT_AAU, FACAD_CFT_AAU, FACAD_PRE_CFT_AAU_KEY } from '../utils/constants/sources';

interface AppProps {
  facadPreCft: State['Source']['FACAD-preCFT-AAU'],
  facadCft: State['Source']['FACAD-CFT-AAU'],
  facadKeys: State['Source']['FACAD-preCFT-AAU-Key'],
}

const App: React.FunctionComponent<AppProps> = ({
  facadPreCft, facadCft, facadKeys,
}) => {
  useEffect(() => {
    socket.subscribe(FACAD_PRE_CFT_AAU);
    socket.select(FACAD_PRE_CFT_AAU);

    socket.subscribe(FACAD_CFT_AAU);
    socket.select(FACAD_CFT_AAU);

    socket.subscribe(FACAD_PRE_CFT_AAU_KEY);
    socket.select(FACAD_PRE_CFT_AAU_KEY);
  }, []);

  const tabs = [
    {
      value: <ArcaTable rows={facadKeys} source={FACAD_PRE_CFT_AAU_KEY} />,
      label: 'Keys',
    },
    {
      value: <ArcaTable rows={facadPreCft} source={FACAD_PRE_CFT_AAU} />,
      label: 'preCFT',
    },
    {
      value: <ArcaTable rows={facadCft} source={FACAD_CFT_AAU} />,
      label: 'CFT',
    },
  ];

  return (
    <div className='page'>
      {
        facadPreCft.length && facadCft.length && facadKeys.length
          ? <Tabs tabs={tabs} />
          : <Loader />
      }
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  facadPreCft: getSpecificSource(state, FACAD_PRE_CFT_AAU),
  facadCft: getSpecificSource(state, FACAD_CFT_AAU),
  facadKeys: getSpecificSource(state, FACAD_PRE_CFT_AAU_KEY),
});

export default connect(mapStateToProps)(App);
