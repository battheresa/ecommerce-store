// initial state of the cart
export const initialState = {
    user: null,
    cart: [],
    products: [],
    looking: {
        id: localStorage.getItem('PRODUCT_ID'),
        item: null,
        variation: localStorage.getItem('PRODUCT_VARIATION')
    }
};

// get total cost in the cart
export const getTotalCost = (cart) => cart?.reduce((amount, item) => item.price + amount, 0);

// action function
const reducer = (state, action) => {
    switch(action.type) {
        case 'ADD':
            return { ...state, user: action.user, cart: [...state.cart, action.item] };

        case 'REMOVE':
            const index = state.cart.findIndex((item) => item.id === action.id);
            let temp = [...state.cart];

            if (index >= 0)
                temp.splice(index, 1);
            else
                console.warn('ERROR: Item not found');

            return { state, user: action.user, cart: temp };

        case 'EMPTY':
            return { ...state, user: action.user, cart: [] };

        case 'SET_USER':
            return { ...state, user: action.user };

        case 'ALL_PRODUCTS':
            console.log('reducer: ', action.products);
            return { ...state, products: action.products };

        case 'UPDATE_PRODUCT': 
            console.log('update product: ', action.looking);

            localStorage.setItem('PRODUCT_ID', action.looking.id);
            localStorage.setItem('PRODUCT_VARIATION', action.looking.variation);
            return { ...state, user: action.user, looking: action.looking };

        default:
            return state;
    }
}

export default reducer;