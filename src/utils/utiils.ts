import { Response } from 'express';
import mongoose from 'mongoose'
import jwt, { SignOptions} from 'jsonwebtoken'
import { CustomJwtPayload } from '../types/inventory';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h'


export const generateToken = (payload: CustomJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions)
}

export const verifyToken = (token: string): CustomJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as CustomJwtPayload
}

// Reusable error handler
 export const handleError = (res: Response, error: unknown, statusCode = 500): void => {
  const errorMessage = error instanceof Error ? error.message : 'Server error'
  res.status(statusCode).json({ message: errorMessage })
}

// Validate MongoDB ObjectId
 export const isValidObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid user ID format' })
    return false
  }
  return true
}


// export const getUserPermissions = async (user: IUser): Promise<string[]