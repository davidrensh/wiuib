import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { mergeStyles } from 'office-ui-fabric-react';
//import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

import { initializeIcons } from '@uifabric/icons';
initializeIcons();
// Inject some global styles
mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#app)': {
      margin: 0,
      padding: 0,
      height: '100vh',
      backgroundColor: 'transparent'
    }
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
