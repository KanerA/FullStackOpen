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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});