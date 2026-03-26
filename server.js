const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let parkingData = {
slot1: 0,
slot2: 0,
slot3: 0,
occupied: 0,
available: 3,
totalRevenue: 0,
gateStatus: "OPEN"
};

let activity = [];

app.get("/data", (req,res)=>{
res.json(parkingData);
});

app.get("/activity",(req,res)=>{
res.json(activity);
});

app.post("/update",(req,res)=>{

console.log("Incoming:", req.body);

const old1 = parkingData.slot1;
const old2 = parkingData.slot2;
const old3 = parkingData.slot3;

parkingData.slot1 = req.body.slot1;
parkingData.slot2 = req.body.slot2;
parkingData.slot3 = req.body.slot3;

parkingData.occupied =
parkingData.slot1 +
parkingData.slot2 +
parkingData.slot3;

parkingData.available = 3 - parkingData.occupied;

parkingData.gateStatus =
parkingData.available > 0 ? "OPEN" : "FULL";

updateActivity(old1, parkingData.slot1, "SLOT1");
updateActivity(old2, parkingData.slot2, "SLOT2");
updateActivity(old3, parkingData.slot3, "SLOT3");

res.send("OK");

});

function updateActivity(oldVal,newVal,slot){

if(oldVal===0 && newVal===1){

activity.unshift({
vehicle:"Vehicle",
slot:slot,
event:"ENTRY",
time:new Date().toLocaleTimeString(),
amount:"--"
});

}

if(oldVal===1 && newVal===0){

parkingData.totalRevenue += 5;

activity.unshift({
vehicle:"Vehicle",
slot:slot,
event:"EXIT",
time:new Date().toLocaleTimeString(),
amount:"₹5"
});

}

}

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
console.log("Server running on",PORT);
});
