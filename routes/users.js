const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    // TODO: Return url doesn't work 
    // passport overwrites the session
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout(()=>{});
  req.flash("success", "Successfully logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;
