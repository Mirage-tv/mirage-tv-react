/**
 * Dependency Injection Configuration
 */

import { FetchHttpClient } from '../adapters/http/FetchHttpClient';
import { MovieApiRepository } from '../adapters/api/MovieApiRepository';
import { UserApiRepository } from '../adapters/api/UserApiRepository';
import { CategoryApiRepository } from '../adapters/api/CategoryApiRepository';

import { GetMoviesUseCase } from '../../core/useCases/movie/GetMovies.usecase';
import { GetMovieByIdUseCase } from '../../core/useCases/movie/GetMovieById.usecase';
import { SearchMoviesUseCase } from '../../core/useCases/movie/SearchMovies.usecase';

import { SigninUseCase } from '../../core/useCases/user/Signin.usecase';
import { SignupUseCase } from '../../core/useCases/user/Signup.usecase';
import { GetCurrentUserUseCase } from '../../core/useCases/user/GetCurrentUser.usecase';

import { GetCategoriesUseCase } from '../../core/useCases/category/GetCategories.usecase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const httpClient = new FetchHttpClient(API_BASE_URL);

export const movieRepository = new MovieApiRepository(httpClient);
export const userRepository = new UserApiRepository(httpClient);
export const categoryRepository = new CategoryApiRepository(httpClient);

export const getMoviesUseCase = new GetMoviesUseCase(movieRepository);
export const getMovieByIdUseCase = new GetMovieByIdUseCase(movieRepository);
export const searchMoviesUseCase = new SearchMoviesUseCase(movieRepository);

export const signinUseCase = new SigninUseCase(userRepository);
export const signupUseCase = new SignupUseCase(userRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
