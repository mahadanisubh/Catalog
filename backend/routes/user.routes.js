import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller.js";
import { createProduct, getSearchProducts, getUploadedProducts } from "../controllers/product.controller.js";
import { protect, isAdmin } from "../middlewares/middleware.js";
import { upload } from "../middlewares/middleware.js";

const router = Router();

router.post("/createuser",createUser);
router.post("/login",loginUser);
router.post("/createproduct",protect,isAdmin,upload.single("image"),createProduct);
router.get("/getproducts",getSearchProducts);
router.get("/getuploadedproducts",protect,isAdmin,getUploadedProducts);

export default router;