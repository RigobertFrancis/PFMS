import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  departmentId: number | null;
  departmentName: string | null;
}

interface LoginResponse {
  message: string;
  email: string;
  otpSent: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  pendingOtpEmail: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<LoginResponse | null>;
  loginWithOtp: (email: string, otpCode: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  clearPendingOtp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<LoginResponse | null> => {
    try {
      setIsLoading(true);
      
      // Log the credentials being sent (without password)
      console.log("=== FRONTEND LOGIN ATTEMPT ===");
      console.log("Sending usernameOrEmail:", usernameOrEmail);
      console.log("Sending password:", password ? "***" : "NULL");
      console.log("==============================");
      
      // For testing - if backend fails, use manual OTP setup
      try {
        const response = await axios.post('http://localhost:8089/api/users/login', {
          usernameOrEmail,
          password
        });

        console.log("Login response:", response.data);

        if (response.data && response.data.otpSent) {
          // Store the email for OTP verification
          setPendingOtpEmail(response.data.email);
          return response.data;
        }
        return null;
      } catch (backendError) {
        console.log("Backend login failed, using manual OTP setup for testing");
        // Manual OTP setup for testing
        if (usernameOrEmail === 'admin' && password === 'admin123') {
          const manualResponse = {
            message: "Manual OTP setup for testing",
            email: "robertmsogoya2@gmail.com",
            otpSent: true
          };
          setPendingOtpEmail(manualResponse.email);
          return manualResponse;
        }
        throw backendError;
      }
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Response Data:", error.response?.data);
        console.error("Response Headers:", error.response?.headers);
        console.error("Request Config:", error.config);
      } else {
        console.error("Non-Axios error:", error);
      }
      console.error('===================');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOtp = async (email: string, otpCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For testing - manual OTP verification
      if (email === "robertmsogoya2@gmail.com" && otpCode === "123456") {
        console.log("Manual OTP verification successful");
        const userData = {
          id: 1,
          username: "admin",
          email: "robertmsogoya2@gmail.com",
          role: "ADMIN",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          departmentId: null,
          departmentName: null
        };
        setUser(userData);
        setPendingOtpEmail(null);
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('userData', JSON.stringify(userData));
        return true;
      }
      
      // Try backend OTP verification
      const response = await axios.post('http://localhost:8089/api/otp/verify', {
        email,
        otpCode
      });

      if (response.data) {
        const userData = response.data;
        setUser(userData);
        setPendingOtpEmail(null); // Clear pending OTP email
        localStorage.setItem('authToken', 'dummy-token'); // In a real app, store actual JWT token
        localStorage.setItem('userData', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPendingOtpEmail(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const clearPendingOtp = () => {
    setPendingOtpEmail(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    pendingOtpEmail,
    login,
    loginWithOtp,
    logout,
    isAuthenticated: !!user,
    clearPendingOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
