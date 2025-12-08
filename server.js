const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User"); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/userdb")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB error:", err.message));


app.get("/hello", (req, res) => {
    res.status(200).send("Hello");
});


app.post("/admin", async (req, res) => {
    const secret = req.headers["x-secret-key"];

   
    if (secret !== "admin123") {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized: Wrong secret key"
        });
    }

 
    if (!req.body || !req.body.userId || !req.body.name) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request: Missing userId or name"
        });
    }

    try {
        
        const isExist = await User.findOne({ userId: req.body.userId });

        if (isExist) {
            return res.status(409).json({
                status: 409,
                message: "User already exists"
            });
        }

     
        const newUser = new User({
            userId: req.body.userId,
            name: req.body.name,
            role: req.body.role
        });

        await newUser.save();

        return res.status(201).json({
            status: 201,
            message: "User created successfully",
            newUser
        });

    } catch (err) {
        console.log("SERVER ERROR:", err.message);
        return res.status(500).json({
            status: 500,
            message: "Server error while saving user"
        });
    }
});


app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Route not found"
    });
});


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
