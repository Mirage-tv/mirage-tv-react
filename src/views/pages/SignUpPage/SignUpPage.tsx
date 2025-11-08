import './SignUpPage.css';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/hooks';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    confirmPassword: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.mail || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!formData.mail.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const result = await signUp({
      name: formData.name,
      mail: formData.mail,
      password: formData.password,
    });

    if (result.success) {
      navigate('/');
    } else {
      setFormError(result.error || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-page__container">
        <div className="sign-up-page__card">
          <div className="sign-up-page__header">
            <h1>Create Your Account</h1>
            <p>Join Mirage-TV and start watching today</p>
          </div>

          <form onSubmit={handleSubmit} className="sign-up-page__form">
            <div className="sign-up-page__form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>

            <div className="sign-up-page__form-group">
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

            <div className="sign-up-page__form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            <div className="sign-up-page__form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            {(formError || error) && (
              <div className="sign-up-page__error-message">
                {formError || error}
              </div>
            )}

            <button
              type="submit"
              className="sign-up-page__btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="sign-up-page__footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="sign-up-page__link-login">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="sign-up-page__benefits">
          <h2>What You Get</h2>
          <ul>
            <li>
              <span className="sign-up-page__benefit-icon">🎬</span>
              <div>
                <h3>Unlimited Content</h3>
                <p>Access thousands of movies and shows</p>
              </div>
            </li>
            <li>
              <span className="sign-up-page__benefit-icon">📱</span>
              <div>
                <h3>Watch Anywhere</h3>
                <p>Stream on your phone, tablet, laptop, and TV</p>
              </div>
            </li>
            <li>
              <span className="sign-up-page__benefit-icon">⭐</span>
              <div>
                <h3>Exclusive Originals</h3>
                <p>Enjoy Mirage-TV exclusive content</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
