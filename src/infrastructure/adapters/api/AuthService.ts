// Authentication Service
// Handles all authentication-related API operations

import {
    CreateUserReq,
    HTTPResponseStatus,
    LoginReq,
} from '../../../core/domain/types';
import { API_ENDPOINTS } from '../../config/api.config';
import { httpClient } from '../http/HttpClient';

export class AuthService {
  /**
   * Register a new user account
   * POST /api/v1/auth/sign-up
   */
  async signUp(userData: CreateUserReq): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(
      API_ENDPOINTS.AUTH.SIGN_UP,
      userData
    );
  }

  /**
   * Login with email and password
   * POST /api/v1/auth/login
   */
  async login(credentials: LoginReq): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  /**
   * Logout current user
   * DELETE /api/v1/auth/logout
   */
  async logout(): Promise<HTTPResponseStatus> {
    return httpClient.delete<HTTPResponseStatus>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Trigger password reset flow
   * POST /api/v1/auth/forgot-password
   * Note: Always returns 200 OK regardless of email existence (security)
   */
  async forgotPassword(email: string): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { mail: email }
    );
  }
}

// Export singleton instance
export const authService = new AuthService();
