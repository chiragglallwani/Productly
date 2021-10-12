import { auth, db } from "../../firebase/firebase";
import firebase from "firebase";
import { getCartTotal } from "../actions";

export default (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            //console.log("before setting payload:", action.payload);
            //console.log("DB list before setting", action.newList);
            //console.log(("db amount before setting", action.totalAmount));
            //console.log(action.newList);
            if(action.newList === undefined){
                db.collection('users').doc(auth.currentUser?.uid).set({
                    productList: [ action.payload],
                    totalAmount: getCartTotal([ action.payload], 0),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            else{
                db.collection('users').doc(auth.currentUser?.uid).set({
                    productList: [...action.newList, action.payload],
                    totalAmount: getCartTotal([...action.newList, action.payload], 0),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            //console.log("after setting payload:", action.payload);
            //console.log("DB list after setting", action.newList);
            //console.log(("db amount after setting", action.totalAmount));
            return 0;
        case 'REMOVE_FROM_CART':
            //console.log("inside productReducer",action.productList)
            const index = action.productList.findIndex(item => item.id === action.id);
            //console.log("total amount", action.totalAmount);
           
           //console.log("product List", newList.length);

            if(index >=0){
                action.productList.splice(index, 1);
            }
            else{
                console.warn(`can't remove product with id ${action.payload} as it is not in cart`);
            }

            db.collection('users').doc(auth.currentUser?.uid).update({
                productList: action.productList,
                totalAmount: getCartTotal(action.productList, 0),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => console.log(err))

            return 0;

        case 'EMPTY__CART':
            db.collection('users').doc(auth.currentUser?.uid).update({
                productList: [],
                totalAmount: 0.00,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => alert(err));
            return state;
        default:
            return state;
    }
}