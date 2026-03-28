import Product from "../models/Product.js";
import Order from "../models/Order.js";

const addOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!productId || !quantity) {
      return res.status(400).json({ message: "ProductId and quantity are required" });
    }

    const qty = parseInt(quantity);

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (qty > product.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Reduce stock
    product.stock -= qty;
    await product.save();

    // Calculate price
    const totalPrice = product.price * qty;

    // Create order
    const order = new Order({
      customer: req.user._id,
      product: productId,
      quantity: qty,
      totalPrice: totalPrice,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getOrders = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    let orders;
    
    if (req.user?.role === "admin") {
       orders = await Order.find()
        .populate({
          path: "product",
          select: "name price categoryId",
          populate: {
            path: "categoryId",
            select: "categoryName"
          }
        })
        .populate("customer", "name email")
        .sort({ orderDate: -1 });

    } else {
     orders = await Order.find({ customer: req.user._id })
  .populate({
    path: "product",
    select: "name price categoryId",
    populate: {
      path: "categoryId",
      select: "categoryName"
    }
  })
  .sort({ orderDate: -1 });
}
  res.status(200).json({
  success: true,
  orders
});

  } catch (error) {

    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching orders"
    });

  }
};

export { addOrder,getOrders };