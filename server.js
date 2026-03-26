const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// Parking Data
let parkingData = {
    slot1: 0,
    slot2: 0,
    slot3: 0,
    totalRevenue: 0,
    occupied: 0,
    available: 3
};


// Activity Log
let activityLog = [];


// Slot Entry Times
let slotStartTime = {
    slot1: null,
    slot2: null,
    slot3: null
};


// Update from Arduino (Python Bridge)
app.post("/update", (req, res) => {

    const newData = req.body;

    ["slot1","slot2","slot3"].forEach(slot => {

        // Car Entered
        if(parkingData[slot] === 0 && newData[slot] === 1)
        {
            slotStartTime[slot] = Date.now();

            activityLog.unshift({
                vehicle: "Vehicle",
                slot: slot.toUpperCase(),
                event: "Entry",
                time: new Date().toLocaleTimeString(),
                amount: "-"
            });
        }

        // Car Left
        if(parkingData[slot] === 1 && newData[slot] === 0)
        {
            let duration = (Date.now() - slotStartTime[slot]) / 60000;

            let cost = Math.ceil(duration) * 5; // ₹5 per min

            parkingData.totalRevenue += cost;

            activityLog.unshift({
                vehicle: "Vehicle",
                slot: slot.toUpperCase(),
                event: "Exit",
                time: new Date().toLocaleTimeString(),
                amount: "₹" + cost
            });

            slotStartTime[slot] = null;
        }

    });

    parkingData.slot1 = newData.slot1;
    parkingData.slot2 = newData.slot2;
    parkingData.slot3 = newData.slot3;

    parkingData.occupied =
        parkingData.slot1 +
        parkingData.slot2 +
        parkingData.slot3;

    parkingData.available = 3 - parkingData.occupied;

    console.log("Updated Data:", parkingData);

    res.send("OK");
});


// Get Parking Data
app.get("/data", (req, res) => {
    res.json(parkingData);
});


// Get Activity Log
app.get("/activity", (req, res) => {
    res.json(activityLog.slice(0,20));
});


// Serve Website
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
});


// Render Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log("Server Running on port " + PORT);
});
