const express = require("express");
const app = express();

app.use(express.json());

let parkingData = {
    slot1: 0,
    slot2: 0,
    slot3: 0,
    gate: "CLOSED"
};

app.post("/update", (req, res) => {
    parkingData = req.body;
    console.log(parkingData);
    res.send("OK");
});

app.get("/data", (req, res) => {
    res.json(parkingData);
});

app.listen(3000, () => console.log("Server running"));
