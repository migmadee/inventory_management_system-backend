import { Request, Response } from 'express';
import Product from '../models/product.model';
import { IProduct } from '../types/inventory';
import { handleError, isValidObjectId } from '../utils/utiils';

// Get all products
export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error);
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id, res)) return;

    const product = await Product.findById(id).lean();
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

// Create new product
export const createProduct = async (
  req: Request<{}, {}, IProduct>,
  res: Response
): Promise<void> => {
  try {
    const { name, description, sku, price, quantity } = req.body;

    if (!name || !sku || price == null || quantity == null) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const existingProduct = await Product.findOne({ sku }).lean();
    if (existingProduct) {
      res.status(400).json({ message: 'Product with this SKU already exists' });
      return;
    }

    const product = new Product({ name, description, sku, price, quantity });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    handleError(res, error);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, sku, price, quantity } = req.body;

    if (!isValidObjectId(id, res)) return;

    const updateFields: Partial<IProduct> = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (sku) updateFields.sku = sku;
    if (price != null) updateFields.price = price;
    if (quantity != null) updateFields.quantity = quantity;

    if (sku) {
      const existingProduct = await Product.findOne({ sku, _id: { $ne: id } }).lean();
      if (existingProduct) {
        res.status(400).json({ message: 'Another product with this SKU already exists' });
        return;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id, res)) return;

    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
