import { Request, Response } from 'express';
import Purchase from '../models/purchase.model';
import { IPurchase } from '../types/inventory';
import { handleError, isValidObjectId } from '../utils/utiils';

// Get all purchases
export const getPurchases = async (_req: Request, res: Response): Promise<void> => {
  try {
    const purchases = await Purchase.find().populate('supplier').lean();
    res.status(200).json(purchases);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a purchase by ID
export const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id, res)) return;

    const purchase = await Purchase.findById(id).populate('supplier').lean();
    if (!purchase) {
      res.status(404).json({ message: 'Purchase not found' });
      return;
    }

    res.status(200).json(purchase);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new purchase
export const createPurchase = async (
  req: Request<{}, {}, IPurchase>,
  res: Response
): Promise<void> => {
  try {
    const { supplier } = req.body;

    if (!supplier ) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const purchase = new Purchase({ supplier });
    const savedPurchase = await purchase.save();

    res.status(201).json({
       data: savedPurchase
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a purchase
export const updatePurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supplier, date, totalAmount, status } = req.body;

    if (!isValidObjectId(id, res)) return;

    const updateFields: Partial<IPurchase> = {};
    if (supplier) updateFields.supplier = supplier;
    if (date) updateFields.date = date;
    if (totalAmount != null) updateFields.totalAmount = totalAmount;
    if (status) updateFields.status = status;

    const updatedPurchase = await Purchase.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedPurchase) {
      res.status(404).json({ message: 'Purchase not found' });
      return;
    }

    res.status(200).json(updatedPurchase);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a purchase
export const deletePurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id, res)) return;

    const deletedPurchase = await Purchase.findByIdAndDelete(id).lean();
    if (!deletedPurchase) {
      res.status(404).json({ message: 'Purchase not found' });
      return;
    }

    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
