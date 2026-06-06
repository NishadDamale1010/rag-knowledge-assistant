require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://rag-knowledge-assistant-omega.vercel.app",
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./src/config/db");
connectDB();

const documentRoutes = require("./src/routes/documentRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
    res.send("Working fine");
});

app.use((req, res) => {
    res.status(404).json({ message: "Page Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
