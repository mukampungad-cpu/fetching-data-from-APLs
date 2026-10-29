
import { fetchData } from "./api.js";

const productsContainer = document.querySelector("#products");
const searchInput = document.querySelector("#search");
const status = document.querySelector("#status");
const productCount = document.querySelector("#product-count");
const cartCount = document.querySelector("#cart-count");

let allProducts = [];
let cartItems = 0;

// Display the star rating
function createRating(rating) {
    const ratingElement = document.createElement("div");
    ratingElement.className = "rating";

    const stars = document.createElement("span");
    stars.textContent = "★".repeat(
        Math.max(0, Math.min(5, Math.round(rating || 0)))
    );
    stars.setAttribute("aria-label", `Rating: ${rating || 0} out of 5`);

    const ratingText = document.createElement("span");
    ratingText.textContent = `(${Number(rating || 0).toFixed(1)})`;

    ratingElement.append(stars, ratingText);
    return ratingElement;
}

// Create one product card
function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Image area
    const imageWrap = document.createElement("div");
    imageWrap.className = "image-wrap";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.thumbnail;
    image.alt = product.title;
    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.alt = "Product image unavailable";
        image.removeAttribute("src");
    });

    imageWrap.appendChild(image);

    // Stock label
    if (product.stock === 0) {
        const stockLabel = document.createElement("span");
        stockLabel.className = "stock-label";
        stockLabel.textContent = "Out of Stock";
        imageWrap.appendChild(stockLabel);
    }

    // Product information
    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;

    const rating = createRating(product.rating);

    // Price and button row
    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(product.price);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";

    if (product.stock === 0) {
        addButton.textContent = "Out of Stock";
        addButton.disabled = true;
    } else {
        addButton.textContent = "🛒 Add";

        addButton.addEventListener("click", () => {
            cartItems++;
            cartCount.textContent = cartItems;
            addButton.textContent = "✓ Added";

            setTimeout(() => {
                addButton.textContent = "🛒 Add";
            }, 1000);
        });
    }

    bottom.append(price, addButton);
    info.append(title, description, rating, bottom);
    card.append(imageWrap, info);

    return card;
}

// Display all matching products
function displayProducts(products) {
    productsContainer.replaceChildren();

    productCount.textContent = `${products.length} products`;

    if (products.length === 0) {
        const message = document.createElement("p");
        message.className = "no-results";
        message.textContent = "No products found. Try another search.";
        productsContainer.appendChild(message);
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
        fragment.appendChild(createProductCard(product));
    });

    productsContainer.appendChild(fragment);
}

// Fetch products from the API
async function getProducts() {
    status.textContent = "Loading products...";

    try {
        const data = await fetchData();

        if (!data || !Array.isArray(data)) {
            throw new Error("Products could not be loaded.");
        }

        allProducts = data;
        displayProducts(allProducts);
        status.textContent = "";
    } catch (error) {
        console.error("Error loading products:", error);
        status.textContent =
            "Unable to load products. Please check your connection and try again.";
        productCount.textContent = "Products unavailable";
    }
}

// Search products by name or description
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = allProducts.filter((product) => {
        return (
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    });

    displayProducts(filteredProducts);
});

getProducts();
