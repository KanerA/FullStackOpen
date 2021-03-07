"use strict"
const express = require('express');
const app = express();

app.use(express.json());

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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});