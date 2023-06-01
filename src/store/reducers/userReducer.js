import { FETCHUSERNAME } from "../actions";
import { auth, db } from "../../firebase/firebase";

const userReducer = (state = "", action) => {
  switch (action.type) {
    case FETCHUSERNAME:
      return action.payload;
    case "AUTHUSER":
      return action.payload;
    case "ISSHOPPING":
      return action.payload;
    case "SHIPPINGDETAILS":
      db.collection("ShoppingUsers")
        .doc(auth.currentUser?.uid)
        .update({
          address: action.payload.address,
          city: action.payload.city,
          contact: action.payload.contact,
          country: action.payload.country,
          postcode: action.payload.postcode,
          province: action.payload.province,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
        })
        .catch((err) => console.log(err));
      return 0;
    case "GETCHECKOUTDETAILS":
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
