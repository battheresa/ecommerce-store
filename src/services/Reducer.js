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
}

// get total cost in the cart
// export const getSubtotal = (cart) => 500;
export const getSubtotal = (cart) => cart?.reduce((amount, item) => item.price + amount, 0);

// action function
const reducer = (state, action) => {
    var temp = [...state.cart];
    
    switch(action.type) {
        case 'SET_USER':
            localStorage.setItem('USER_ID', action.user?.id);
            return { ...state, user: action.user };

        case 'ADD_CART':
            if (action.quantity === 0)
                return { ...state, user: action.user, cart: state.cart };

            const indexAdd = state.cart.findIndex(item => item.item.id === action.item.id);

            if (indexAdd >= 0)
                temp[indexAdd].quantity += action.quantity;
            else 
                temp = [...state.cart, { item: action.item, quantity: action.quantity } ];

            console.log(temp);
            return { ...state, user: action.user, cart: temp };

        case 'REMOVE_CART':
            const indexRemove = state.cart.findIndex(item => item.id === action.item.id);

            if (indexRemove >= 0)
                temp[indexRemove].quantity -= action.quantity;
            else
                console.warn('ERROR REMOVE: Item not found');

            return { state, user: action.user, cart: temp };

        case 'EMPTY_CART':
            return { ...state, user: action.user, cart: [] };

        default:
            return state;
    }
}

export default reducer;