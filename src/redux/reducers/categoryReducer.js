import {
    CATEGORY_FETCH_REQUEST,
    CATEGORY_FETCH_SUCCESS,
    CATEGORY_FETCH_FAIL,
    CATEGORY_CREATE_REQUEST,
    CATEGORY_CREATE_SUCCESS,
    CATEGORY_CREATE_FAIL,
    CATEGORY_UPDATE_REQUEST,
    CATEGORY_UPDATE_SUCCESS,
    CATEGORY_UPDATE_FAIL,
    CATEGORY_DELETE_REQUEST,
    CATEGORY_DELETE_SUCCESS,
    CATEGORY_DELETE_FAIL,
  } from '../actions/types';
  
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };
  
  const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
      // ----- Loading states -----
      case CATEGORY_FETCH_REQUEST:
      case CATEGORY_CREATE_REQUEST:
      case CATEGORY_UPDATE_REQUEST:
      case CATEGORY_DELETE_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      // ----- Success states -----
      case CATEGORY_FETCH_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
  
      case CATEGORY_CREATE_SUCCESS:
        return {
          ...state,
          data: [...state.data, action.payload],
          loading: false,
        };
  
      case CATEGORY_UPDATE_SUCCESS:
        return {
          ...state,
          data: state.data.map((cat) =>
            cat.id === action.payload.id ? action.payload : cat
          ),
          loading: false,
        };
  
      case CATEGORY_DELETE_SUCCESS:
        return {
          ...state,
          data: state.data.filter((cat) => cat.id !== action.payload),
          loading: false,
        };
  
      // ----- Fail states -----
      case CATEGORY_FETCH_FAIL:
      case CATEGORY_CREATE_FAIL:
      case CATEGORY_UPDATE_FAIL:
      case CATEGORY_DELETE_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      // ----- Default -----
      default:
        return state;
    }
  };
  
  export default categoryReducer;
  