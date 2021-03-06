"use strict"
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
const cors = require('cors');
const Person = require('../models/person');

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body);
})

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] :response-time ms :req-body'));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
  }
  
  app.use(errorHandler)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people);
    })
});

app.get('/info', (req, res) => {
    Person.find({})
        .then(people => {
            res.send(`<p>PhoneBook has ${people.length} contacts in it</p><p>${new Date()}</p>`)
        })
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
        console.log(person);
        if (person) {
            res.json(person)
          } else {
            res.status(404).end()
          }
      })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
    const { body } = req;

    if(body.number === undefined){
        return res.status(400).json({ error: 'number is missing' });
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
    .then(savedPerson => {
        res.json(savedPerson);
    })
    .catch(error => next(error))
});

app.put('/api/persons/:id', (req, res) => {
    const body = req.body;
    const person = {
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});