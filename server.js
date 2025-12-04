const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// /hello  → 200 OK
// -------------------------------
app.get("/hello", (req, res) => {
    res.status(200).send("Hello");
});

// -------------------------------
// /admin  → with status codes
// -------------------------------
app.post("/admin", (req, res) => {
    const secret = req.headers["x-secret-key"];

    // 401 Unauthorized
    if (secret !== "admin123") {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized: Wrong secret key"
        });
    }

    // 400 Bad Request (body missing)
    if (!req.body || !req.body.userId || !req.body.name) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request: Required fields missing"
        });
    }

    try {
        let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

        // Add new user
        users.push(req.body);

        fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

        // 201 Created
        res.status(201).json({
            status: 201,
            message: "User created successfully",
            newUser: req.body
        });
    } catch (err) {
        // 500 Internal Server Error
        res.status(500).json({
            status: 500,
            message: "Server error while saving user"
        });
    }
});

// ------------------------------------
// 404 Not Found (fallback route)
// ------------------------------------
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Route not found"
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
