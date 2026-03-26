async function updateDashboard() {

try {

const response = await fetch("/data");
const data = await response.json();

console.log("DATA:", data);

// Revenue
document.getElementById("totalRevenue").innerText =
"₹" + data.totalRevenue;

// Gate Status
document.getElementById("gateStatus").innerText =
data.gateStatus;

// Occupied
document.getElementById("occupied").innerText =
data.occupied;

// Available
document.getElementById("available").innerText =
data.available;

// Slot Indicators
updateSlots(data);

} catch (error) {

console.log("Error fetching data:", error);

}

}


// Slot Update
function updateSlots(data){

document.getElementById("slot1").innerText =
data.slot1 ? "Occupied" : "Available";

document.getElementById("slot2").innerText =
data.slot2 ? "Occupied" : "Available";

document.getElementById("slot3").innerText =
data.slot3 ? "Occupied" : "Available";

}


// Activity Update
async function updateActivity(){

const res = await fetch("/activity");
const logs = await res.json();

const table = document.getElementById("activityTable");

table.innerHTML = "";

logs.slice(0,10).forEach(item=>{

table.innerHTML += `
<tr>
<td>${item.vehicle}</td>
<td>${item.slot}</td>
<td>${item.event}</td>
<td>${item.time}</td>
<td>${item.amount}</td>
</tr>
`;

});

}


// Auto Refresh
setInterval(()=>{

updateDashboard();
updateActivity();

},1000);


// Initial Load
updateDashboard();
updateActivity();
