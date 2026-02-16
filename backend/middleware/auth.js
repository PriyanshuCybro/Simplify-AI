// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const protect = async (req, res, next) => {
//     let token;

//     //check if token exists in Authorization header
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//         try {
//             token = req.headers.authorization.split(' ')[1];

//             //verify token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
//             //get user from the decoded token
//              req.user = await User.findById(decoded.id).select('-password');
            
//             //check if user exists
//             if(!req.user){
//                 return res.status(401).json({
//                     success: false,
//                     error: "User Not Found..!",
//                     statuscode: 401,
//                 });
//             }
          
//             //call next middleware
//             next();
            
//         } catch (error) {
//             console.error('Auth middleware error:' ,error.message);
            
//             if(error.name === 'TokenExpiredError') {
//                 return res.status(401).json({
//                     success: false,
//                     error: "Token has expired",
//                     statuscode: 401,
//                 });
//             }

//             return res.status(401).json({
//                 success: false,
//                 error: "Not Authorized, Invalid token",
//                 statuscode: 401,
//             });
//         }
//     }

//     if(!token) {
//         return res.status(401).json({
//             success: false,
//             error: "Not Authorized, No token found",
//             statuscode: 401,
//         });
//     }
// };

// export default protect;




// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if Authorization header exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 🔥 FIX: Check both 'id' and '_id' (Sometimes payload differs)
            const userId = decoded.id || decoded._id;

            // Get user from the token (excluding password)
            req.user = await User.findById(userId).select('-password');

            if (!req.user) {
                console.error("❌ Auth Error: Token valid but User not found in DB");
                return res.status(401).json({ success: false, message: 'User no longer exists' });
            }

            next();
        } catch (error) {
            console.error("❌ JWT Verification Error:", error.message);
            return res.status(401).json({ 
                success: false, 
                message: error.message === 'jwt expired' ? 'Session expired, please login again' : 'Not authorized, token failed' 
            });
        }
    }

    if (!token) {
        console.error("❌ Auth Error: No token provided in headers");
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export default protect;