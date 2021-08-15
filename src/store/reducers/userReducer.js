import { FETCHUSERNAME } from "../actions";

export default (state="", action) => {
    if(action.type === FETCHUSERNAME){
        return action.payload;
    }
    else{
        return state;
    }
}