console.log("site.js is running")

// Load homepage menu, events
if (document.getElementById("menugrid")) {
    loadMenu()
}

if (document.getElementById("eventlist")) {
    loadEvents()
}

// Load detail pages
if (document.getElementById("menudetail")) {
    loadMenuDetail()
}

if (document.getElementById("eventdetail")) {
    loadEventDetail()
}

// Forms
setupForms()


// Menu - Homepage
async function loadMenu() {
    try {
        const res = await fetch("/api/v1/menu")
        const items = await res.json()

        displayMenu(items)

    } catch (err) {
        console.log("Menu fetch error:", err)
    }
}

function displayMenu(items) {
    const menuContainer = document.getElementById("menugrid")
    if (!menuContainer) return

    menuContainer.innerHTML = ""

    items.forEach(item => {
        const menudiv = document.createElement("div")
        menudiv.classList.add("menuitem")

        menudiv.innerHTML = `
            <a href="menu.html?id=${item._id}">
            <img src="${item.url}" alt="${item.name}">
            <h3 class="menuname">${item.name}</h3>
            </a>
            <p class="menudescr">${item.description}</p>
            <p class="menuprice">$${Number(item.price).toFixed(2)}</p>`

        menuContainer.appendChild(menudiv)
    })
}


// Events - Homepage
async function loadEvents() {
    try {
        const res = await fetch("/api/v1/events")
        const items = await res.json()

        displayEvents(items)

    } catch (err) {
        console.log("Events fetch error:", err)
    }
}

function displayEvents(events) {
    const container = document.getElementById("eventlist")
    if (!container) return

    container.innerHTML = ""

    events.forEach(event => {
        const div = document.createElement("div")
        div.classList.add("eventtext")

        div.innerHTML = `
            <a href="events.html?id=${event._id}">
            <h3>${event.title}</h3>
            <p>${event.date}</p>
            </a>
        `

        container.appendChild(div)
    })
}


// Menu Detail Page
async function loadMenuDetail() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    if (!id) return

    const res = await fetch(`/api/v1/menu/${id}`)
    const item = await res.json()

    displayMenuDetail(item)
}

function displayMenuDetail(item) {
    const container = document.getElementById("menudetail")
    if (!container) return;

    container.innerHTML = `
        <div class="menudetail">
            <img src="${item.url}" alt="${item.name}" class="menuimage">
            <h3 class="menuname">${item.name}</h3>
            <p class="menudescr">${item.description}</p>
            <h4 class="menuprice">$${item.price.toFixed(2)}</h4>
        </div>
    `
}


// Event Detail Page
async function loadEventDetail() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    if (!id) return

    const res = await fetch(`/api/v1/events/${id}`)
    const item = await res.json()

    displayEventDetail(item)
}

function displayEventDetail(event) {
    const container = document.getElementById("eventdetail")
    if (!container) return

    container.innerHTML = `
        <div class="eventdetail">
            <h2>${event.title}</h2>

            <h3>${event.day}</h3>
            <h4>${event.date}</h4>

            <p>${event.time}</p>
            <p>${event.address}</p>
            <p>${event.city}</p>
        </div>
    `
}


// Admin page - Forms
function setupForms() {

    const menuForm = document.getElementById("menuForm")
    if (menuForm) {
        menuForm.addEventListener("submit", async (event) => {
            event.preventDefault()

            const image = document.getElementById("image").value
            const name = document.getElementById("menuname").value
            const description = document.getElementById("menudescription").value
            const price = document.getElementById("price").value

            await fetch("/api/v1/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: image,
                    name,
                    description,
                    price
                })
            })

            menuForm.reset()
        })
    }

    const eventForm = document.getElementById("eventForm")
    if (eventForm) {
        eventForm.addEventListener("submit", async (event) => {
            event.preventDefault()

            const title = document.getElementById("title").value
            const day = document.getElementById("day").value
            const rawDate = document.getElementById("date").value

            const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric"
            })

            const address = document.getElementById("address").value
            const city = document.getElementById("city").value
            // const time = document.getElementById("time").value

            const startRaw = document.getElementById("startTime").value
            const endRaw = document.getElementById("endTime").value

            function formatTime(raw) {
                let [hours, minutes] = raw.split(":")
                hours = parseInt(hours)

                let suffix = hours >= 12 ? "PM" : "AM"
                hours = hours % 12 || 12

                return `${hours}${suffix}`
            }

            const formattedTime =
                `${formatTime(startRaw)} – ${formatTime(endRaw)}`




            await fetch("/api/v1/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    day,
                    date: formattedDate,
                    address,
                    city,
                    time: formattedTime
                })
            })

            eventForm.reset()
        })
    }
}