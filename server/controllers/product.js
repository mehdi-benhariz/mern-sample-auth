const Product = require("../models/Product");
const path = require("path");
const { getUserByToken } = require("../utils/auth");
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: "there was some error" });
  }
};
//add a new product
exports.addProduct = async (req, res) => {
  const { name, price, description, quantityStock } = req.body.newProduct;
  if (!name || !price || !description || !quantityStock)
    return res.status(400).json({ error: "all fields are required required" });

  try {
    const newProduct = new Product(req.body.newProduct);
    await newProduct.save();

    return res.status(200).json({ success: true, newProduct });
  } catch (error) {
    console.log("err:", error);
    return res.status(500).json({ error: "internal errors" });
  }
};
//delete a product
exports.removeProduct = async (req, res) => {
  const { pId } = req.body;
  console.log(pId);
  if (!pId) return res.status(400).json({ error: "ID is required" });

  try {
    const removed = await Product.findByIdAndRemove(pId);
    if (!removed) return res.status(200).json({ success: true });
    else return res.status(404).json({ error: "product doesn't exist" });
  } catch (err) {
    res.status(500).json({ error: "the was internal error" });
  }
};
//get one product by Id
exports.getProduct = async (req, res) => {
  const { pId } = req.body;

  if (!pId) return res.status(400).json({ error: "ID is required" });

  try {
    const product = await Product.findById(pId);
    if (!product) return res.status(404).json({ error: "not found" });
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "the was internal error" });
  }
};
//update a product
exports.updateProduct = async (req, res) => {
  const { pId, editProduct } = req.body;

  if (!pId) return res.status(400).json({ error: "ID is required" });

  if (!editProduct)
    return res.status(400).json({ error: "new product is required" });

  try {
    const updated = await Product.findByIdAndUpdate(pId, editProduct, {
      new: true,
    });
    if (!updated) return res.status(500).json({ error: "couldn't update !" });
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "the was internal error" });
  }
};
//detailed search
exports.search = async (req, res) => {
  const { search } = req.body;
  console.log(req.body);
  const regex = search ? new RegExp(search) : null;

  if (regex !== null)
    try {
      console.log(search);
      const result = await Product.find({ name: regex });
      console.log(result);
      return res.status(200).json(result);
    } catch (err) {
      res.status(500).json("there was an error!");
      console.log(err);
    }
};
//get by category
exports.getByCategory = async (req, res) => {
  const { cId } = req.params;
  try {
    const result = await Product.find({ tags: cId });
    if (result.length > 0) return res.status(200).json(result);
    return res.status(400).json({ message: "no product was found!" });
  } catch (err) {
    res.status(500).json("there was an error!");
    console.log(err);
  }
};

//upload image
exports.uploadImage = async (req, res, next) => {
  console.log("");
  const { pId } = req.params;
  const product = await Product.findById(pId);
  console.log(product);

  try {
    // file upload handler
    if (req.files === null)
      return res.status(400).json({ message: "No file uploaded" });

    const file = req.files.file;
    const regex = /^image\/(png|jpg|jpeg)$/;
    console.log(file);
    if (!regex.test(file.mimetype))
      return res
        .status(400)
        .json({ message: "File type should be png, jpg, or jpeg" });
    const err = await file.mv(
      path.join(__dirname, "..", "public", "product_images", file.name)
    );

    const newProduct = await product.save();
    res.json({ product: newProduct });

    // end file upload handler
  } catch (error) {
    next(error);
  }
};

//
exports.addToPannel = async (req, res) => {
  const { token } = req.cookies;
  const { pId } = req.body;
  let exist = false;
  try {
    const user = await getUserByToken(token);
    console.log(user);
    let data = user.pannelProducts;
    if (!data) return res.status(400).json({ error: "ID is required" });
    data.forEach((e) => {
      if (e["product"]._id === pId) {
        exist = true;
        return res.status(200).json("already in pannel!");
      }
    });
    const prod = await Product.findById(pId);
    console.log({ prod });
    data.push({ product: prod, quantity: 0 });
    const resp = await User.updateOne(
      { _id: user._id },
      { $set: { pannelProducts: data } }
    );

    return res.status(200).json(resp["ok"]);
  } catch (error) {
    console.log("err:", error);
    return res.status(500).json({ error: "internal errors" });
  }
};
