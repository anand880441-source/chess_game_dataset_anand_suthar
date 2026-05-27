import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import authService from '../../services/authService.js';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice.js';

const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(loginStart());
            const response = await authService.login(values);

            if (response.success) {
                dispatch(loginSuccess({
                    user: response.user,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                }));
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                dispatch(loginFailure(response.message));
                toast.error(response.message || 'Login failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            dispatch(loginFailure(message));
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">♟️</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Chess Match Analytics
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="rounded-md shadow-sm space-y-4">
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email Address
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className={`input ${errors.email && touched.email ? 'border-red-500' : ''}`}
                                        placeholder="user@example.com"
                                    />
                                    {errors.email && touched.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Field
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            className={`input ${errors.password && touched.password ? 'border-red-500' : ''}`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isLoading}
                                    className="btn-primary w-full flex justify-center"
                                >
                                    {isSubmitting || isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link to="/register" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                    Don't have an account? Sign up
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default Login;
