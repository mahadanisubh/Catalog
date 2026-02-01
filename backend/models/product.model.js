import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "desc": {
        type: String,
    },
    "keywords": [String],
    "createdBy": {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    "viewCount": {
        type: Number,
        default: 0
    },
    "image": {
       type: String,
       required: true
    },
    "category": {
        type: String,
        enum: ["fashion", "grocery", "electronics", "beauty"]
    }
},  {
        timestamps: true
    });

const Product = mongoose.model("Product",productSchema);

export default Product;