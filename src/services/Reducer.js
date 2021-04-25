// initial state of the cart
export const initialState = {
    user: localStorage.getItem('USER_ID'),
    cart: [],
    promo: null,
    delivery: null,
}

// get total cost in the cart
export const getSubtotal = (cart) => {
    var subtotal = 0;

    cart?.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    return subtotal;
}

// action function
const reducer = (state, action) => {
    var temp = [...state.cart];
    
    switch(action.type) {
        case 'SET_USER':
            localStorage.setItem('USER_ID', action.user?.id);
            return { ...state, user: action.user };

        case 'SET_CHECKOUT':
            return { ...state, promo: action.promo, delivery: action.delivery };

        case 'ADD_CART':
            if (action.quantity === 0)
                return { ...state, cart: state.cart };

            const indexAdd = state.cart.findIndex(item => 
                item.id === action.item.id && 
                item.color === action.item.color && 
                item.size === action.item.size && 
                item.material === action.item.material
            );

            if (indexAdd >= 0)
                temp[indexAdd].quantity += action.item.quantity;
            else 
                temp.push(action.item);

            return { ...state, cart: temp };

        case 'UPDATE_CART': 
            if (action.quantity === 0)
                return { ...state, cart: state.cart };

            const indexUpdate = state.cart.findIndex(item => item.id === action.item.id);
            temp[indexUpdate].quantity = action.item.quantity;

            return { ...state, cart: temp };

        case 'REMOVE_CART':
            const indexRemove = state.cart.findIndex(item => 
                item.id === action.item.id && 
                item.color === action.item.color && 
                item.size === action.item.size && 
                item.material === action.item.material
            );

            if (indexRemove >= 0)
                temp.splice(indexRemove, 1);

            return { state, cart: temp };

        case 'EMPTY_CART':
            return { ...state, cart: [] };

        default:
            return state;
    }
}

export default reducer;