import { getUserPermissions } from './../utils/utiils';
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/utiils";
import User from '../models/user.model'

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }
        const decoded = verifyToken(token)
        const user = await User.findById(decoded.userId) //from here we are getting userId
        
        if (!user) {
            res.status(401).json({ message: 'User not found' })
            return
        }
        req.user = user
        req.userId = user._id.toString()
        next() // if its valid it will process to next
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: (error as Error).message})
        return
    }}
    export const authorize = (
        requiredRoles: string[] = [],
    ) => {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
           try {
            if (!req.user) {
                res.status(401).json({ message:'Unauthorized: User not found' })
                return
            }
            const UserPermissions = await getUserPermissions(req.user)
            const hasAccess = requiredRoles.some((role) => UserPermissions.includes(role))

            if (!hasAccess) {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
                return
            }
            next()
           } catch (error) {
            res.status(401).json({ message: 'Invalid permissions', error: (error as Error).message })
           }
        }
    }
