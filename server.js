const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let parkingData = {
    slot1: 0,
    slot2: 0,
    slot3: 0,
    gate: "CLOSED"
};

app.post("/update", (req, res) => {
    parkingData = req.body;
    res.send("OK");
});

app.get("/data", (req, res) => {
    res.json(parkingData);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running"));
