"use strict"
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body);
})

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] :response-time ms :req-body'));

const phonebook = [
    {
        id: 1,
        name: 'Assaf',
        number: '050-4376818'
    },
    {
        id: 2,
        name: 'Ora',
        number: '050-5317886'
    },
    {
        id: 3,
        name: 'Yoav',
        number: '050-3731688'
    },
    {
        id: 4,
        name: 'Hanan',
        number: '054-2585082'
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
});

app.get('/info', (req, res) => {
    res.send(`<p>PhoneBook has ${phonebook.length} contacts in it</p><p>${new Date()}</p>`)
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = phonebook.find(p => p.id === id);
    if(!person) return res.status(404).send('<h1>ID Not Found</h1>')
    res.json(phonebook[id-1]);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = phonebook.findIndex(p => p.id === id);
    if(index >= 0) phonebook.splice(index, 1);
    res.json({message: 'success', phonebook: phonebook});
});

app.post('/api/persons', (req, res) => {
    const { body } = req;

    if(!body.name || !body.number) return res.status(400).json({message: "can't add a contact without a name or number"});
    const person = phonebook.find(p => p.name === body.name);
    if(person) return res.status(200).json({ error: 'name must be unique' })
    
    body.id = Math.floor(Math.random() * 1000);
    phonebook.push(body);
    res.json({body: body, message: "success"})
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});