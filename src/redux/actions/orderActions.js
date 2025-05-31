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
  } from "./types";
  
  import {
    fetchOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  } from "../../api/orders";
  
  // Get all orders
  export const getOrders = () => async (dispatch) => {
    dispatch({ type: ORDER_FETCH_REQUEST });
    try {
      const { data } = await fetchOrders();
      dispatch({ type: ORDER_FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ORDER_FETCH_FAIL, payload: error.message });
    }
  };
  
  // Create order
  export const addOrder = (orderData) => async (dispatch) => {
    dispatch({ type: ORDER_CREATE_REQUEST });
    try {
      const { data } = await createOrder(orderData);
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ORDER_CREATE_FAIL, payload: error.message });
    }
  };
  
  // ✅ Update order status (FIXED)
  export const updateOrderStatusById = (id, status) => async (dispatch) => {
    dispatch({ type: ORDER_UPDATE_STATUS_REQUEST });
    try {
      const { data } = await updateOrderStatus(id, status);
      dispatch({ type: ORDER_UPDATE_STATUS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_STATUS_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Delete order
  export const removeOrder = (id) => async (dispatch) => {
    dispatch({ type: ORDER_DELETE_REQUEST });
    try {
      await deleteOrder(id);
      dispatch({ type: ORDER_DELETE_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: ORDER_DELETE_FAIL, payload: error.message });
    }
  };
  