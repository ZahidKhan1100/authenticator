const UserModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "default_secret";

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      res.status(409).send({ message: "Email Already exist" });
    } else {
      const user = new UserModel({
        name,
        email,
        password,
      });
      await user.save();
      const token = user.generateAuthToken();
      return res.status(201).send({ msg: "User added successfully", token });
    }
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
}

async function login(req, res) {
  const userId = req.userId;
  const { email, password } = req.body;
  if (getUser(userId)) {
    const emailExist = await UserModel.findOne({ email });
    if (!emailExist) {
      res.status(404).send({ message: "Email not exist" });
    } else {
      const passwordMatch = await bcrypt.compare(password, emailExist.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const token = jwt.sign({ _id: emailExist._id }, jwtSecret);
      return res.status(200).json({ message: "Login successful", token });
    }
  } else {
    res.status(500).send({ message: "User not exist" });
  }
}

async function getProfile(req, res) {
  const userId = req.userId;
  getUser(userId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.send({ message: error });
    });
}

async function getUser(userId) {
  const existUser = await UserModel.findById(userId).select("-password");
  return existUser;
}
module.exports = { signup, login, getProfile };
