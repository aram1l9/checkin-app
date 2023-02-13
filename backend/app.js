const express = require('express')
require('dotenv').config()
const cors = require('cors')
const config = require('./knexfile')

const knex = require('knex')(config);

const app = express()
app.use(cors())


app.get('/', (req,res) => {
    return res.send('Alive')
})

app.get('/api/places', (req,res) => {
  knex.select('*').from('places').then(response => {
    return res.status(200).json(response)
  })
})


app.post('/api/places', async (req, res) => {
    const userId = req.body.userId

    const placeId = req.body.placeId

    try {
       await knex('places')
            .where('id', placeId)
            .update({
                'user_id': userId
            })

        return res.status(201).json({success:true})
    } catch(err){
        console.log(err)
        return res.status(400).json(err)
    }
})


app.listen(4000)