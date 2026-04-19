const router = require('express').Router()
const { getCollection, ObjectId } = require('../../../dbconnect')

let collection = null
const getEvents = async () => {
    if (!collection) collection = await getCollection('FoodTruckAPI', 'events')
        return collection
}   

router.get('/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getEvents()
    const found = await collection.findOne({ _id: new ObjectId(id) })
    if (found) response.send(found)
    else response.send({ error: { message: `Could not find event with id: ${id}` }})
})

router.get('/', async (request, response) => {
    const collection = await getEvents()
    const found = await collection.find().toArray()
    if (found) response.send(found)
    else response.send({error: { message: `Could not find events.` }})
})

router.post("/", async (request, response) => {
    const { name, location, date, time } = request.body
    const collection = await getEvents()
    const result = await collection.insertOne({ name, location, date, time })
    const { acknowledged, insertedId } = result
    response.send({ acknowledged, insertedId })
})


module.exports = router