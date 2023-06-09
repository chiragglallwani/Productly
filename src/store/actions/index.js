import firebase from "firebase";
import { auth, db } from "../../firebase/firebase";

export const FETCHUSERNAME = "FETCHUSERNAME";

export const authUserUID = (auth) => async (dispatch) => {
  dispatch({
    type: "AUTHUSER",
    payload: auth,
  });
};

export const getCartTotal = (productList) => {
  let totalAmount = 0;
  productList?.map(
    (item) => (totalAmount = item.price * item.qty + totalAmount)
  );
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

export const getShippingDetails = (auth) => async (dispatch) => {
  const shippingDetails = (
    await db.collection("ShoppingUsers").doc(auth.currentUser?.uid).get()
  ).data();
  const shippingData = {
    address: shippingDetails?.address,
    firstname: shippingDetails?.firstname,
    lastname: shippingDetails?.lastname,
    city: shippingDetails?.city,
    contact: shippingDetails?.contact,
    country: shippingDetails?.country,
    postcode: shippingDetails?.postcode,
    province: shippingDetails?.province,
    cart: shippingDetails?.cart,
    cartTotalAmount: shippingDetails?.cartTotalAmount,
  };
  await dispatch({
    type: "GETCHECKOUTDETAILS",
    payload: shippingData,
  });
};

export const submitShippingAddress =
  (shippingFormValues) => async (dispatch) => {
    const userShipmentDetails = {
      firstname: shippingFormValues.firstname.value,
      lastname: shippingFormValues.lastname.value,
      address: shippingFormValues.address.value,
      city: shippingFormValues.city.value,
      contact: shippingFormValues.contact.value,
      postcode: shippingFormValues.postcode.value,
      province: shippingFormValues.province.value,
      country: shippingFormValues.country.value,
    };

    dispatch({
      type: "SHIPPINGDETAILS",
      payload: userShipmentDetails,
    });
    return true;
  };

/*** SEARCH ACTIONS */
export const searchInputAction = (inputValue) => {
  return {
    type: "SEARCH_VALUE",
    payload: inputValue,
  };
};

/*** PRODUCT ACTIONS */

export const addToCart =
  (product, qtyUpdate = null) =>
  async (dispatch) => {
    const data = (
      await db.collection("ShoppingUsers").doc(auth.currentUser?.uid).get()
    ).data();

    let existingProducts = data?.cart;

    //case 1: Cart is empty
    if (existingProducts.length === 0) {
      const newCart = [
        {
          brand: product.brand,
          category: product.category,
          description: product.description,
          discountPercentage: product.discountPercentage,
          id: product.id,
          price: product.price,
          thumbnail: product.thumbnail,
          title: product.title,
          qty: 1,
          createdAt: firebase.firestore.Timestamp.now(),
        },
      ];

      dispatch({
        type: "ADD_TO_CART",
        payload: newCart,
      });
    } else if (
      existingProducts.length !== 0 &&
      existingProducts?.find((prod) => prod.id === product.id)
    ) {
      //updating qty to existing product in cart or adding same product again in cart

      // find the target product
      let targetProduct = existingProducts?.find(
        (prod) => prod.id === product.id
      );

      //remove that product from cart first and return array without that product
      let remaingProducts = existingProducts?.filter(
        (pro) => pro.id !== product.id
      );

      let updateTargetProduct = {
        brand: product.brand,
        category: product.category,
        description: product.description,
        discountPercentage: product.discountPercentage,
        id: product.id,
        price: product.price,
        thumbnail: product.thumbnail,
        title: product.title,
        qty:
          qtyUpdate === "ADD"
            ? parseInt(targetProduct.qty) + 1
            : parseInt(targetProduct.qty) - 1,
        createdAt: targetProduct.createdAt,
      };

      const updatingCart = [updateTargetProduct, ...remaingProducts];

      dispatch({
        type: "ADD_TO_CART",
        payload: updatingCart,
      });
    } else if (
      existingProducts.length !== 0 &&
      !existingProducts?.find((prod) => prod.id === product.id)
    ) {
      // adding diferent product to cart
      const newProduct = {
        brand: product.brand,
        category: product.category,
        description: product.description,
        discountPercentage: product.discountPercentage,
        id: product.id,
        price: product.price,
        thumbnail: product.thumbnail,
        title: product.title,
        qty: 1,
        createdAt: firebase.firestore.Timestamp.now(),
      };
      const updatingCart = [...existingProducts, newProduct];

      dispatch({
        type: "ADD_TO_CART",
        payload: updatingCart,
      });
    }
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

export const deleteDataFromDB =
  (orders, userEmail, orderNumber) => async (dispatch) => {
    const data = (
      await db.collection("ShoppingUsers").doc(auth.currentUser?.uid).get()
    ).data();
    let exstOrders = data?.orders;
    await db
      .collection("ShoppingUsers")
      .doc(auth.currentUser?.uid)
      .update({
        orders: [...exstOrders, orders],
      })
      .catch((err) => console.log(err));

    await db
      .collection("Orders")
      .doc(orderNumber.toString())
      .set({
        items: orders,
        username: userEmail,
        orderNumber: orderNumber,
        createdAt: firebase.firestore.Timestamp.now(),
      })
      .catch((err) => console.log(err));
    dispatch({
      type: "EMPTY__CART",
    });
  };

export const returnPrevOrderNumber = async () => {
  const orderNumber = await db
    .collection("Orders")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get()
    .then((res) =>
      res.docs.map((result) => {
        return result.data()?.orderNumber;
      })
    );
  return orderNumber[0];
};
