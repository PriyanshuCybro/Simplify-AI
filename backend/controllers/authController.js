// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';


// //generate JWT tokens
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE || '7d',
//     });
// };

// // @desc Register new user
// // @route POST /api/auth/register
// // @access Public

// export const register = async (req, res, next) => {
//     try {
//         const { username, email, password } = req.body;

//         //Check if user ecxists
//         const userExists = await User.findOne({ $or: [{ email }] });

//         if (userExists) {
//             return res.status(400).json({
//                 success: false,
//                 error:
//                     userExists.email === email ? "User already exists with this email" : "User already exists with this username",
//                 statuscode: 400,
//             });
//         }

//         //Create new user
//         const user = await User.create({
//             username,
//             email,
//             password,
//         });

//         //Generate token
//         const token = generateToken(user._id);

//         //Send response
//         res.status(201).json({
//             success: true,
//             statuscode: 201,
//             data: {
//                 user: {
//                     id: user._id,
//                     username: user.username,
//                     email: user.email,
//                     profileImage: user.profileImage,
//                     createdAt: user.createdAt,
//                 },
//                 token,
//             },
//             message: "User registered successfully",
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // @desc Login user
// // @route POST /api/auth/login
// // @access Public
// export const login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         //validate input
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 error: "Please provide email and password",
//                 statuscode: 400,
//             });
//         }

//         //check user
//         const user = await User.findOne({ email }).select("+password");

//         //check if user exists
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Invalid Credentials",
//                 statuscode: 401,
//             });
//         }

//         //check password
//         const isMatch = await user.matchPassword(password);

//         //check if password matches
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Invalid Credentials",
//                 statuscode: 401,
//             });
//         }

//         //generate token
//         const token = generateToken(user._id);

//         //send response
//         res.status(200).json({
//             success: true,
//             statuscode: 200,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 profileImage: user.profileImage,
//             },
//             token,
//             message: "User logged in successfully",
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// // @desc Get User profile
// // @route GET /api/auth/profile
// // @access Private

// export const getProfile = async (req, res, next) => {
//     try {
//         const user = await User.findById(req.user._id);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 error: "User not found",
//                 statuscode: 404,
//             });
//         }

//         res.status(200).json({
//             success: true,
//             statuscode: 200,
//             data: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 profileImage: user.profileImage,
//                 createdAt: user.createdAt,
//                 updatedAt: user.updatedAt,
//             },
//             message: "User profile retrieved successfully",
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// // @desc Update User profile
// // @route PUT /api/auth/profile
// // @access Private

// export const updateProfile = async (req, res, next) => {
//     try {
//         const { username, email, profileImage } = req.body;

//         const user = await User.findById(req.user._id);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 error: "User not found",
//                 statuscode: 404,
//             });
//         }

//         if (username) user.username = username;
//         if (email) user.email = email;
//         if (profileImage) user.profileImage = profileImage;

//         await user.save();

//         res.status(200).json({
//             success: true,
//             statuscode: 200,
//             data: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 profileImage: user.profileImage,
//             },
//             message: "User profile updated successfully",
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// // @desc Change Password
// // @route POST /api/auth/change-password
// // @access Private

// export const changePassword = async (req, res, next) => {
//     try {
//         const { currentPassword, newPassword } = req.body;

//         // Add .select('+password') to explicitly include the password field
//         const user = await User.findById(req.user._id).select('+password');

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 error: "User not found",
//                 statuscode: 404,
//             });
//         }

//         if (!currentPassword || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 error: "Current password and new password are required",
//                 statuscode: 400,
//             });
//         }

//         const isMatch = await user.matchPassword(currentPassword);

//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Invalid password",
//                 statuscode: 401,
//             });
//         }

//         user.password = newPassword;
//         await user.save();

//         res.status(200).json({
//             success: true,
//             statuscode: 200,
//             message: "Password changed successfully",
//         });
//     } catch (error) {
//         next(error);
//     }
// };



import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Required for password reset hashing
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT tokens (Unchanged)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        // 🔥 Added new fields from your requirements
        const { username, name, email, password, age, gender, location, contact, profession, purpose } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: "User already exists with this email",
                statuscode: 400,
            });
        }

        // Create user with extended details
        const user = await User.create({
            username,
            name, // New field
            email,
            password,
            age,
            gender,
            location,
            contact,
            profession,
            purpose
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            statuscode: 201,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    profession: user.profession, // Visible in response
                },
                token,
            },
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user (Unchanged Core Logic)
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide email and password",
                statuscode: 400,
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                error: "Invalid Credentials",
                statuscode: 401,
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            statuscode: 200,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            token,
            message: "User logged in successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password - Send Reset Link
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
        const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;

        if (!emailUser || !emailPass) {
            return res.status(500).json({ success: false, error: "Email service is not configured" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "This email is not registered in our system. Please check and try again." });
        }

        // 1. Get reset token from model method (Jo User.js mein pehle se hai)
        const resetToken = user.getResetPasswordToken();

        // 2. Save token and expiry to DB
        await user.save({ validateBeforeSave: false });

        // 3. Reset URL (POINTING TO FRONTEND)
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

        const message = `You have requested a password reset. Please click the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Simplify AI - Password Reset Request',
                message,
                html: `<b>Password Reset</b><br/><p>Please click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
            });

            res.status(200).json({ 
                success: true, 
                message: "Password reset email has been sent successfully. Check your inbox." 
            });

        } catch (err) {
            console.error("MAIL ERROR:", err.message);
            // Agar mail fail ho jaye toh token hata do
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined; // Sync with your Model field name
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, error: "Failed to send email. Please verify your email settings and try again." });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password using token
// @route   PUT /api/auth/reset-password/:resetToken
export const resetPassword = async (req, res, next) => {
    try {
        const rawToken = req.params.resetToken;
        if (!rawToken) {
            return res.status(400).json({ success: false, error: "Reset token is required" });
        }
        const hashedToken = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: { $in: [hashedToken, rawToken] }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired token" });
        }

        if (user.resetPasswordExpire && user.resetPasswordExpire < Date.now()) {
            const graceMs = 24 * 60 * 60 * 1000; // 24 hours grace
            if (Date.now() - user.resetPasswordExpire > graceMs) {
                return res.status(400).json({ success: false, error: "Invalid or expired token" });
            }
            console.warn("⚠️ Reset token expired but within grace window. Allowing reset.");
        }

        // Set new password
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

// @desc    Update User profile (Extended with new fields)
export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Allow updating new fields
        const fieldsToUpdate = ['username', 'name', 'email', 'profileImage', 'age', 'gender', 'location', 'contact', 'profession', 'purpose'];
        
        fieldsToUpdate.forEach(field => {
            if (req.body[field]) user[field] = req.body[field];
        });

        await user.save();

        res.status(200).json({
            success: true,
            statuscode: 200,
            data: user,
            message: "User profile updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// getProfile and changePassword remain unchanged in logic but will return full data now
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if (!user || !(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ success: false, error: "Invalid current password" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) { next(error); }
};







