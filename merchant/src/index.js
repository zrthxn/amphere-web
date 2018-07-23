import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Super from './Super';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Super/>, document.getElementById('root'));
registerServiceWorker();