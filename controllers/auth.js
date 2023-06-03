const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs");

const { User } = require("../models/user");

const { HttpError, cntrlWrapper } = require("../helpers");

const {SECRET_KEY} = process.env;

const avatarsDir = path.join(__dirname, "../", "public", )

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "User is already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL});
  res.status(201).json({
    user: {
      email: newUser.email,
      password: newUser.password,
    }
  });
};

const login = async (req, res) => {
  const { email, password} = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
   
  await User.findByIdAndUpdate(user._id, {token})
  res.json({
    token, 
    user: {
      email,
      subscription: user.subscription,
    }  
  });
 
};

const getCurrent = async (req, res) => {
  const {email, subscription} = req.user;
  console.log(res.user);
  res.json({
    email, 
    subscription,
  })
}

const logout = async (req, res) => {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});

  res.json({
    message: "Logout success"
  })
}

const updateAvatar = async (req, res) => {
    const {path: tempUpload, originalname} = req.user;
    const resultUpload = path.join(avatarsDir, originalname);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", originalname);
    await User.findByIdAndUpdate(_id, {avatarURL});
    res.json({
        avatarURL,
    })
}

module.exports = {
  register: cntrlWrapper(register),
  login: cntrlWrapper(login),
  getCurrent: cntrlWrapper(getCurrent),
  logout: cntrlWrapper(logout),
  updateAvatar: cntrlWrapper(updateAvatar)
};