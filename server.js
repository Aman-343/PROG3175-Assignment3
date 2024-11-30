const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const { type } = require('os');

const app = express();
const PORT = 8080;
require('dotenv').config();
const dbURL = process.env.DATABASE_URL;
console.log('Connecting to database:', process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const Greeting = sequelize.define('Greeting',{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  timeOfDay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  greetingMessage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tone: {
    type: DataTypes.STRING,
    allowNull: false,
  },},
  {
  tableName: 'Greetings',
  timestamps: false, // Disable createdAt and updatedAt fields

})

(async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync the model with the database
    await Greeting.sync();

    // Check if the table is empty
    const count = await Greeting.count();
    if (count === 0) {
      // Seed the database
      await Greeting.bulkCreate([
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good morning!', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Morning!', tone: 'Casual' },
        { timeOfDay: 'Morning', language: 'Sanskrit', greetingMessage: 'शुभमध्याह्नम्', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'Gujarati', greetingMessage: 'શુભ બપોર!', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'Gujarati', greetingMessage: 'સારી સાંજ!', tone: 'Formal' },
      ]);
      console.log('Database seeded successfully.');
    }
  } catch (err) {
    console.error('Error setting up database:', err);
  }
})();

app.use(express.json());

app.get('/languages', async(req, res) =>{
  try {
    // Assuming you have a Greetings model
    const languages = await Greeting.findAll({
      attributes: ['language'], // Select only the 'language' column
      group: ['language'],      // Group by language to get unique values
    });

    // Map the results to a simple array of languages
    const languageList = languages.map(lang => lang.language);

    res.json({ languages: languageList });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/timesOfDay', async (req, res) => {
  try {
    // Fetch unique 'timeOfDay' values from the database
    const timesOfDay = await Greeting.findAll({
      attributes: ['timeOfDay'], // Select only the 'timeOfDay' column
      group: ['timeOfDay'],      // Group by timeOfDay to get unique values
    });

    // Map the results to a simple array of timesOfDay
    const timesOfDayList = timesOfDay.map(item => item.timeOfDay);

    // Send the list as a response
    res.json({ timesOfDay: timesOfDayList });
  } catch (error) {
    console.error('Error fetching timesOfDay:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/greet', async (req, res) => {
  try {
    // Extract request data
    const { timeOfDay, language, tone } = req.body;

    // Query the database to find the matching greeting message
    const greeting = await Greeting.findOne({
      where: {
        timeOfDay: timeOfDay,
        language: language,
        tone: tone,
      },
    });

    // If a matching greeting is found, return the greeting message
    if (greeting) {
      res.json({ greetingMessage: greeting.greetingMessage });
    } else {
      // If no matching greeting is found, return a 404 error
      res.status(404).json({ error: 'Greeting not found for the given parameters' });
    }
  } catch (error) {
    console.error('Error fetching greeting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
module.exports = app;
// const express = require('express');
//DATABASE_URL="postgres://postgres.usxltdstcjrgdkuhflth:DBMSforAssignment3@aws-0-ca-central-1.pooler.supabase.com:6543/postgres"
// const sqlite = require('sqlite');
// const sqlite3 = require('sqlite3');
// const path = require('path');
// const GreetingRequest = require('./models/GreetingRequest');
// const GreetingResponse = require('./models/GreetingResponse');


// const app = express();
// const PORT = 8080;

// app.use(express.json());
// // Initialize SQLite database
// let db;

// (async () => {
//   db = await sqlite.open({
//     filename: './data/database.db',
//     driver: sqlite3.Database
//   });

//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS Greetings (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       timeOfDay TEXT NOT NULL,
//       language TEXT NOT NULL,
//       greetingMessage TEXT NOT NULL,
//       tone TEXT NOT NULL
//     )
//   `);
  
//     if(db.all('SELECT * FROM Greetings') == null)
//     {
//         // Seed Database
//         const insert = `INSERT INTO Greetings (timeOfDay, language, greetingMessage, tone) VALUES (?, ?, ?, ?)`;
//         db.run(insert, ["Morning", "English", "Good morning!", "Formal"]);
//         db.run(insert, ["Morning", "English", "Morning!", "Casual"]);
//         db.run(insert, ["Morning", "Sanskrit", "शुभमध्याह्नम्", "Formal"]);
//         db.run(insert, ["Afternoon", "Gujarati", "શુભ બપોર!", "Formal"]);
//         db.run(insert, ["Evening", "Gujarati", "સારી સાંજ!", "Formal"]);
//     }
// })();

// app.post('/greet', async (req,res) =>{

//     try{
//         const greetingRequest = new GreetingRequest(req.body.timeOfDay, req.body.language, req.body.tone);

//         var query = ` select greetingMessage from greetings where timeOfDay = ? and language = ? and tone = ?`
//         const greeting = await db.get(query,[greetingRequest.timeOfDay, greetingRequest.language, greetingRequest.tone]);

//         if(greeting){
//             const greetingReseponse = new GreetingResponse(greeting.greetingMessage);
//             return res.json(greetingReseponse);
//         }
//         else{
//             return res.status(404).json({error: 'No data avaible'});
//         }
//     }catch(error){
//         return res.status(400).json({error: error.message});
//     }
// });

// app.get('/', async (req, res) => {
//     try {
//         const all = await db.all('SELECT * FROM Greetings');
//         res.json({ message: 'success', data: all });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
        
// });

// app.get('/timesOfDay', async (req, res) => {
//     try {
//         const all = await db.all('SELECT DISTINCT timeOfDay FROM Greetings');
//         res.json({ all });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
        
// });

// app.get('/languages', async (req, res) => {
//     try {
//         const all = await db.all('SELECT DISTINCT language FROM Greetings');
//         res.json({ all });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
        
// });
// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


// // Greet Endpoint
// app.post('/greet', (req, res) => {
//   const { timeOfDay, language, tone } = req.body;

//   const query = `
//     SELECT greetingMessage 
//     FROM Greetings 
//     WHERE timeOfDay = ? AND language = ? AND tone = ?
//   `;
//   db.get(query, [timeOfDay, language, tone], (err, row) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error: " + err.message });
//     }
//     if (row) {
//       res.json({ greetingMessage: row.greetingMessage });
//     } else {
//       res.status(404).json({ error: "Greeting not found" });
//     }
//   });
// });

// // Get All Time of Day Values
// app.get('/timesOfDay', (req, res) => {
//   const query = `SELECT DISTINCT timeOfDay FROM Greetings`;
//   db.all(query, [], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error: " + err.message });
//     }
//     res.json(rows.map(row => row.timeOfDay));
//   });
// });

// // Get Supported Languages
// app.get('/languages', (req, res) => {
//   const query = `SELECT DISTINCT language FROM Greetings`;
//   db.all(query, [], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error: " + err.message });
//     }
//     res.json(rows.map(row => row.language));
//   });
// });
