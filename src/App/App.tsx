import React, { useEffect } from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { getSpecificSource, State } from 'arca-redux-v4';
import { socket } from '../redux/store';

interface AppProps {
  facad: State['Source']['FACAD-BuiltInCategories']
}

const App: React.FunctionComponent<AppProps> = ({
  facad,
}) => {
  useEffect(() => {
    socket.subscribe('FACAD-BuiltInCategories');
    socket.select('FACAD-BuiltInCategories');
  }, []);

  return (
    <div className='page'>
      {
        JSON.stringify(facad)
      }
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  facad: getSpecificSource(state, 'FACAD-BuiltInCategories'),
});

export default connect(mapStateToProps)(App);
