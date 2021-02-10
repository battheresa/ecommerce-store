import React, { createContext, useContext, useReducer } from 'react';

// prepare data layer
export const StateContext = createContext();

// wrap the app (so all components can pull data)
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

// get information form data layer
export const useStateValue = () => useContext(StateContext);