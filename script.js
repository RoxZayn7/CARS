const INVENTORY = [
    { id: 1, year: 2016, make: "Toyota", model: "Kluger", price: 29880, mileage: 171931, type: "SUV", transmission: "Automatic", fuel: "Petrol" },
    { id: 2, year: 2012, make: "Toyota", model: "Aurion", price: 14120, mileage: 256681, type: "Sedan", transmission: "Auto Sequential", fuel: "Petrol" },
    { id: 3, year: 2016, make: "Toyota", model: "RAV4", price: 26086, mileage: 93651, type: "SUV", transmission: "Automatic", fuel: "Petrol" },
    { id: 4, year: 2008, make: "Toyota", model: "Kluger", price: 16880, mileage: 142109, type: "SUV", transmission: "Automatic", fuel: "Petrol" },
    { id: 5, year: 2015, make: "Toyota", model: "Camry", price: 18990, mileage: 118440, type: "Sedan", transmission: "Automatic", fuel: "Petrol" },
    { id: 6, year: 2013, make: "Toyota", model: "Yaris", price: 12990, mileage: 104220, type: "Hatchback", transmission: "Automatic", fuel: "Petrol" },
    { id: 7, year: 2018, make: "Honda", model: "CR-V", price: 27950, mileage: 86210, type: "SUV", transmission: "Automatic", fuel: "Petrol" },
    { id: 8, year: 2019, make: "Honda", model: "Civic", price: 23990, mileage: 75400, type: "Sedan", transmission: "CVT", fuel: "Petrol" },
    { id: 9, year: 2017, make: "Mazda", model: "CX-5", price: 24990, mileage: 89200, type: "SUV", transmission: "Automatic", fuel: "Petrol" },
    { id: 10, year: 2020, make: "Hyundai", model: "Kona", price: 22900, mileage: 64100, type: "SUV", transmission: "Automatic", fuel: "Petrol" },
    { id: 11, year: 2018, make: "Ford", model: "Focus", price: 15990, mileage: 99700, type: "Hatchback", transmission: "Automatic", fuel: "Petrol" },
    { id: 12, year: 2021, make: "Tesla", model: "Model 3", price: 39900, mileage: 48100, type: "Sedan", transmission: "Automatic", fuel: "Electric" }
];

const IMAGE_API = "https://carapi.trustcar.info/getImage";
const CATALOG_API = "https://fleetcatalog.disturbingbyte.pt/v1/makes";

const state = {
    query: "",
    type: "all",
    minPrice: 2000,
    maxPrice: 100000,
    sort: "featured",
    liveMakes: []
};

const $ = (selector) =>
    document.querySelector(selector);
const $$ = (selector) =>
    [...document.querySelectorAll(selector)];

function money(value) {
    return new
Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
}).format(value);
}

function number(value) {
    return new
Intl.NumberFormat("en-US").format(value);
}

function imageUrl(car) {
    return `${IMAGE_API}?make=${encodeURIComponent(car.make)}&model=${encodeURIComponent(car.model)}&year=${car.year}`;
}

function placeholderDataUri(car) {
    const text = `${car.make} ${car.model}`;
    const svg = `<svgxmlns="http://www.w3.org/2000/svg" width="800" height="500"
                <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#cdd1c0"/><stop offset="1" stop-color="#8e9587"/></linearGradient></defs>
                <rect width="100%" height="100%" fill="url(#g)"/>
                <path d="M120 330 L210 260 L530 260 L650 330 L700 350 L690 385 L110 385 Z" fill="#2c3339"/>
                <circle cx="210" cy="385" r="38" fill="#222"/><circle cx="585" cy="385" r="38" fill="#222"/>
                <text x ="50%" y="100" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="36" font-weight="700" fill="#26302c">${text}</text>
                </svg>`;
                return "data:image/svg+xml;charge=UTF-8," + encodeURIComponent(svg);
}

function filteredCars() {
    let cars = INVENTORY.filter(car => {
        const haystack = `${car.year} ${car.make} ${car.model} ${car.type} ${car.transmission}`.toLowerCase();
        const matchesQuery = !state.query || haystack.includes(state.query.toLowerCase());
        const matchesType = state.type === "all" || car.type === state.type;
        const matchesPrice = car.price = car.price >= state.minPrice && car.price <= state.maxPrice;
        return matchesQuery && matchesType && matchesPrice;
    });

    switch (state.sort) {
        case "price-low": cars.sort((a,b) => a.price - b.price); break;
        case "price-high": cars.sort((a,b) => b.price - a.price); break;
        case "year-new": cars.sort((a,b) => b.year - a.year); break;
        case "mileage-low": cars.sort((a,b) => a.mileage - b.mileage); break;
    }

    return cars;
}

