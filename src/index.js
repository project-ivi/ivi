import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Interpreter from './view';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Interpreter/>, document.getElementById('root'));
registerServiceWorker();
