// initial state of the cart
export const initialState = {
    user: null,
    // user: {
    //     firstname: 'firstname',
    //     lastname: 'lastname',
    //     email: 'test@example.com',
    //     addresses: [
    //         {
    //             default: true,
    //             name: 'home',
    //             address1: '0/F Building A',
    //             address2: 'AAA Road, some more address',
    //             district: 'Kowloon',
    //             country: 'Thailand'
    //         },
    //         {
    //             default: false,
    //             name: 'office',
    //             address1: '1/F Building B',
    //             address2: 'BBB Road, some more address',
    //             district: 'Kowloon',
    //             country: 'Hong Kong (SAR)'
    //         }
    //     ]
    // },
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
    products: [],
    looking: {
        id: localStorage.getItem('PRODUCT_ID'),
        item: null,
        variation: localStorage.getItem('PRODUCT_VARIATION'),
        price: localStorage.getItem('PRODUCT_PRICE'),
    }
};

// get total cost in the cart
// export const getSubtotal = (cart) => 500;
export const getSubtotal = (cart) => cart?.reduce((amount, item) => item.price + amount, 0);

// action function
const reducer = (state, action) => {
    switch(action.type) {
        case 'SET_USER':
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

        case 'ALL_PRODUCTS':
            return { ...state, products: action.products };

        case 'UPDATE_PRODUCT': 
            localStorage.setItem('PRODUCT_ID', action.looking.id);
            localStorage.setItem('PRODUCT_VARIATION', action.looking.variation);
            localStorage.setItem('PRODUCT_PRICE', action.looking.price);
            
            return { ...state, user: action.user, looking: action.looking };

        default:
            return state;
    }
}

export default reducer;