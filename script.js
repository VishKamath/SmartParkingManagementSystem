let slots = {
  slot1: { startTime: null, cost: 0 },
  slot2: { startTime: null, cost: 0 },
  slot3: { startTime: null, cost: 0 }
};

const RATE = 10; // ₹10
const INTERVAL = 10; // seconds

async function updateUI() {
  try {
    let res = await fetch("/data");
    let data = await res.json();

    let slotsHTML = "";
    let total = 0;

    let now = Date.now();

    for (let i = 1; i <= 3; i++) {
      let key = "slot" + i;
      let status = data[key];

      // if car enters → start timer
      if (status == 1 && slots[key].startTime === null) {
        slots[key].startTime = now;
      }

      // if car leaves → reset
      if (status == 0) {
        slots[key].startTime = null;
        slots[key].cost = 0;
      }

      // calculate cost
      if (slots[key].startTime !== null) {
        let duration = (now - slots[key].startTime) / 1000; // seconds
        let units = Math.floor(duration / INTERVAL);
        slots[key].cost = units * RATE;
      }

      let className = status == 1 ? "full" : "free";
      let text = status == 1 ? "Occupied" : "Available";
      let costText = status == 1 ? `₹${slots[key].cost}` : "--";

      total += slots[key].cost;

      slotsHTML += `
        <div class="slot ${className}">
          Slot ${i}<br>${text}<br>
          <small>Cost: ${costText}</small>
        </div>
      `;
    }

    document.getElementById("slots").innerHTML = slotsHTML;
    document.getElementById("gate").innerText = "Gate: " + data.gate;
    document.getElementById("total").innerText = "Total Revenue: ₹" + total;

  } catch (err) {
    console.log("Error:", err);
  }
}

setInterval(updateUI, 1000);
