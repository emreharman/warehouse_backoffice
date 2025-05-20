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
  } from "./types";
  
  import {
    fetchVariantOptions,
    createVariantOption,
    updateVariantOption,
    deleteVariantOption,
  } from "../../api/variantOptions";
  
  // Get all
  export const getVariantOptions = () => async (dispatch) => {
    dispatch({ type: VARIANT_OPTION_FETCH_REQUEST });
    try {
      const { data } = await fetchVariantOptions();
      dispatch({ type: VARIANT_OPTION_FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: VARIANT_OPTION_FETCH_FAIL, payload: error.message });
    }
  };
  
  // Create
  export const addVariantOption = (optionData) => async (dispatch) => {
    dispatch({ type: VARIANT_OPTION_CREATE_REQUEST });
    try {
      const { data } = await createVariantOption(optionData);
      dispatch({ type: VARIANT_OPTION_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: VARIANT_OPTION_CREATE_FAIL, payload: error.message });
    }
  };
  
  // Update
  export const updateVariantOptionById = (id, optionData) => async (dispatch) => {
    dispatch({ type: VARIANT_OPTION_UPDATE_REQUEST });
    try {
      const { data } = await updateVariantOption(id, optionData);
      dispatch({ type: VARIANT_OPTION_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: VARIANT_OPTION_UPDATE_FAIL, payload: error.message });
    }
  };
  
  // Delete
  export const removeVariantOption = (id) => async (dispatch) => {
    dispatch({ type: VARIANT_OPTION_DELETE_REQUEST });
    try {
      await deleteVariantOption(id);
      dispatch({ type: VARIANT_OPTION_DELETE_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: VARIANT_OPTION_DELETE_FAIL, payload: error.message });
    }
  };
  