/**
 * Use Case: Get Current User
 */

import { User } from '../../domain/User';
import { UserRepository } from '../../ports/repositories/UserRepository.interface';

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User> {
    return await this.userRepository.getCurrentUser();
  }
}
