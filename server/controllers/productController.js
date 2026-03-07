import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";


// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .populate("categoryId", "categoryName")
      .populate("supplierId", "name")
      .sort({ createdAt: -1 });

    const categories = await Category.find().sort({ categoryName: 1 });

    const suppliers = await Supplier.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      products,
      categories,
      suppliers
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};


// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {

    const { name, description, price, stock, categoryId, supplierId } = req.body;

    if (!name || !price || !stock || !categoryId || !supplierId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product"
    });
  }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, description, price, stock, categoryId, supplierId } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        categoryId,
        supplierId
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update product"
    });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
};