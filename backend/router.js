import { Router } from "express";
import * as rh from "./reqhandler.js";
import Auth from "./middleware/auth.js";

const router = Router();

router.post("/register", rh.register);
router.post("/login", rh.login);

router.post("/email", rh.verifyemail);
router.post("/otp", rh.verifyotp);

router.post("/addproduct", rh.addProduct);
router.get("/products", rh.getProducts);

router.post("/addtocart", rh.addToCart);
router.get("/cart/:userId", rh.getCart);
router.post("/removefromcart", rh.removeFromCart);

router.get("/users", rh.getUsers);

router.post("/placeorder", rh.placeOrder);
router.get("/orders/:userId", rh.getOrders); 
router.get("/orders", rh.getAllOrders);      

router.get("/getprofile", Auth, rh.getProfile);

export default router;