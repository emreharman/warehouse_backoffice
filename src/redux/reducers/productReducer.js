import {
    PRODUCT_FETCH_REQUEST,
    PRODUCT_FETCH_SUCCESS,
    PRODUCT_FETCH_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
  } from "../actions/types";
  
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };
  
  const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case PRODUCT_FETCH_REQUEST:
      case PRODUCT_CREATE_REQUEST:
      case PRODUCT_UPDATE_REQUEST:
      case PRODUCT_DELETE_REQUEST:
        return { ...state, loading: true, error: null };
  
      case PRODUCT_FETCH_SUCCESS:
        return { ...state, data: action.payload, loading: false };
  
      case PRODUCT_CREATE_SUCCESS:
        return {
          ...state,
          data: [...state.data, action.payload],
          loading: false,
        };
  
      case PRODUCT_UPDATE_SUCCESS:
        return {
          ...state,
          data: state.data.map((p) =>
            p._id === action.payload._id ? action.payload : p
          ),
          loading: false,
        };
  
      case PRODUCT_DELETE_SUCCESS:
        return {
          ...state,
          data: state.data.filter((p) => p._id !== action.payload),
          loading: false,
        };
  
      case PRODUCT_FETCH_FAIL:
      case PRODUCT_CREATE_FAIL:
      case PRODUCT_UPDATE_FAIL:
      case PRODUCT_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default productReducer;
  