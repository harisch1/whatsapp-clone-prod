import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducers, initialState, childern }) => (
  <StateContext.Provider value={useReducer(reducers, initialState)}>
    {childern}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
