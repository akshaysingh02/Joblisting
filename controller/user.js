const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

const registerUser = async (req, res,next) => {
  try {
    const { name, password, email, mobile } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    let formattedEmail = email.toLowerCase();

    const isExistingUser = await User.findOne({ email: formattedEmail });
    if (isExistingUser) {
      return res.status(409).json({ errorMessage: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      email: formattedEmail,
      password: hashedPassword,
      mobile,
    });
    await userData.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    next(error)
  }
};

const loginUser = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    //check if the user is in the database or not
    const userDetails = await User.findOne({ email: email });
    if (!userDetails) {
      return res.status(409).json({ errorMessage: "User doesn't exist" });
    }

    //compare the password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userDetails.password
    );
    if (!isPasswordMatched) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    // JWT (javascript web token)
    var token = jwt.sign(
      { userId: userDetails._id },
      process.env.SECRET_KEY,
      { expiresIn: "60h" }
    );

    res.json({
      message: "User logged in",
      token: token,
      userId: userDetails._id,
      name: userDetails.name,
    });
  } catch (error) {
    next(error)
  }
};


module.exports = {
  registerUser,
  loginUser,
};
