import axios from "axios";
import { userRequest, userSuccess, userFail, userLogout } from "./user.reducer";

export const login = (user) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const config = { headers: { "Content-Type": "application/json" } };
    const userData = await axios({
      method: "POST",
      url: "http://localhost:4000/api/v1/user/login",
      data: user,
      config,
    });
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userData.data.userToken}`;
    localStorage.setItem(
      "userToken",
      JSON.stringify({ userToken: userData.data.userToken })
    );
    return dispatch(userSuccess(userData.data));
  } catch (error) {
    return dispatch(userFail(error.response.data.message));
  }
};
export const signUp = (user) => async (dispatch) => {
  try {
    console.log("Dispatching user request..."); // Log the request initiation
    dispatch(userRequest());

    // Define the API URL
    const API_URL = "http://localhost:4000/api/v1/user/signup";
    console.log("API URL:", API_URL); // Log the API URL
    console.log("User data being sent:", user); // Log the user data

    // Make the API call
    const userData = await axios.post(API_URL, user, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response received:", userData); // Log the API response

    // Set the Authorization header for subsequent requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.data.userToken}`;
    console.log("Authorization token set:", userData.data.userToken); // Log the token

    // Store the token in localStorage
    localStorage.setItem("userToken", JSON.stringify({ userToken: userData.data.userToken }));
    console.log("Token stored in localStorage."); // Log the storage action

    // Dispatch success action
    return dispatch(userSuccess(userData.data));
  } catch (error) {
    // Enhanced error handling with logging
    console.error("Error during sign-up:", error); // Log the entire error object
    const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
    console.log("Error message to dispatch:", errorMessage); // Log the error message
    return dispatch(userFail(errorMessage));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    localStorage.removeItem("userToken");
    // window.location.reload()
    return dispatch(userLogout());
  } catch (error) {
    return dispatch(userFail(error.response.data.message));
  }
};
export const getUserDetails = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    const userData = await axios({
      method: "GET",
      url: "http://localhost:4000/api/v1/user/me",
    });
    return dispatch(userSuccess(userData.data.user));
  } catch (error) {
    return dispatch(userFail(error.response.data.message));
  }
};
