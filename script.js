async function updateUI() {
  try {
    let res = await fetch("/data");
    let data = await res.json();

    let slotsHTML = "";

    for (let i = 1; i <= 3; i++) {
      let status = data["slot" + i];
      let className = status == 1 ? "full" : "free";
      let text = status == 1 ? "Occupied" : "Available";

      slotsHTML += `
        <div class="slot ${className}">
          Slot ${i}<br>${text}
        </div>
      `;
    }

    document.getElementById("slots").innerHTML = slotsHTML;
    document.getElementById("gate").innerText = "Gate: " + data.gate;

  } catch (err) {
    console.log("Error:", err);
  }
}

setInterval(updateUI, 1000);
