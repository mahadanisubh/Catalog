import Product from "../models/product.model.js";
import path from "path";
import cloudinary from "../images/cloudinary.js";
import fs from "fs"

export const createProduct = async (req, res) => {
  try {
    const { name, desc, keywords, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // 🔹 Normalize keywords (string OR array)
    let keywordsArr = keywords;
    if (typeof keywords === "string") {
      keywordsArr = keywords
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);
    }

    // 🔹 Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "localstorage",
      resource_type: "auto",
    });

    // 🔹 Create product in MongoDB
    const product = await Product.create({
      name,
      desc,
      keywords: keywordsArr,
      category,
      image: result.secure_url,
      createdBy: req.user._id,
    });

    // 🔹 Delete local file 
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("File delete error:", err);
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    console.error("createProduct ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};


export const getSearchProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.desc) {
      filter.desc = { $regex: req.query.desc, $options: "i" };
    }
    if (req.query.keywords) {
      filter.keywords = { $in: [req.query.keywords] };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate(
      "createdBy",
      "name email",
    );
    res.status(201).json({
      message: "Products fetched Successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

export const getUploadedProducts = async (req, res) => {
  try {
    const filter = {
      createdBy: req.user._id,
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter);

    res.status(200).json({
      message: "Uploaded products fetched",
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const uploadFile = async (req, res) =>{
 try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "localstorage",
      resource_type: "auto", 
    });

    // Save to MongoDB
    const savedFile = new File({
      url: result.secure_url,
    });
    await savedFile.save();

    res.status(201).json({
      message: "File uploaded & saved successfully",
      data: savedFile,
    });


    // Delete local file
    fs.unlink(req.file.path);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
  }
};