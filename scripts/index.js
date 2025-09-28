const GALLERY_URL =
  "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json";
const galleryContainer = document.getElementById("coffee-gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

let allCoffeeData = []; // Variable para almacenar los datos.

function createCoffeeCard(coffee) {
  const isAvailable = coffee.available;
  const isPopular = coffee.popular;
  const hasRating = coffee.rating !== null;

  // Rutas de las imágenes de estrella (se asume que deben incluir el nombre del repositorio
  // si se despliega en GitHub Pages, pero se usan las rutas relativas aquí por simplicidad).
  // NOTA: Si usas GitHub Pages, estas rutas deben ser corregidas: e.g., /CODE-201-labs-11/imgs/Star_fill.svg
  const STAR_FILLED_PATH = `/imgs/Star_fill.svg`;
  const STAR_EMPTY_PATH = `/imgs/Star.svg`;

  // 1. Crear el elemento principal <div class="card">
  const card = document.createElement("div");
  card.classList.add("card");
  if (!isAvailable) {
    card.classList.add("sold-out");
  }
  card.setAttribute("data-available", isAvailable);

  // 2. Crear el wrapper de la imagen <div class="card-image-wrapper">
  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("card-image-wrapper");
  card.appendChild(imageWrapper);

  // 2a. Imagen <img class="card-image">
  const image = document.createElement("img");
  image.src = coffee.image;
  image.alt = coffee.name;
  image.classList.add("card-image");
  imageWrapper.appendChild(image);

  // 2b. Etiqueta Popular <span class="popular-tag"> (si aplica)
  if (isPopular) {
    const popularTag = document.createElement("span");
    popularTag.classList.add("popular-tag");
    popularTag.textContent = "Popular";
    imageWrapper.appendChild(popularTag);
  }

  // 3. Crear los detalles <div class="card-details">
  const details = document.createElement("div");
  details.classList.add("card-details");
  card.appendChild(details);

  // 3a. Título <h3>
  const title = document.createElement("h3");
  title.classList.add("card-title");
  title.textContent = coffee.name;
  details.appendChild(title);

  // 3b. Precio <span>
  const price = document.createElement("span");
  price.classList.add("card-price");
  price.textContent = `$${coffee.price}`;
  details.appendChild(price);

  // 4. Crear el wrapper de rating y sold-out <div class="card-rating-wrapper">
  const ratingWrapper = document.createElement("div");
  ratingWrapper.classList.add("card-rating-wrapper");
  card.appendChild(ratingWrapper);

  // 4a. Rating y Votos <div class="rating-and-votes">
  const ratingVotes = document.createElement("div");
  ratingVotes.classList.add("rating-and-votes");
  ratingWrapper.appendChild(ratingVotes);

  // Imagen de Estrella
  const starImg = document.createElement("img");
  starImg.classList.add("star");

  if (hasRating) {
    // Estrella Rellena y Votos
    starImg.src = STAR_FILLED_PATH;

    const ratingText = document.createElement("span");
    ratingText.classList.add("rating-text");
    ratingText.textContent = coffee.rating;

    const voteCount = document.createElement("span");
    voteCount.classList.add("vote-count");
    voteCount.textContent = `(${coffee.votes} votes)`;

    ratingVotes.append(starImg, ratingText, voteCount);
  } else {
    // Estrella Vacía y No ratings
    starImg.src = STAR_EMPTY_PATH;

    const noRating = document.createElement("span");
    noRating.classList.add("no-rating");
    noRating.textContent = "No ratings";

    ratingVotes.append(starImg, noRating);
  }

  // 4b. Etiqueta Sold Out <span class="sold-out-tag"> (si aplica)
  if (!isAvailable) {
    const soldOutTag = document.createElement("span");
    soldOutTag.classList.add("sold-out-tag");
    soldOutTag.textContent = "Sold out";
    ratingWrapper.appendChild(soldOutTag);
  }

  return card;
}

// Función para renderizar las cards en mi contenedor
function renderGallery(data) {
  galleryContainer.innerHTML = ""; // Limpiar el contenedor
  data.forEach((coffee) => {
    const cardElement = createCoffeeCard(coffee);
    galleryContainer.appendChild(cardElement);
  });
}

// Función para filtrar los datos
function filterCoffee(filterType) {
  let filteredData = allCoffeeData;

  if (filterType === "available") {
    filteredData = allCoffeeData.filter((coffee) => coffee.available);
  }

  renderGallery(filteredData);

  // Actualizar clase 'active' de los botones
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === filterType) {
      btn.classList.add("active");
    }
  });
}

// 1. Fetch de los datos
fetch(GALLERY_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar los datos");
    }
    return response.json();
  })
  .then((data) => {
    allCoffeeData = data;
    filterCoffee("all"); // Mostrar todos los productos por defecto
  })
  .catch((error) => {
    console.error("Hubo un error al fetchear los datos:", error);
    galleryContainer.innerHTML =
      '<p style="color:red; text-align:center;">No se pudieron cargar los productos de café.</p>';
  });

// 2. Agregar Eventos a los Botones de Filtrado
filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const filterType = event.target.dataset.filter;
    filterCoffee(filterType);
  });
});
