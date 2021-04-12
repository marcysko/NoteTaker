//Dependencies
const path = require("path");
const fs = require("fs");
const express = require("express");

// Server set up
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// notes directory
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//receive a new note and save db.json` file, return the new note to the client.
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteList.length).toString();

    //create an id property and assign it to each json object
    newNote.id = notelength;
    //push updated note to the data containing notes history in db.json
    noteList.push(newNote);

    //write the updated data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

//delete note by id.
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    //writes updated data to db.json and displays the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

//route to main page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Server Listener
app.listen(PORT, () => console.log("Listening" + PORT));