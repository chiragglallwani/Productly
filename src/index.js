import ReactDOM from 'react-dom';
import App from './App'
import './index.css'
import {Provider} from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducers from './store/reducers/index';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
    key: 'root',
    storage
}
let store = createStore(persistReducer(persistConfig, reducers), applyMiddleware(thunk));
let persistor = persistStore(store);

ReactDOM.render(
<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App/>
    </PersistGate>
</Provider>, 
document.getElementById('root'));