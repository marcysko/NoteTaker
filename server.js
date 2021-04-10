let express = require('express');
let path = require("path");
let fs = require("fs")

let PORT = process.env.PORT || 8080;
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))

var notesInfo;
var newNotes;

// index directory
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
// notes directory
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
})
//  all notes
app.get("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
      if (err) throw err;
      notesInfo = JSON.parse(data)
      res.json(notesInfo)
  })
});

// write notes to json file
app.post("/api/notes", function (req, res) {
  newNotes = req.body
  
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
      if (err) throw err;
      notesInfo = JSON.parse(data)
      notesInfo.push(newNotes)
      // must be a string, requires a callback so include the err function.
      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesInfo),function (err, data) {
          if (err) throw err;
          res.send()
      });
      
  });
  
});

// delete notes from json file
app.delete("/api/notes/:id", function (req, res) {
  
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
      if (err) throw err;
      notesInfo = JSON.parse(data)
      
      notesInfo.splice(req.params.id,1)
      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesInfo),function (err, data) {
          if (err) throw err;
          res.send();
      })
  })
})

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// server listener
app.listen(PORT, function() {
  console.log("App is listening on PORT: " + PORT);
});
