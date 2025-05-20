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
  } from "./types";
  
  import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } from "../../api/products";
  
  // Get all
  export const getProducts = () => async (dispatch) => {
    dispatch({ type: PRODUCT_FETCH_REQUEST });
    try {
      const { data } = await fetchProducts();
      dispatch({ type: PRODUCT_FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_FETCH_FAIL, payload: error.message });
    }
  };
  
  // Create
  export const addProduct = (productData) => async (dispatch) => {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    try {
      const { data } = await createProduct(productData);
      dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_CREATE_FAIL, payload: error.message });
    }
  };
  
  // Update
  export const updateProductById = (id, productData) => async (dispatch) => {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });
    try {
      const { data } = await updateProduct(id, productData);
      dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_UPDATE_FAIL, payload: error.message });
    }
  };
  
  // Delete
  export const removeProduct = (id) => async (dispatch) => {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    try {
      await deleteProduct(id);
      dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: PRODUCT_DELETE_FAIL, payload: error.message });
    }
  };
  