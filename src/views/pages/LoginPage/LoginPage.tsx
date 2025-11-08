import './LoginPage.css';
// Login Page Component
// Handles user authentication with the Mirage-TV API

import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/hooks';

export const LoginPage = () =>() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    mail: '',
    password: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validation
    if (!formData.mail || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!formData.mail.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Attempt login
    const result = await login({
      mail: formData.mail,
      password: formData.password,
    });

    if (result.success) {
      // Redirect to home page on successful login
      navigate('/');
    } else {
      // Display error message
      setFormError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-page__login-page">
      <div className="login-page__login-container">
        <div className="login-page__login-card">
          <div className="login-page__login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue watching</p>
          </div>

          <form onSubmit={handleSubmit} className="login-page__login-form">
            <div className="login-page__form-group">
              <label htmlFor="mail">Email Address</label>
              <input
                id="mail"
                name="mail"
                type="email"
                value={formData.mail}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="login-page__form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            {(formError || error) && (
              <div className="login-page__error-message">
                {formError || error}
              </div>
            )}

            <button
              type="submit"
              className="login-page__btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              className="login-page__btn-forgot-password"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </form>

          <div className="login-page__login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="login-page__link-signup">
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        <div className="login-page__login-features">
          <h2>Why Mirage-TV?</h2>
          <ul>
            <li>
              <span className="login-page__feature-icon">📺</span>
              <div>
                <h3>Unlimited Entertainment</h3>
                <p>Watch movies and TV shows anytime, anywhere</p>
              </div>
            </li>
            <li>
              <span className="login-page__feature-icon">⭐</span>
              <div>
                <h3>Premium Content</h3>
                <p>Access to exclusive originals and trending titles</p>
              </div>
            </li>
            <li>
              <span className="login-page__feature-icon">🎯</span>
              <div>
                <h3>Personalized Experience</h3>
                <p>Continue watching and custom recommendations</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


