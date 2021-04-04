// initial state of the cart
export const initialState = {
    user: localStorage.getItem('USER_ID'),
    cart: [],
    promo: {
        code: 'test',
        discount: 5,
        unit: 'percent'
    },
    delivery: {
        method: 'test',
        cost: 100
    },
};

// get total cost in the cart
// export const getSubtotal = (cart) => 500;
export const getSubtotal = (cart) => cart?.reduce((amount, item) => item.price + amount, 0);

// action function
const reducer = (state, action) => {
    switch(action.type) {
        case 'SET_USER':
            localStorage.setItem('USER_ID', action.user?.id);
            return { ...state, user: action.user };

        case 'ADD_CART':
            return { ...state, user: action.user, cart: [...state.cart, action.item] };

        case 'REMOVE_CART':
            const index = state.cart.findIndex((item) => item.id === action.id);
            let temp = [...state.cart];

            if (index >= 0)
                temp.splice(index, 1);
            else
                console.warn('ERROR: Item not found');

            return { state, user: action.user, cart: temp };

        case 'EMPTY_CART':
            return { ...state, user: action.user, cart: [] };

        default:
            return state;
    }
}

export default reducer;