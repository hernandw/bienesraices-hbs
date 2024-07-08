const lat = document.getElementById("lat").textContent
const lng = document.getElementById("lng").textContent
const street = document.getElementById("street").textContent

const map = L.map("map").setView([lat, lng], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const marker = L.marker([lat, lng]).addTo(map);

marker.bindPopup(street).openPopup();

marker.on("dragend", function (e) {
    marker = e.target;
    const position = marker.getLatLng();
    marker.setLatLng(position, {
        draggable: true
    }).bindPopup(position).update();
    $("#lat").val(position.lat);
    $("#lng").val(position.lng);
});