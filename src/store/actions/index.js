import firebase from 'firebase'
import { auth, db} from '../../firebase/firebase';
export const FETCHUSERNAME = "FETCHUSERNAME";

export const getCartTotal = productList => 
    productList?.reduce((amount, item) => Math.round(item.price + amount, 2), 0);

    /**    USER ACTIONS */
export const fetchUsername = username => {
    return {
        type: FETCHUSERNAME,
        payload: username
    }
};


/*** SEARCH ACTIONS */
export const searchInputAction = inputValue => {
    return {
        type: 'SEARCH_VALUE',
        payload: inputValue
    }
}


/*** PRODUCT ACTIONS */

export const addtoCart = product => async dispatch => {
    const data = (await db.collection('users').doc(auth.currentUser?.uid).get()).data();
    //console.log(data);
    if(data === undefined){
        db.collection('users').doc(auth.currentUser?.uid).set({
            productList: [],
            totalAmount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        dispatch({
            type: 'ADD_TO_CART',
            payload: product,
        })
    }
    else{
        let newList = data?.productList;
        //console.log(newList);
        let totalAmount = data?.totalAmount;
        //console.log(totalAmount);

        dispatch( {
            type: 'ADD_TO_CART',
            payload: product,
            newList,
            totalAmount,
        })
    }
}


export const removeFromCart = id => async dispatch =>  {
    const data = (await db.collection('users').doc(auth.currentUser?.uid).get()).data();
    //console.log(data);
    let newList = data.productList;
    //console.log(newList);
    let totalAmount = data.totalAmount;
    //console.log(totalAmount);
    dispatch(
        {
            type: 'REMOVE_FROM_CART',
            id,
            productList: newList,
            totalAmount: totalAmount,
        }
    )
}

export const deleteDataFromDB = () => async dispatch => {
    dispatch(
        {
            type: "EMPTY__CART",
        }
    )
}