const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User"); 

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://sanjanpoojary36_db_user:KeuKH9dNld8F1vm4@cluster0.e7v3lij.mongodb.net/userdb?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err.message));


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
        
        const existingUser = await User.findOne({ userId: req.body.userId });

        if (existingUser) {
            return res.status(409).json({
                status: 409,
                message: "User already exists"
            });
        }

      
        const newUser = new User({
            userId: req.body.userId,
            name: req.body.name,
            role: req.body.role || "user"
        });

        await newUser.save();  // SAVE TO MONGODB

        return res.status(201).json({
            status: 201,
            message: "User created successfully",
            data: newUser
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
