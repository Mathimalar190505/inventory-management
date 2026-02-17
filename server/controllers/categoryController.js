import Category from '../models/Category.js';
import mongoose from 'mongoose';

const addCategory = async(req,res) => {
    try{
        const {categoryName,categoryDescription} = req.body;

        const existingCategory = await Category.findOne({categoryName});
        if(existingCategory){
            return res.status(400).json({success:false,message:"Category already exists"});
        }

        const newCategory = new Category({
            categoryName,
            categoryDescription
        });
        await newCategory.save();
        res.status(201).json({success:true,message:"Category added successfully",category:newCategory});
    }
    catch(error){
        console.error("Error adding category:",error);
        res.status(500).json({success:false,message:"Server error"});
    }
}

const getCategories = async(req,res) => {
    try{
        const categories = await Category.find();
        res.status(200).json({success:true,categories});
    }
    catch(error){
        console.error("Error getting categories:",error);
        res.status(500).json({success:false,message:"Server error"});
    }
}

const updateCategory = async(req,res) => {
    try{
        const {id} = req.params;
        const {categoryName,categoryDescription} = req.body;

        const existingCategory = await Category.findOne({categoryName,_id:{$ne: id}});
        if(existingCategory){
            return res.status(400).json({success:false,message:"Category already exists"});
        }

        const updatedCategory = await Category.findByIdAndUpdate(id,{categoryName,categoryDescription},{new:true});
        return res.status(200).json({success:true,message:"Category updated successfully",category:updatedCategory});

    }
    catch(error){
        console.error("Error updating category:",error);
        res.status(500).json({success:false,message:"Server error"});
    }
}
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export {addCategory,getCategories,updateCategory,deleteCategory};