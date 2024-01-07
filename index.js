const express = require('express')
const app = express()
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(express.json())
app.use(requestLogger)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-040-123456"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "39-44-123456"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-642456"
    }
]




app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const time = new Date();
    response.send('<p>Phonebook has info for ' + persons.length + ' people</p><p>Time is: ' + time + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

  })

  const idGen = () => {return Math.floor(Math.random() * 10000);}
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
    })
    }
    const samePerson = persons.find(p => p.name === body.name)

    if (samePerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: idGen(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })


  
  app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})