const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Parking Data
let parkingData = {
slot1: 0,
slot2: 0,
slot3: 0,
occupied: 0,
available: 3,
totalRevenue: 0,
gateStatus: "OPEN"
};


// Activity Log
let activity = [];


// Root Route
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Get Parking Data
app.get("/data", (req, res) => {
res.json(parkingData);
});


// Get Activity Log
app.get("/activity", (req, res) => {
res.json(activity);
});


// Update from Python Bridge
app.post("/update", (req, res) => {

console.log("Incoming:", req.body);

const oldSlot1 = parkingData.slot1;
const oldSlot2 = parkingData.slot2;
const oldSlot3 = parkingData.slot3;


// Update Slots
parkingData.slot1 = req.body.slot1 || 0;
parkingData.slot2 = req.body.slot2 || 0;
parkingData.slot3 = req.body.slot3 || 0;


// Calculate Occupancy
parkingData.occupied =
parkingData.slot1 +
parkingData.slot2 +
parkingData.slot3;


// Calculate Available
parkingData.available = 3 - parkingData.occupied;


// Gate Status
parkingData.gateStatus =
parkingData.available > 0 ? "OPEN" : "FULL";


// Activity Detection
updateActivity(oldSlot1, parkingData.slot1, "SLOT1");
updateActivity(oldSlot2, parkingData.slot2, "SLOT2");
updateActivity(oldSlot3, parkingData.slot3, "SLOT3");


res.send("OK");

});


// Activity Function
function updateActivity(oldVal, newVal, slot) {

// Vehicle Entered
if (oldVal === 0 && newVal === 1) {

activity.unshift({
vehicle: "Vehicle",
slot: slot,
event: "ENTRY",
time: new Date().toLocaleTimeString(),
amount: "--"
});

}

// Vehicle Exited
if (oldVal === 1 && newVal === 0) {

parkingData.totalRevenue += 5;

activity.unshift({
vehicle: "Vehicle",
slot: slot,
event: "EXIT",
time: new Date().toLocaleTimeString(),
amount: "₹5"
});

}

}


// Start Server
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
console.log("Server running on", PORT);
});
