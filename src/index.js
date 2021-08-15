import ReactDOM from 'react-dom';
import App from './App'
import './index.css'
import {Provider} from 'react-redux';
import reducers from './store/reducers/index';
import { createStore } from 'redux';

ReactDOM.render(<Provider store={createStore(reducers)}>
<App/>
</Provider>, 
document.getElementById('root'));