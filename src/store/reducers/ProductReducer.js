import { auth, db } from "../../firebase/firebase";
import firebase from "firebase";
import { getCartTotal } from "../actions";

export default (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            if(action.newList === undefined){
                db.collection('ShoppingUsers').doc(auth.currentUser?.uid).update({
                    cart: [ action.payload],
                    cartTotalAmount: getCartTotal([ action.payload], 0),
                }).catch(err => console.log(err));
            }
            else{
                db.collection('ShoppingUsers').doc(auth.currentUser?.uid).update({
                    cart: [...action.newList, action.payload],
                    cartTotalAmount: getCartTotal([...action.newList, action.payload], 0),
                }).catch(err => console.log(err));
            }
            return 0;
        case 'REMOVE_FROM_CART':
            
            const index = action.cart.findIndex(item => item.id === action.id);

            if(index >=0){
                action.cart.splice(index, 1);
            }
            else{
                console.warn(`can't remove product with id ${action.payload} as it is not in cart`);
            }

            db.collection('ShoppingUsers').doc(auth.currentUser?.uid).update({
                cart: action.cart,
                cartTotalAmount: getCartTotal(action.cart, 0),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => console.log(err))

            return 0;

        case 'EMPTY__CART':
            db.collection('ShoppingUsers').doc(auth.currentUser?.uid).update({
                cart: [],
                cartTotalAmount: 0.00,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => alert(err));
            return state;
        default:
            return state;
    }
}