import { handleError } from "../utils/utiils"
import bcrypt from 'bcrypt'
import { Request, Response } from "express"
import User from '../models/user.model'
import { isValidObjectId } from "../utils/utiils"
import { IUser } from "../types/inventory"
//Create a  new user
export const createUser = async (
    req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, role, password } = req.body
            const existingUser = await User.findOne({ email }).select('_id').lean()
            if (existingUser) {
                res.status(409).json({ message: 'Email already exists' })
                return
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = await User.create({ name, email, role, passwordHash })
            res.status(201).json({
                messageg: 'User created successfully',
                user: newUser,
            })
        } catch (error) {
            handleError(res, error)
        }
    }

    // Get user by ID
export const getUserById = async ( req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return
    const user = await User.findById(id).select('-password').lean()
    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }
    res.status(200).json(user) 
}catch (error) {
    handleError(res, error)
  }
}

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, email } = req.body
    if (!isValidObjectId(id, res)) return

    if (!name && !email) {
      res.status(400).json({ message: 'No update fields provided' })
      return
    }

        //Build update object dynamically
    const updateData: Partial<IUser> = {} // partial means we're updating few fields only
    if (name) updateData.name = name
    if (email) updateData.email = email

        // if email is being updated, check for duplicates
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: id },
      })
        .select('_id')
        .lean()
      if (emailExists) {
        res.status(400).json({ message: 'Email already in use' })
        return
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .lean()

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    handleError(res, error)
  }
}