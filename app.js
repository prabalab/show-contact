const express = require("express");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route to display data
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    res.render("index", { contacts: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
