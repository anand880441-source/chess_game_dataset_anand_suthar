import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { updateProfile, logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/uiSlice';
import authService from '../services/authService';

const profileSchema = Yup.object({
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});

function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { theme } = useSelector((state) => state.ui);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async (values) => {
        setIsLoading(true);
        try {
            const response = await authService.updateProfile(values);
            if (response.success) {
                dispatch(updateProfile(response.data));
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await authService.deleteProfile();
                dispatch(logout());
                toast.success('Account deleted successfully');
                window.location.href = '/login';
            } catch (error) {
                toast.error('Failed to delete account');
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Profile | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Profile Information
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Update your personal information
                                </p>
                            </div>

                            <div className="p-6">
                                {!isEditing ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-3xl text-white font-bold">
                                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {user?.name}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {user?.email}
                                                </p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                    Role: {user?.role || 'User'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="btn-primary"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Formik
                                        initialValues={{
                                            name: user?.name || '',
                                            email: user?.email || '',
                                        }}
                                        validationSchema={profileSchema}
                                        onSubmit={handleUpdateProfile}
                                    >
                                        {({ errors, touched, isSubmitting }) => (
                                            <Form className="space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="label">
                                                        Full Name
                                                    </label>
                                                    <Field
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        className={`input ${errors.name && touched.name ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.name && touched.name && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="label">
                                                        Email Address
                                                    </label>
                                                    <Field
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        className={`input ${errors.email && touched.email ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.email && touched.email && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting || isLoading}
                                                        className="btn-primary"
                                                    >
                                                        {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditing(false)}
                                                        className="btn-secondary"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <div className="space-y-6">
                        {/* Appearance Settings */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Appearance
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Customize your theme preferences
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">Dark Mode</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Switch between light and dark theme
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => dispatch(toggleTheme())}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Account
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Manage your account settings
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <button
                                        onClick={() => {
                                            dispatch(logout());
                                            toast.success('Logged out successfully');
                                        }}
                                        className="w-full btn-secondary"
                                    >
                                        Logout
                                    </button>
                                    
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
