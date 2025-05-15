import { Request, Response } from 'express';
import Category from '../models/category.model'; // Adjust path if needed
import { ICategory } from '../types/inventory';
import { handleError, isValidObjectId } from '../utils/utiils';

// Get all categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    handleError(res, error);
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id, res)) return;

    const category = await Category.findById(id).lean();
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    handleError(res, error);
  }
};

// Create new category
export const createCategory = async (
  req: Request<{}, {},ICategory>,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }


    const category = new Category({ name, description });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    handleError(res, error);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(id, res)) return;

    const updateFields: Partial<ICategory> = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    // Check for name conflict
    if (name) {
      const existing = await Category.findOne({ name, _id: { $ne: id } }).lean();
      if (existing) {
        res.status(400).json({ message: 'Category name already in use' });
        return;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id, res)) return;

    const deleted = await Category.findByIdAndDelete(id).lean();
    if (!deleted) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
