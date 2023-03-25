import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User, { IUserRequest } from "../models/User";
import generateToken from "../utils/generateToken";

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
    await user.save();
    res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id.toString())
    });
});

/**
 * @Description login user
 * @Route /api/users/login
 * @Method POST
 */
export const login = asyncHandler(async (req: Request, res: Response) =>{
    const { email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    if(await user.comparePassword(password)) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            token: generateToken(user._id.toString())
        });
    }
    else {
        res.status(401);
        throw new Error("User or password incorrect");
    }
});