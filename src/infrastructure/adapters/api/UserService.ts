// User Service
// Handles all user profile management API operations

import {
    HTTPResponseStatus,
    UpdateUserMailReq,
    UpdateUserNameReq,
    UpdateUserPasswordReq,
    UserDTO,
} from '../../../core/domain/types';
import { API_ENDPOINTS } from '../../config/api.config';
import { httpClient } from '../http/HttpClient';

export class UserService {
  /**
   * Get current user profile
   * GET /api/v1/user
   */
  async getProfile(): Promise<UserDTO> {
    return httpClient.get<UserDTO>(API_ENDPOINTS.USER.GET_PROFILE);
  }

  /**
   * Update user display name
   * POST /api/v1/user/update-name
   */
  async updateName(data: UpdateUserNameReq): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(
      API_ENDPOINTS.USER.UPDATE_NAME,
      data
    );
  }

  /**
   * Update user email address
   * POST /api/v1/user/update-mail
   */
  async updateEmail(data: UpdateUserMailReq): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(
      API_ENDPOINTS.USER.UPDATE_EMAIL,
      data
    );
  }

  /**
   * Update user password
   * POST /api/v1/user/update-password
   */
  async updatePassword(data: UpdateUserPasswordReq): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(
      API_ENDPOINTS.USER.UPDATE_PASSWORD,
      data
    );
  }

  /**
   * Delete current user account permanently
   * DELETE /api/v1/user
   */
  async deleteAccount(): Promise<HTTPResponseStatus> {
    return httpClient.delete<HTTPResponseStatus>(
      API_ENDPOINTS.USER.DELETE_ACCOUNT
    );
  }
}

// Export singleton instance
export const userService = new UserService();
