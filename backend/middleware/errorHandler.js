const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";

    //Mongoose bad ObjectId
    if(err.name === "CastError" ) {
        statusCode = 404;
        message = "Resource Not Found";
    }

    //Mongoose duplicate key
    if(err.code === 11000) {
        const field = Object.keys(err.keyvalue)[0];
        statusCode = 400;
        message = `${field} already exists` ;
    }

    //Mongoose validation error
    if(err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val => val.message).join(', '));
    }

    //Multer file size error
    if(err.code === 'LIMIT_FILE_SIZE'){
        statusCode = 400;
        message = "File size exceeds the maximum limit to 10MB";
    }

    //JWT error
    if(err.name === 'JsonWebTokenError'){
        statusCode = 401;
        message = "Invalid Token";
    }
    if(err.name === 'TokenExpiredError'){
        statusCode = 401;
        message = "Token expired";
    }

    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
};


export default errorHandler;
    