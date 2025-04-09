import { createContext, useContext, useReducer, useEffect } from "react";
import { User, AuthState } from "@/types/auth";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithRole: (role: "admin" | "user") => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock users for demo purposes
  const mockUsers = {
    admin: {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
    user: {
      id: "2",
      email: "user@example.com",
      name: "Regular User",
      role: "user" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    }
  };

  // Check if token exists and validate on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll use a mock authentication
      if (email === "admin@example.com" && password === "admin123") {
        // Generate a mock token
        const token = "mock-jwt-token-" + Date.now();

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(mockUsers.admin));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: mockUsers.admin, token },
        });
      } else if (email === "user@example.com" && password === "user123") {
        // Generate a mock token
        const token = "mock-jwt-token-" + Date.now();

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(mockUsers.user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: mockUsers.user, token },
        });
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: "Invalid email or password",
        });
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Authentication failed. Please try again.",
      });
    }
  };

  // Function to login with a specific role (for mock buttons)
  const loginWithRole = async (role: "admin" | "user") => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Generate a mock token
      const token = "mock-jwt-token-" + Date.now();
      const user = mockUsers[role];

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      return true;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Authentication failed. Please try again.",
      });

      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Function to register a new user
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // In a real app, this would be an API call to register the user
      // For demo purposes, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo, we'll just return success without actually creating a user
      dispatch({ type: "CLEAR_ERROR" });
      return true;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Registration failed. Please try again.",
      });

      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithRole,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
