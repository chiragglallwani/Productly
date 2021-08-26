import {combineReducers} from 'redux';
import userReducer from './userReducer';
import SearchReducer from './SearchReducer';
import ProductReducer from './ProductReducer';

export default combineReducers({
    users: userReducer,
    search: SearchReducer,
    products: ProductReducer,
});