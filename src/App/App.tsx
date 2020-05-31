import React, { useEffect } from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { getSpecificSource, State } from 'arca-redux-v4';
import { socket } from '../redux/store';
import Loader from '../Components/Loader/Loader';
import FacadTable from '../Components/FacadTable/FacadTable';

interface AppProps {
  facad: State['Source']['FACAD-preCFT-AAU']
}

const App: React.FunctionComponent<AppProps> = ({
  facad,
}) => {
  useEffect(() => {
    socket.subscribe('FACAD-preCFT-AAU');
    socket.select('FACAD-preCFT-AAU');
  }, []);

  return (
    <div className='page'>
      {
        facad.length
          ? <FacadTable rows={facad} />
          : <Loader />
      }
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  facad: getSpecificSource(state, 'FACAD-preCFT-AAU'),
});

export default connect(mapStateToProps)(App);
