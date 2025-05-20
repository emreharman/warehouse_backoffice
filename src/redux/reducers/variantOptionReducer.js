import {
    VARIANT_OPTION_FETCH_REQUEST,
    VARIANT_OPTION_FETCH_SUCCESS,
    VARIANT_OPTION_FETCH_FAIL,
    VARIANT_OPTION_CREATE_REQUEST,
    VARIANT_OPTION_CREATE_SUCCESS,
    VARIANT_OPTION_CREATE_FAIL,
    VARIANT_OPTION_UPDATE_REQUEST,
    VARIANT_OPTION_UPDATE_SUCCESS,
    VARIANT_OPTION_UPDATE_FAIL,
    VARIANT_OPTION_DELETE_REQUEST,
    VARIANT_OPTION_DELETE_SUCCESS,
    VARIANT_OPTION_DELETE_FAIL,
  } from "../actions/types";
  
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };
  
  const variantOptionReducer = (state = initialState, action) => {
    switch (action.type) {
      case VARIANT_OPTION_FETCH_REQUEST:
      case VARIANT_OPTION_CREATE_REQUEST:
      case VARIANT_OPTION_UPDATE_REQUEST:
      case VARIANT_OPTION_DELETE_REQUEST:
        return { ...state, loading: true, error: null };
  
      case VARIANT_OPTION_FETCH_SUCCESS:
        return { ...state, data: action.payload, loading: false };
  
      case VARIANT_OPTION_CREATE_SUCCESS:
        return {
          ...state,
          data: [...state.data, action.payload],
          loading: false,
        };
  
      case VARIANT_OPTION_UPDATE_SUCCESS:
        return {
          ...state,
          data: state.data.map((item) =>
            item._id === action.payload._id ? action.payload : item
          ),
          loading: false,
        };
  
      case VARIANT_OPTION_DELETE_SUCCESS:
        return {
          ...state,
          data: state.data.filter((item) => item._id !== action.payload),
          loading: false,
        };
  
      case VARIANT_OPTION_FETCH_FAIL:
      case VARIANT_OPTION_CREATE_FAIL:
      case VARIANT_OPTION_UPDATE_FAIL:
      case VARIANT_OPTION_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default variantOptionReducer;
  