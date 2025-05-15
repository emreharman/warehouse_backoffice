import { loginRequest } from "../../api/auth";
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "./types";

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await loginRequest(credentials);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    throw new Error("Giriş başarısız!");
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  dispatch({ type: LOGOUT });
};
