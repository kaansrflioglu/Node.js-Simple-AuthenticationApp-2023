const { model } = require('mongoose');
const formValidation = require('../validation/formValidation');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const usernameError = [];
 
require('../authentication/local');

module.exports.getUserLogin = (req, res, next) => {
    res.render("./pages/login");
};

module.exports.getUserLogout = (req, res, next) => {
  req.logout((err) => { if (err) { console.log("Logout Error:", err); }
    req.flash("success", "Successfully Logout");
    res.redirect('/login');
  });
};

module.exports.getUserRegister = (req, res, next) => {
    res.render("./pages/register");
};

module.exports.postUserLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true
    })(req, res, next);
};

module.exports.postUserRegister = async (req, res, next) => {
    const { username, password } = req.body; // Form verilerini almak için "req.body" üzerinden username ve password değerlerini alıyoruz
    const validationErrors = formValidation.registerValidation(username, password);
  
    if (validationErrors.length > 0) {
      return res.render("pages/register", {
        username: username,
        password: password,
        errors: validationErrors,
      });
    }
  
    try {
      const existingUser = await UserModel.findOne({ username });
  
      if (existingUser) {
        const usernameError = [{ message: "Username Already In Use" }];
        return res.render("pages/register", {
          username: username,
          password: password,
          errors: usernameError,
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const newUser = new UserModel({
        username: username,
        password: hash,
      });
  
      await newUser.save();
  
      console.log("Successful");
      req.flash("flashSuccess", "Successfully Registered");
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred during registration.");
    }
  };
  