import { auth, db } from "../../firebase/firebase";
export const FETCHUSERNAME = "FETCHUSERNAME";

export const getCartTotal = (productList, totalAmount) => {
  productList?.map((item) => {
    totalAmount += item.price;
  });
  totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
  return totalAmount;
};

/**    USER ACTIONS */
export const fetchUsername = (username) => {
  return {
    type: FETCHUSERNAME,
    payload: username,
  };
};

export const userIsShopping = (isShopping) => {
  return {
    type: "ISSHOPPING",
    payload: isShopping,
  };
};

/*** SEARCH ACTIONS */
export const searchInputAction = (inputValue) => {
  return {
    type: "SEARCH_VALUE",
    payload: inputValue,
  };
};

/*** PRODUCT ACTIONS */

export const addtoCart = (product) => async (dispatch) => {
  const data = (
    await db.collection("ShoppingUsers").doc(auth.currentUser?.uid).get()
  ).data();
  /*if(data === undefined){
        db.collection('ShoppingUsers').doc(auth.currentUser?.uid).set({
            productList: [],
            totalAmount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        dispatch({
            type: 'ADD_TO_CART',
            payload: product,
        })
    }*/
  //else{
  let newList = data?.cart;
  let totalAmount = data?.cartTotalAmount;

  dispatch({
    type: "ADD_TO_CART",
    payload: product,
    newList,
    cartTotalAmount: totalAmount,
  });
  //}
};

export const removeFromCart = (id) => async (dispatch) => {
  const data = (
    await db.collection("ShoppingUsers").doc(auth.currentUser?.uid).get()
  ).data();
  let newList = data.cart;
  let totalAmount = data.cartTotalAmount;
  dispatch({
    type: "REMOVE_FROM_CART",
    id,
    cart: newList,
    cartTotalAmount: totalAmount,
  });
};

export const deleteDataFromDB = () => async (dispatch) => {
  dispatch({
    type: "EMPTY__CART",
  });
};
