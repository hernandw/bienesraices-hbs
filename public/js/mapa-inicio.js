const lat = -18.4900773;
const lng = -70.277749;

const map = L.map("map").setView([lat, lng], 14);

let markers = L.layerGroup().addTo(map);
let propiedades = [];

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const getDataProperty = async () => {
  try {
    const response = await fetch("/property/api");
    propiedades = await response.json();

    getPropiedades(propiedades);
  } catch (error) {
    console.log("Error Message: ", error.message);
  }
}

const getPropiedades = async (propy) => {
  propy.forEach((prop) => {
    const marker = new L.marker([prop?.lat, prop?.lng], {
      autoPan: true,
    }).addTo(map).bindPopup(`
            <p class="font-bold">Categoria: <span class="font-normal">${prop?.categoria}</span></h3>
            <h1 class="text-xl text-rose-600 font-extrabold uppercase my-2">${prop.title}</h5>
            <img src="${prop?.image}" alt="imagen de la propiedad ${prop?.title}">
            <p class="text-gray-700 font-bold">Precio: <span class="font-normal">${prop?.precio}</span></p>
            <a href="/property/${prop.id}" class="block bg-cyan-800 uppercase text-boton font-bold text-xs p-2 rounded text-center my-5">ver propiedad</a>
            `);

    markers.addLayer(marker);
  });

  //filtros

  const filters = {
    category: "",
    price: "",
  };

  const categorySelect = document.getElementById("category");
  const priceSelect = document.getElementById("price");

  categorySelect?.addEventListener("change", (e) => {
    filters.category = +e.target.value;

    filterProperties();
  });

  priceSelect?.addEventListener("change", (e) => {
    filters.price = +e.target.value;

    filterProperties();
  });

  const filterProperties = () => {
    const resultado = propiedades.filter(filterCategory).filter(filterPrice);
    console.log("resultado", resultado);
    
  };

  const filterCategory = (propiedad) => {
    const resultado = filters.category ? propiedad.category_id === filters.category : propiedad;

    return resultado;
  };
};

/* const filterPrice = (propiedad) => {
  return filters.price ? propiedad.precio_id === filters.price : propiedad;
}; */

getDataProperty()