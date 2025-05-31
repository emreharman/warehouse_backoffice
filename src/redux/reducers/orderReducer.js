import {
    ORDER_FETCH_REQUEST,
    ORDER_FETCH_SUCCESS,
    ORDER_FETCH_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_UPDATE_STATUS_REQUEST,
    ORDER_UPDATE_STATUS_SUCCESS,
    ORDER_UPDATE_STATUS_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_FAIL,
  } from "../actions/types";
  
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };
  
  const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case ORDER_FETCH_REQUEST:
      case ORDER_CREATE_REQUEST:
      case ORDER_UPDATE_STATUS_REQUEST:
      case ORDER_DELETE_REQUEST:
        return { ...state, loading: true, error: null };
  
      case ORDER_FETCH_SUCCESS:
        return { ...state, data: action.payload, loading: false };
  
      case ORDER_CREATE_SUCCESS:
        return {
          ...state,
          data: [...state.data, action.payload],
          loading: false,
        };
  
      case ORDER_UPDATE_STATUS_SUCCESS:
        return {
          ...state,
          data: state.data.map((o) =>
            o._id === action.payload._id ? action.payload : o
          ),
          loading: false,
        };
  
      case ORDER_DELETE_SUCCESS:
        return {
          ...state,
          data: state.data.filter((o) => o._id !== action.payload),
          loading: false,
        };
  
      case ORDER_FETCH_FAIL:
      case ORDER_CREATE_FAIL:
      case ORDER_UPDATE_STATUS_FAIL:
      case ORDER_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default orderReducer;
  