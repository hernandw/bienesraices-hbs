const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const rooms = document.getElementById("rooms").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const parking = document.getElementById("parking").value;
  const wc = document.getElementById("wc").value;
  const street = document.getElementById("street").value;
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;
  const id = document.getElementById("id").value;

  const data = {
    title,
    description,
    rooms,
    category,
    price,
    parking,
    wc,
    street,
    lat,
    lng,
    id,
  };

  await fetch(`/property/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Propiedad editada con exito");
  window.location.href = "/property";
});
