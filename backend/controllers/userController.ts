import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

/**
 * @Description register user
 * @Route /api/users/register
 * @Method POST
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, avatar } = req.body;
    
});