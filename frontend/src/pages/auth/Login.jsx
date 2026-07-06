import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
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

            console.log('Login response:', response);

            if (response.success) {
                const token = response.token || response.accessToken;
                const userData = response.user;

                console.log('Token to store:', token);

                if (token) {
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('user', JSON.stringify(userData));

                    dispatch(loginSuccess({
                        user: userData,
                        accessToken: token,
                    }));

                    toast.success('Welcome back, ' + (userData.name || 'User'));
                    navigate('/dashboard');
                } else {
                    toast.error('No token received from server');
                }
            } else {
                dispatch(loginFailure(response.message));
                toast.error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            dispatch(loginFailure(message));
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated Chess background elements */}
            <div className="absolute top-1/10 left-1/10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/10 right-1/10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float stagger-2"></div>
            
            {/* Decorative background Chess icons */}
            <div className="absolute -left-10 top-1/4 text-white/5 text-9xl font-extrabold select-none pointer-events-none transform -rotate-12 animate-float">
                ♞
            </div>
            <div className="absolute -right-10 bottom-1/4 text-white/5 text-9xl font-extrabold select-none pointer-events-none transform rotate-12 animate-float stagger-3">
                👑
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Brand header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse-glow">
                        <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 22H5v-2h14v2M17.16 8.26A8.94 8.94 0 0018 5h-2a7 7 0 01-.59 2.84L12 11.28 8.59 7.84A7 7 0 018 5H6a8.94 8.94 0 00.84 3.26L12 13.43l5.16-5.17M12 2a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1M17 20H7l2-8h6l2 8z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
                        Chess Match Analytics
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Analyze, improve, and conquer
                    </p>
                </div>

                {/* Glass Card */}
                <div className="card-glass border border-white/10 shadow-glass-dark py-8 px-6 sm:px-10 rounded-3xl animate-slide-up">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Sign In</h3>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                                                ✉️
                                            </span>
                                            <Field
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                className={`input pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500/20' : 'focus:ring-primary-500/20'}`}
                                                placeholder="username@domain.com"
                                            />
                                        </div>
                                        {errors.email && touched.email && (
                                            <p className="mt-1 text-xs text-red-400 font-medium">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                                                🔒
                                            </span>
                                            <Field
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                className={`input pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500/20' : 'focus:ring-primary-500/20'}`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                                            >
                                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        {errors.password && touched.password && (
                                            <p className="mt-1 text-xs text-red-400 font-medium">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isLoading}
                                        className="btn-primary w-full flex justify-center py-3 rounded-2xl font-bold tracking-wide"
                                    >
                                        {isSubmitting || isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            'Sign In to Dashboard'
                                        )}
                                    </button>
                                </div>

                                <div className="text-center pt-2">
                                    <Link to="/register" className="text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                                        Don't have an account? Sign up
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default Login;
