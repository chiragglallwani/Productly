import { FETCHUSERNAME } from "../actions";

export default (state = "", action) => {
  if (action.type === FETCHUSERNAME) {
    return action.payload;
  } else if (action.type === "ISSHOPPING") {
    return action.payload;
  } else {
    return state;
  }
};
