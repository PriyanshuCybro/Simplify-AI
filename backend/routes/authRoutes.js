import express from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';


const router = express.Router();

//validate middleware
const registerValidation = [
    body('username')
    .trim()
    .isLength({min: 3})
    .withMessage('Username must be at least 3 characters long'),

    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

    body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

    body('password')
    .notEmpty()
    .withMessage('Password is required')

];

const forgotPasswordValidation = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
];

const resetPasswordValidation = [
    body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long')
];

//public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:resetToken', resetPasswordValidation, resetPassword);

//protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

export default router;

