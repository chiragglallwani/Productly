export const FETCHUSERNAME = "FETCHUSERNAME";


export const fetchUsername = username => {
    //console.log("action ",username)
    return {
        type: FETCHUSERNAME,
        payload: username,
    }
};