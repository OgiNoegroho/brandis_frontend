// src/redux/authReducer.ts

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("authToken") || null, // Load token from localStorage if it exists
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case "SET_TOKEN":
      localStorage.setItem("authToken", action.payload); // Store token in localStorage
      return { ...state, token: action.payload };
    case "REMOVE_TOKEN":
      localStorage.removeItem("authToken"); // Remove token from localStorage
      return { ...state, token: null };
    default:
      return state;
  }
};

export default authReducer;
