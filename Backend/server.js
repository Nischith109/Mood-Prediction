const express = require("express");
const cors = require("cors");
const moodRoutes = require("./routes/mood");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/mood", moodRoutes);
require("./db");
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   
});