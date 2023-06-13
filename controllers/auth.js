const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { v4: uuidv4 } = require('uuid');

const { User } = require("../models/user");

const { HttpError, cntrlWrapper, sendEmail } = require("../helpers");

const {SECRET_KEY, BASE_URL} = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "User is already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const newUser = await User.create({ ...req.body, 
    password: hashPassword, 
    avatarURL, 
    verificationToken});
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if(!user){
      throw HttpError(401, "User not found")
    }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});
  res.json({
    message: "Verification email sent"
  })
}

const resendVerifyEmail = async(req, res)=> {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) {
      throw HttpError(404, "User not found");
  }
  if(user.verify) {
      throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.json({
      message: "Verification successful"
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify){
    throw HttpError(401, "Email not verified")
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  console.log(res.user);
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
};

const updateAvatar = async (req, res) => {
  const { _id: userId } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const avatarName = `${userId}_${originalname}`;
  const resultUpload = path.join(avatarDir, avatarName);

  Jimp.read(tempUpload, (error, image) => {
    if (error) throw error;
    image.resize(250, 250).quality(100).write(resultUpload);
  });
  fs.unlink(tempUpload);

  const avatar = `avatars/${avatarName}`;

  await User.findByIdAndUpdate(userId, { avatarURL: avatar });

  res.status(200).json({
    avatarURL: avatar,
  });
};

module.exports = {
  register: cntrlWrapper(register),
  login: cntrlWrapper(login),
  getCurrent: cntrlWrapper(getCurrent),
  logout: cntrlWrapper(logout),
  updateAvatar: cntrlWrapper(updateAvatar),
  verifyEmail: cntrlWrapper(verifyEmail),
  resendVerifyEmail: cntrlWrapper(resendVerifyEmail),
};
