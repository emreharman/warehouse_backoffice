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
  } from './types';
  
  import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } from '../../api/categories';
  
  export const getCategories = () => async (dispatch) => {
    dispatch({ type: CATEGORY_FETCH_REQUEST });
    try {
      const { data } = await fetchCategories();
      dispatch({ type: CATEGORY_FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CATEGORY_FETCH_FAIL, payload: error.message });
    }
  };
  
  export const addCategory = (categoryData) => async (dispatch) => {
    dispatch({ type: CATEGORY_CREATE_REQUEST });
    try {
      const { data } = await createCategory(categoryData);
      dispatch({ type: CATEGORY_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CATEGORY_CREATE_FAIL, payload: error.message });
    }
  };
  
  export const editCategory = (id, updatedData) => async (dispatch) => {
    dispatch({ type: CATEGORY_UPDATE_REQUEST });
    try {
      const { data } = await updateCategory(id, updatedData);
      dispatch({ type: CATEGORY_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CATEGORY_UPDATE_FAIL, payload: error.message });
    }
  };
  
  export const removeCategory = (id) => async (dispatch) => {
    dispatch({ type: CATEGORY_DELETE_REQUEST });
    try {
      await deleteCategory(id);
      dispatch({ type: CATEGORY_DELETE_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: CATEGORY_DELETE_FAIL, payload: error.message });
    }
  };
  