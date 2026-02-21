import Supplier from '../models/Supplier.js'

const addSupplier = async(req,res) => {
    try{
        const {name,email,number,address} = req.body;

        const existingSupplier = await Supplier.findOne({name});
        if(existingSupplier){
            return res.status(400).json({success:false,message:"Supplier already exists"});
        }

        const newSupplier = new Supplier({
           name,
           email,
           number,
           address
        });
        await newSupplier.save();
        return res.status(201).json({success:true,message:"Supplier added successfully",supplier: newSupplier});
    }
    catch(error){
        console.error("Error adding supplier:",error);
        res.status(500).json({success:false,message:"Server error"});
    }
};
const getSuppliers = async(req,res) => {
    try{
        const suppliers = await Supplier.find();
        res.status(200).json({success:true,suppliers});
    }
    catch(error){
        console.error("Error getting suppliers:",error);
        res.status(500).json({success:false,message:"Server error in getting supplier"});
    }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number, address } = req.body;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { name, email, number, address },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({
      success: false,
      message: "Server error in updating supplier",
    });
  }
};

const deleteSupplier = async (req,res) => {
    try{
        const {id} = req.params;
        const existingSupplier = await Supplier.findById(id);
        if(!existingSupplier){
            return res.status(404).json({success:false,message:"Supplier not found "});
        }
        await Supplier.findByIdAndDelete(id);
        return res.status(200).json({success: true,message:"Supplier deleted successfully"});
    } catch(error){
        console.error("error deleting Supplier:",error);
        return res.status(500).json({success: false,message:"Server error"});
    }
}
export {addSupplier , getSuppliers ,updateSupplier ,deleteSupplier};