import { Router } from "express";
import * as rh from "./reqhandler.js"
const router=Router();  
router.route("/adddata").post(rh.adduser);
router.route("/login").post(rh.loginUser);
router.route("/additem").post(rh.Additem);
router.route("/getproducts").get(rh.getAllItems);








export default router;