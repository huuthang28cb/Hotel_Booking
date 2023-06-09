import asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import Room from '../models/Room';
import { IUserRequest } from '../models/User';

/**
 * @Description add room 
 * @Route /api/rooms
 * @Method POST
 */
export const addRoom = asyncHandler(async (req: IUserRequest, res: Response) => {
    req.body.user = req.user._id;
    const room = await Room.create(req.body);
    res.status(201).json(room);
})

/**
 * @Description get all rooms
 * @Route /api/rooms
 * @Method GET
 */
export const getAll = asyncHandler(async(req: Request, res: Response) =>{
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        $or: [
            {name: {$regex: req.query.keyword, $options: "i"}},
            {description: {$regex: req.query.keyword, $options: "i"}}
        ]
    }
    :{};

    const numOfBeds = req.query.numOfBeds ? {numOfBeds: req.query.numOfBeds} : {};

    const category = req.query.category ? {category: req.query.category} : {};

    const count = await Room.countDocuments({ ...keyword, ...numOfBeds, ...category });

    const rooms = await Room.find({...keyword, ...category, ...numOfBeds}).limit(pageSize)
                            .skip(pageSize * (page - 1));

    res.status(200).json({
        rooms,
        page,
        pages: Math.ceil(rooms.length / pageSize),
        count
    });
})

/**
 * @Description search rooms
 * @Route /api/rooms/search/
 * @Method GET
 */
export const searchRooms = asyncHandler(async(req: Request, res: Response) =>{
    const filterd = await Room.find({ $and: [
        {$or: [{name: req.query.keyword}, {description: req.query.keyword}]},
        {numOfBeds:req.query.numOfBeds},
        {category: req.query.roomType}
    ]});
    res.status(200).json(filterd);
});

/**
 * @Description get single room
 * @Route /api/rooms/:id
 * @Method GET
 */
export const getSingle = asyncHandler(async(req: Request, res: Response) => {
    const room = await Room.findById(req.params.id);
    if (!room) {
        res.status(401);
        throw new Error("Room not found");
    }
    res.status(201).json(room);
});

/**
 * @Description update room
 * @Route /api/rooms/:id
 * @Method PUT
 */
export const updateRoom = asyncHandler(async (req: IUserRequest, res: Response) => {
    let room = await Room.findById(req.params.id);
    if(!room) {
        res.status(401);
        throw new Error("Room not found");
    }
    room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(room);

})

/**
 * @Description Delete room
 * @Route /api/rooms/:id
 * @Method DELETE
 */
export const deleteRoom = asyncHandler(async (req: IUserRequest, res: Response) => {
    let room = await Room.findById(req.params.id);
    if(!room) {
        res.status(401);
        throw new Error("Room not found");
    }
    room = await Room.findByIdAndDelete(req.params.id);
    res.status(201).json({});
})

/**
 * @Description Create Room Review
 * @Route /api/rooms/:id/reviews
 * @Method POST
 */
export const createRoomReview = asyncHandler(async (req: IUserRequest, res: Response) => {
    const room = await Room.findById(req.params.id);
    if(room){
        const alreadyReviewd = room.reviews?.find(review => review.user.toString() === req.user._id.toString());
        if(alreadyReviewd) {
            res.status(401);
            throw new Error("Already reviewed");
        }
        const { rating, comment } = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }
        room.reviews?.push(review);
        room.numOfReviews = room.reviews?.length;
        room.ratings = room.reviews?.reduce((acc: any, item: any) => item?.rating + acc, 0) / Number(room.reviews?.length);
        await room.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(401);
        throw new Error("Room not found");
    }
});