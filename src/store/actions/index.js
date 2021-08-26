export const FETCHUSERNAME = "FETCHUSERNAME";


export const fetchUsername = username => {
    //console.log("action ",username)
    return {
        type: FETCHUSERNAME,
        payload: username
    }
};

export const searchInputAction = inputValue => {
    return {
        type: 'SEARCH_VALUE',
        payload: inputValue
    }
}


export const addtoCart = product => {
    console.log("action product is",product)
    return {
        type: 'ADD_TO_CART',
        payload: product
    }
}