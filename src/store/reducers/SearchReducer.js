const searchReducer = (state = "", action) => {
  switch (action.type) {
    case "SEARCH_VALUE":
      return action.payload;
    default:
      return state;
  }
};

export default searchReducer;
