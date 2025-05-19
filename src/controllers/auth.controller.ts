import { Request,Response } from "express"
import User from '../models/user.model'
import bcrypt from 'bcrypt'
import {generateToken, handleError, isValidObjectId} from '../utils/utiils'
import { IUser } from "../types/inventory"

export const register = async (req: Request,res:Response): Promise<void> =>{
    try {
        const {name,email,password,role} =req.body
        if(!name || !email ||  !password){
            res.status(400).json({message: 'All fields required'})
            return
        }
        const existing = await User.findOne ({email})
        if(existing){
            res.status(400).json({message: 'Email already exists'})
            return
        }
        const passwordHash = await bcrypt  .hash(password,10)

        const user =await User.create ({name, email, role , passwordHash})
        const token = generateToken({
            userId:user._id.toString(),
            email:user.email,
            role:user.role,
        })
        res
        .status(201)
        .json({user: {id:user._id, name,email,role:user.role},
        token})
    }catch (error){
        res
        .status(500)
        .json({message: 'Resgistration failed',error:(error as Error).message})
    }
}
 export const login =async (req:Request,res:Response): Promise<void> =>{
    try {
        const {email,password} = req.body
        const user= await User.findOne({email })
        if(!user){
            res.status(401).json({message: 'Invalid email'})
            return
        }
        const isValid = await bcrypt.compare(password,user.passwordHash)
        if(!isValid){
            res.status(401).json({message: 'Invalid password'})
            return
        }
        const token =generateToken({
            userId:user._id.toString(),
            email:user.email,
            role: user.role,
        })
        res.json({message: 'Login successfully',token})

    }catch(error){
        res
        .status(400)
            .json({message: 'Login failed',
                error:(error as Error).message})
    }
}

export const getProfile= async(req:Request,res:Response): Promise<void> =>{
        try{
        if(!req.user){
            res.status(401).json({success: false, message:'Unauthorized'})
            return
        }
        const userObj= req.user.toObject?.()?? req.user
        const {passwordHash,...safeUser} =userObj

        res.status(200).json({success:true, data:safeUser,message: `Welcome back,${safeUser.name}`})
    }catch (error){
        
        console.error('Error in user auth route:',error)
        res.status(500)
        .json({message: 'Error fetching user',error:(error as Error).message})
    }
}
// Update user
 export const updateUser =  async (req:Request,res:Response): Promise<void> => {
    try {
        const {id} = req.params
        const{name,email,password} = req.body
console.log(id)

        if(!isValidObjectId(id,res)) return
        // Ensure at least one update field is provide
        if(!name && !email && !password){
            res.status(400).json({message: 'No update field provided'})
            return
        }
    // Build update object dynamically
    const updateData: Partial<IUser> = {}
        if(name)updateData.name =name
        if(email) updateData.email = email
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10)
        // If email is being updateDate,check for duplicates
        if(email){
            const emailExists = await User.findOne({
                email,
                _id:{$ne:id},

            })
            .select('_id')
            .lean()
            if(emailExists){
                res.status(400).json({message:'Email already in use'})
                return
            }
        }
        const updateUser= await User.findByIdAndUpdate(id,updateData,{
            new:true,
            runValidators:true,
        })
        .select('-passwordHash')
        .lean()

        if(!updateUser){
            res.status(404).json({message:'User not found'})
            return
        }
        res.status(200).json(updateUser)
    }catch(error){
        handleError(res,error)
    }
 }