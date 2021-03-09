const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2];
const name = process.argv[3]; // retrieve the name from the command line
const number = process.argv[4];  // retrieve the number from the command line

const url =
  `mongodb+srv://AssafK-98:${password}@cluster0.s1n1m.mongodb.net/PhoneBook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({ // defines how a person object should look
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema) // attaches the schema with the name 'Person' to a model

if(process.argv.length <= 3){ // If no name or number been provided
    Person.find({}).then(result => { // find and display the content of the phonebook in the terminal
        console.log('PhoneBook:');
        result.forEach(person => {
          console.log(person.name, person.number);
        })
        mongoose.connection.close()
      })
} else {   
    const person = new Person({
        name: name,
        number: number, 
    })
    
    person.save().then(result => {
        console.log(`Added ${name} to PhoneBook`);
        mongoose.connection.close()
    })
}