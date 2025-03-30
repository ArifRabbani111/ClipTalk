const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const csvParser = require("csv-parser");

const app = express();
const port = 8000; // Port for our server

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = "mongodb://localhost:27017"; // Connects to local MongoDB
const client = new MongoClient(uri);

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log("Connected to MongoDB successfully!");

    // Create or connect to the 'MovieInventory' database
    const db = client.db("MovieInventory");
    
    // Create or connect to the 'movies' collection
    const movieCollection = db.collection("movies");
    
    console.log("Database 'MovieInventory' and Collection 'movies' are ready!");

    // Insert data from CSV file into the MongoDB collection
    insertCSVData(movieCollection);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Function to insert CSV data
function insertCSVData(movieCollection) {
  const movies = []; // Array to hold CSV data
  fs.createReadStream('netflix_titles.csv') // CSV file in the same folder as the server
    .pipe(csvParser()) // Parse CSV data
    .on('data', (row) => {
      movies.push(row); // Add each row to the array
    })
    .on('end', async () => {
      try {
        if (movies.length > 0) {
          // Insert the data into the MongoDB collection
          await movieCollection.insertMany(movies);
          console.log(`${movies.length} movies added to the 'movies' collection.`);
        } else {
          console.log("No data found in CSV file.");
        }
      } catch (error) {
        console.error("Error inserting CSV data into MongoDB:", error);
      }
    });
}

// Routes

// GET route to fetch all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await movieCollection.find().toArray(); // Fetch all movies
    res.json(movies); // Return as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// POST route to insert a new movie
app.post("/movies", async (req, res) => {
  try {
    const movie = req.body; // Get movie data from the request body
    await movieCollection.insertOne(movie); // Insert movie into collection
    res.status(201).json({ message: "Movie added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// PUT route to update a movie
app.put("/movies/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const updatedMovie = req.body;
    await movieCollection.updateOne(
      { _id: new MongoClient.ObjectId(movieId) },
      { $set: updatedMovie }
    );
    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// DELETE route to delete a movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    await movieCollection.deleteOne({ _id: new MongoClient.ObjectId(movieId) });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

