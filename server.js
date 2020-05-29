const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static ("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// GET requests
app.get('/api/notes', function(req, res) {
    res.sendFile(__dirname + "/db/db.json")
});

// POST requests
app.post('/api/notes', function(req, res){
    let notes = fs.readFileSync(__dirname + "/db/db.json");
    notes = JSON.parse(notes);
    const note = {
        title: req.body.title,
        text: req.body.text,
    };
    note.id = notes.length;

    notes.push(note);

    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(notes));

    res.sendFile(__dirname + "/db/db.json");
});

// when the frontend (HTML/CSS/JS) is requesting data from the server (backend)
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// everything else besides /
app.get('*', function(req, res) {
  res.sendFile((__dirname + "/public/notes.html"));
});

//Delete
app.delete("/api/notes/:id", function (req, res) {
    var noteId = req.params.id;
    let notes = fs.readFileSync(__dirname + "/db/db.json");
    notes = JSON.parse(notes);

    console.log(noteId);
    console.log(notes)
    notes = notes.filter((note) => {
        if (note.id == noteId) {
            return false;
        }
        return true;
    });
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(notes));
    res.sendFile(__dirname + "/db/db.json");
  });

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT); // http://localhost:3000/
});

