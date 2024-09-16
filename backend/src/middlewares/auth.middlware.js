import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT and check user role.
 * @param {string[]} roles - Array of roles that are allowed to access the resource.
 */
export const verifyJWT = (roles = []) => asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Check user role if roles are specified
        if (roles.length > 0 && !roles.includes(user.role)) {
            throw new ApiError(403, "Forbidden: You do not have the required permissions");
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid Access Token"));
    }
});