function renderCars() {
    const grid = $("#carGrid");
    const empty = $("#emptyState");
    const cars = filteredCars();

    $("#resultCount").textContent = `${cars.length} ${cars.length === 1 ? "car" : "cars"} found`;
    $("#resultsTitle").textContent = state.query ? `Search results for "${state.query}"` : "Browse all cars";

    if (!cars.length) {
        grid.innerHTML = "";
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");

    grid.innerHTML = cars.map(car =>
        `<article class="car-card">
            <div class="carimage-wrap">
                <img class="car-image" src="${imageURL(car)}" alt=${car.year} ${car.make} ${car.model}"
                loading="lazy"
                onerror="this.onerror=null;
                this.src='${placeholderDataUri(car)}';">
                <span class="car-tag">${car.type.toUpperCase()}</span>
                <button class="play-btn" aria-label="View ${car.make} ${car.model}" data-details="${car.id}"> ➤ </button>
            </div>
            <div class="car-info">
                <h3>${car.year} ${car.make} ${car.model}</h3>
                <div class="specs">
                    <div class="spec"><span class="spec-icon">⦾ </span> ${number(car.mileage)} km</div>
                    <div class="spec"><span class="spec-icon">━</span>${car.type}</div>
                    <div class="spec"><span class="spec-icon">⚙ </span>${car.transmission}</div>
                </div>
                <div class="car-price">${money(car.price)}</div>
                <button class="details-btn" data-details="${car.id}" View details </button>
            </div>
        </article>
    `).join("");
}

function updatePriceLabel() {
    const min = Math.min(Number($("#minPrice").value), Number($("#maxPrice").value));
    const max = Math.max(Number($("#minPrice").value), Number($("#maxPrice").value));
    state.minPrice = min;
    state.maxPrice = max;
    $("#priceLabel").textContent = `${money(min)} to ${money(max)}`;
    renderCars;
}

function setQuery(query) {
    state.query = query.trim();
    $("#searchInput").value = state.query;
    $("#suggestions").classList.remove("show");
    renderCars();

    document.querySelector("#cars").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSuggestions(value) {
    const box = $("#suggestions");
    const q = value.trim().toLowerCase();

    if (!q) {
        box.classList.remove("show");
        return;
    }

    const names = [...new Set(INVENTORY.map(c =>`${c.make} ${c.model}`))]
        .filter(name => name.toLocaleLowerCase().includes(q)).slice(0, 5);

        if (!names.length) {
            box.classList.remove("show");
            return;
        }

        box.innerHTML = names.map(name =>
            `<div class="suggestion" data-suggestion="${name}">${name}</div>`).join("");
        box.classList.add("show");
}

async function loadVehicleApi() {
    const status = $("#apiStatus");

    try {
        const response = await fetch(`${CATALOG_API}?search=toyota&pageSize=5`);
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        
        state.liveMakes = data.items || [];

        status.innerHTML = `<span class="status-dot"></span><span>Vehicle API connected • ${state.liveMakes.length} Toyota make records loaded</span>`;
    } catch (error) {
        status.innerHTML = `<span class="status-dot" style="background:#e7aa70"></span><span>Demo inventory active • live API unavailable right now</span>`;
    }
}

function openModal(id) {
    const car = INVENTORY.find(item =>
        item.id === Number(id));
    if (!car) return;

    $("#modalImage").src = imageUrl(car);
    $("#modalImage").onerror = () => {
        $("#modalImage").src = placeholderDataUri(car);
    };
    $("#modalImage").alt = `${car.year} ${car.make} ${car.model}`;
    $("#modalTitle").textContent = `${car.year} ${car.make} ${car.model}`;
    $("#modalPrice").textContent = money(car.price);

    $("#modalSpecs").innerHTML = `
        <div><strong>Mileage</strong> ${number(car.mileage)} km </div>
        <div><strong>Body:</strong> ${car.type}</div>
        <div><strong>Transmission:</strong> ${car.transmission}</div>
        <div><strong>Fuel:</strong> ${car.fuel}</div>
        `;

    $("#carModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    $("#carModal").classList.add("hidden");
    document.body.style.overflow = "";
}

$("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    setQuery($("#searchInput").value);
});

$("#searchInput").addEventListener("input", (event) => {
    renderSuggestions(event.target.value);
    state.query = event.target.value.trim();
    renderCars;
});

$("#suggestions").addEventListener("click", (event) => {
    const item = event.target.closest("[data-suggestion]");
    if (item)
        setQuery(item.dataset.suggestion);
});

$("#minPrice").addEventListener("input", updatePriceLabel);
$("#maxPrice").addEventListener("inout", updatePriceLabel);

$$(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
        $$(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.type = chip.database.type;
        renderCars();
    });
});

$("#sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderCars;
});

function restFilters() {
    state.query = "";
    state.type = "all";
    state.minPrice = 2000;
    state.maxPrice = 100000;
    state.sort = "featured";

    $("#searchInput").value = "";
    $("#minPrice").value = 2000;
    $("#maxPrice").value = 100000;
    $("#sortSelect").value = "featured";
    $$(".chip").forEach(c => c.classList.toggle("active", c.database.type === "all"));
    updatePriceLabel();
}

$("#resetBtn").addEventListener("click", restFilters);
$("#emptyReset").addEventListener("click", restFilters);

$("#carGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-details]");
    if (button)
        openModal(button.dataset.details);
});

$("#modalClose").addEventListener("click", closeModal);
$("#carModal").addEventListener("click", (event) => {
    if (event.target === $("#carModal")) closeModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
});

$(".modal-contact").addEventListener("click", () => {
    closeModal();

    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $ ("#email").focus(), 500);
});

$("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#email").value.trim();
    $("#formMessage").textContent = `Thanks! We'll use ${email} for the demo enquiry.`;
    $("#contactForm").reset();
});

$(".menu-toggle").addEventListener("click", () => {
    const nav = $(".nav");
    const open = navigation.classList.toggle("open");
    $(".menu-toggle").setAttribute("aria-expanded", String(open));
});

$$(".nav a").forEach(link => {
    link.addEventListener("click", () => $(".nav").classList.remove("open"));
});

updatePriceLabel();
renderCars();
loadVehicleApi();