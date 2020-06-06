import React, { useEffect } from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { getSpecificSource, State } from 'arca-redux-v4';
import { socket } from '../redux/store';
import Loader from '../Components/Loader/Loader';
import FacadTable from '../Components/FacadTable/FacadTable';

interface AppProps {
  facadPreCft: State['Source']['FACAD-preCFT-AAU'],
  facadCft: State['Source']['FACAD-CFT-AAU'],
  facadKeys: State['Source']['FACAD-preCFT-AAU-Key'],
}

const App: React.FunctionComponent<AppProps> = ({
  facadPreCft, facadCft, facadKeys,
}) => {
  useEffect(() => {
    socket.subscribe('FACAD-preCFT-AAU');
    socket.select('FACAD-preCFT-AAU');

    socket.subscribe('FACAD-CFT-AAU');
    socket.select('FACAD-CFT-AAU');

    socket.subscribe('FACAD-preCFT-AAU-Key');
    socket.select('FACAD-preCFT-AAU-Key');
  }, []);

  return (
    <div className='page'>
      {
        facadPreCft.length
          ? <FacadTable rows={facadPreCft} />
          : <Loader />
      }
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  facadPreCft: getSpecificSource(state, 'FACAD-preCFT-AAU'),
  facadCft: getSpecificSource(state, 'FACAD-CFT-AAU'),
  facadKeys: getSpecificSource(state, 'FACAD-preCFT-AAU-Key'),
});

export default connect(mapStateToProps)(App);
