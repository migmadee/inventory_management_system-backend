import { Request, Response } from 'express';
import Supplier from '../models/supplier.model'; // Adjust path as necessary
import { ISupplier } from '../types/inventory';
import { handleError, isValidObjectId } from '../utils/utiils';

// Get all suppliers
export const getSuppliers = async (_req: Request, res: Response): Promise<void> => {
  try {
    
    const suppliers = await Supplier.find().lean();
    res.status(200).json(suppliers);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a supplier by ID
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id, res)) return;

    const supplier = await Supplier.findById(id).lean();
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    res.status(200).json(supplier);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new supplier
export const createSupplier = async (
  req: Request<{}, {}, ISupplier>,
  res: Response
): Promise<void> => {
  try {
    
    const { name, contactInfo, address } = req.body;

    if (!name || !contactInfo || !address) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const supplier = new Supplier({ name, contactInfo, address });
    const savedSupplier = await supplier.save();

    res.status(201).json(savedSupplier);
  } catch (error) {
    handleError(res, error);
  }
};

// Update a supplier
export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, contactInfo, address } = req.body;

    if (!isValidObjectId(id, res)) return;

    const updateFields: Partial<ISupplier> = {};
    if (name) updateFields.name = name;
    if (contactInfo) updateFields.contactInfo = contactInfo;
    if (address) updateFields.address = address;

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedSupplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a supplier
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id, res)) return;

    const deletedSupplier = await Supplier.findByIdAndDelete(id).lean();

    if (!deletedSupplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
