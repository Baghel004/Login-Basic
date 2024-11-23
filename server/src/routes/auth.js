const authRoute = require("express").Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const generateToken = require("../utils/jwtToken");
const validateUser = require("../zod/user");
const userModel = require("../models/user");
const transport = require("../utils/mail");

dotenv.config();

authRoute.get("/register", (req, res) => {
  res.render("register", { error: null });
});

authRoute.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const validateData = validateUser({ email, password });

    if (validateData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      const user = new userModel({ email, password: hashedPass });

      const result = await user.save();

      if (result) {
        tokenData = {
          email: email,
        };

        token = generateToken(tokenData, process.env.SECRET_KEY, "1h");
        res.cookie("token", token);
        const mailData = {
          from: process.env.EMAIL,
          to: email,
          subject: "Welcome to our website",
          text: "Welcome to our website",
        };

        transport.sendMail(mailData, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("email sent");
          }
        });
        return res.redirect("/done");
      } else {
        res.send({ status: false, message: "Could not register user" });
      }
    } else {
      res.send({ status: false, message: "Invalid data" });
    }
  } catch (error) {
    if (error.code === 11000) {
      {
        res.render("register", { error: "Email already exists" });
        res.send({ status: false, message: "Email already exists" });
      }
    } else {
      res.render("register", { error: "Invalid data" });
      console.log("Error:", error);
    }
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const validateData = validateUser({ email, password });
    if (validateData) {
      const user = await userModel.findOne({ email: email });
      if (user) {
        const compare = await bcrypt.compare(password, user.password);

        if (compare) {
          tokenData = {
            email: email,
          };
          token = generateToken(tokenData, process.env.SECRET_KEY, "1h");
          res.cookie("token", token);
          return res.redirect("/done");
        } else {
          res.send({ status: false, message: "Invalid password" });
        }
      } else {
        res.send({ status: false, message: "User not found" });
      }
    } else {
      res.send({ status: false, message: "Invalid data" });
    }
  } catch (error) {}
});

authRoute.get("/login", (req, res) => {
  res.render("login", { error: null });
});

authRoute.get("/done", (req, res) => {
  res.render("lol");
});

module.exports = authRoute;
