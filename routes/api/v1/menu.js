const router = require('express').Router()
const { request, response } = require('express')
const { getCollection, ObjectId } = require('../../../dbconnect')

let collection = null
const getMenu = async () => {
    if (!collection) collection = await getCollection('foodtruckdb', 'menu')
        return collection
}  

// Test
router.get('/', async (req, res) => {
    const collection = await getMenu()

    console.log("DB NAME:", collection.dbName || "unknown")
    
    const items = await collection.find().toArray()
    console.log("RAW ITEMS:", items)

    res.send(items)
})

// Get a single menu item
router.get('/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getMenu()
    const found = await collection.findOne({ _id: new ObjectId(id) })
    if (found) response.send(found)
    else response.send({ error: { message: `Could not find menu item with id: ${id}` }})
})

// Returns menu items
router.get('/', async (request, response) => {
    const collection = await getMenu()
    const found = await collection.find().toArray()
    if (found) response.send(found)
    else response.send({error: { message: `Could not find menu.` }})
})

// Add a menu item
router.post("/", async (request, response) => {
    const { url, name, description, price } = request.body
    const collection = await getMenu()
    const result = await collection.insertOne({ name, description, price: Number(price), url })
    response.send(result)
})

module.exports = router