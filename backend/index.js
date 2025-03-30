const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");
const csvParser = require("csv-parser");
const axios = require("axios");

const app = express();
const port = 8000; // Port for our server

// Middleware
app.use(cors());
app.use(express.json());


// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "", 
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL successfully!");

  // Check if the MovieInventory database exists and create it if not
  connection.query(
    "CREATE DATABASE IF NOT EXISTS MovieInventory",
    (err, result) => {
      if (err) {
        console.error("Error creating database: ", err);
        return;
      }
      console.log("Database 'MovieInventory' checked/created!");

      // Switch to MovieInventory database
      connection.query("USE MovieInventory", (err) => {
        if (err) {
          console.error("Error selecting database: ", err);
          return;
        }
        console.log("Using database 'MovieInventory'");

        // Check if the 'movies' table exists and create it if not
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          show_id VARCHAR(255),
          type VARCHAR(255),
          title VARCHAR(255),
          director VARCHAR(255),
          cast TEXT,
          country VARCHAR(255),
          date_added DATE,
          release_year YEAR,
          rating VARCHAR(255),
          duration VARCHAR(255),
          listed_in TEXT,
          description TEXT
        )
      `;
        connection.query(createTableQuery, (err, result) => {
          if (err) {
            console.error("Error creating table: ", err);
            return;
          }
          console.log("Table 'movies' checked/created!");

          // Insert CSV data after the database and table are created
          insertCSVData();
        });
      });
    }
  );
});

// Function to insert CSV data into MySQL
function insertCSVData() {
  const movies = [];
  fs.createReadStream("netflix_titles.csv") // CSV file in the same folder as the server
    .pipe(csvParser())
    .on("data", (row) => {
      movies.push(row); // Push each row into the array
    })
    .on("end", async () => {
      try {
        if (movies.length > 0) {
          // Insert data into the MySQL database
          movies.forEach((movie) => {
            const query = `INSERT INTO movies (show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            connection.query(
              query,
              [
                movie.show_id,
                movie.type,
                movie.title,
                movie.director,
                movie.cast,
                movie.country,
                movie.date_added,
                movie.release_year,
                movie.rating,
                movie.duration,
                movie.listed_in,
                movie.description,
              ],
              (err, result) => {
                if (err) {
                  console.error("Error inserting movie into MySQL:", err);
                } else {
                  // console.log("Movie inserted:", result.insertId);
                }
              }
            );
          });
        } else {
          console.log("No data found in CSV file.");
        }
      } catch (error) {
        console.error("Error inserting CSV data into MySQL:", error);
      }
    });
}

// Routes

// GET route to fetch all movies
app.get("/movies", (req, res) => {
    const query = "SELECT * FROM movies"; // SQL query to get first 5 movies
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching movies:", err);
        return res.status(500).json({ error: "Failed to fetch movies" });
      }
      res.json(results); // Return the first five movies as JSON
    });
  });



// DELETE route to delete a movie
app.delete("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const query = `DELETE FROM movies WHERE id = ?`;

  connection.query(query, [movieId], (err, result) => {
    if (err) {
      console.error("Error deleting movie:", err);
      return res.status(500).json({ error: "Failed to delete movie" });
    }
    res.json({ message: "Movie deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
