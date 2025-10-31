/**
 * Use Case: Sign Up
 */

import { User } from '../../domain/User';
import { UserRepository } from '../../ports/repositories/UserRepository.interface';

export class SignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string, name: string): Promise<User> {
    return await this.userRepository.signup(email, password, name);
  }
}
