import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User, { IUserRequest } from "../models/User";

/**
 * @Description register user
 * @Route /api/users/register
 * @Method POST
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, avatar } = req.body;
    const user = new User({
        name,
        email,
        password,
        avatar
    });
    res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
    });
});