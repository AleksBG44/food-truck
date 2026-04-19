const router = require('express').Router()
const { request, response } = require('express')
const { getCollection, ObjectId } = require('../../../dbconnect')

let collection = null
const getMenu = async () => {
    if (!collection) collection = await getCollection('FoodTruckAPI', 'menu')
        return collection
}   

router.get('/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getMenu()
    const found = await collection.findOne({ _id: new ObjectId(id) })
    if (found) response.send(found)
    else response.send({ error: { message: `Could not find menu item with id: ${id}` }})
})

router.get('/', async (request, response) => {
    const collection = await getMenu()
    const found = await collection.find().toArray()
    if (found) response.send(found)
    else response.send({error: { message: `Could not find menu.` }})
})

router.post("/", async (request, response) => {
    const { name, description, price, url } = request.body
    const collection = await getMenu()
    const result = await collection.insertOne({ name, description, price, url })
    const { acknowledged, insertedId } = result
    response.send({ acknowledged, insertedId })
})

module.exports = router