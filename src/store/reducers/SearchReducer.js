export default (state = '', action) => {
    switch (action.type) {
        case 'SEARCH_VALUE':
            return action.payload;
        default:
            return state;
    }
}