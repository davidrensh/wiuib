import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { mergeStyles } from '@fluentui/react';
//import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

//import { initializeIcons } from '@fluentui/react/lib/Icon';//'@fluentui/icons';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

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
