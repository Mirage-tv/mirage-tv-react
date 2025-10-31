/**
 * Use Case: Sign In
 */

import { User } from '../../domain/User';
import { UserRepository } from '../../ports/repositories/UserRepository.interface';

export class SigninUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    return await this.userRepository.signin(email, password);
  }
}
