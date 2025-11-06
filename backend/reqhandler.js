import userschema from "./models/userschema.js";
import productsschema from "./models/productsschema.js";
import bcrypt from "bcrypt"

export const adduser = async (req, res) => {

    const { name, email, password, role } = req.body;

  try {

    const existingUser = await userschema.findOne({ email });
    if (existingUser) {
      return res.status(400).send("user alredy exist")
    }
    const hpass=await bcrypt.hash(password,10)

    const newUser = new userschema({ name, email, password:hpass, role });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const loginUser = async (req, res) => {

    const { email, password } = req.body;

  try {

    const user = await userschema.findOne({ email });
    if (!user) {
      return res.status(404).send("user not found");
    }
    const checkpass=await bcrypt.compare(password,user.password)
    if(!checkpass){
      return res.status(404).send("wrong password");
      
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: error.message });
  }
};


export const Additem = async (req, res) => {
  try {
    console.log("haii");
    
    console.log(req.body);
    const { name, price, category, image, description } = req.body;

    const newItem = new productsschema({
      name,
      price,
      category,
      image,
      description,
    });

    await newItem.save();

    res.status(200).json({
      message: "Item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({
      message: "Error adding item",
      error: error.message,
    });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await productsschema.find(); 
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      message: "Error fetching items",
      error: error.message,
    });
  }
};
