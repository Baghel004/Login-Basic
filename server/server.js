const connectMongo = require("./src/db/db");
const dotenv = require("dotenv")
const express = require("express")
const limiter = require("./src/middlewares/rateLimitter");
const path = require("path");
const authRoute = require("./src/routes/auth");

dotenv.config();

const app = express()

const port = process.env.PORT || 8080;

connectMongo();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(authRoute);


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../public/views"));

app.get("/", (req, res)=>{
    res.render("home");
})

app.get("/camera", (req, res)=>{
    res.render("camera");
})

app.use((req, res, next)=>{
    res.status(404).send("404 Page Not Found")
})

app.use((err, req, res, next)=>{
    res.status(500).send("Internal Server Error")
})


app.listen(port, ()=>{
    console.log(`your server is running on http://localhost:${port}`);
})