const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

// 3.7 Add morgan middleware to your application and configure it 
// to log messages to your console BASED ON the tiny config.

// app.use(morgan("tiny"));
// OR
// app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

// Morgan tiny config includes method, url, status, response content
// length, and response time. Configuring morgan to log to console
// BASED ON the tiny config

// 3.8 Configure morgan so that it also shows the data sent in HTTP POST reqeuests
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// Create new token for request body content, converts the JSON
// to a string, and returns it
morgan.token("body", function (req, res) {
    return [
        JSON.stringify(req.body)
    ];
});

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];


// 3.1: Return a hardcoded list of phonebook entries
app.get("/api/persons", (request, response) => {
    response.json(persons);
});

// 3.2: Implement a page that shows the time the request was received 
//and how many entries are in the phonebook at the time of the request
app.get("/api/info", (request, response) => {
    let dateOptions = {
        day: "numeric",
        weekday: "short",
        year: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "long",
        hour12: "false",
    }
    let dateStamp = new Date();
    // moment.js is deprecated
    let dateStampString = dateStamp.toLocaleDateString("en-US", dateOptions)
    let cleanDateStampString = dateStampString.replace(/, /g, " ");
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${cleanDateStampString}</p>`)
});

// 3.3: Display info for a signle phonebook entry and if the entry
// for the given id is not found, the server must respond with the 
// appropriate status code
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

// 3.4: Delete a single phonebook entry by making an HTTP DELETE 
// request to the unique URL of that phonebook entry
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
});

// 3.5: Create new phonebook entries using HTTP Post

// Generates random id number
function getRandomId() {
    return Math.floor(Math.random() * 100000)
}

app.post("/api/persons", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;
    const personExists = persons.find((person) => person.name === name)

    // 3.6 Implement error handling when creating new entries

    // Checks if either name or number is empty
    if (!name || !number) {
        return response.status(400).json({
            error: "missing name and/or number"
        });
    // Checks if name is already listed in phonebook
    } else if (personExists) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }
    // Creates the person object using the request properties
    const person = {
        id: getRandomId(),
        name: name,
        number: number
    };
    // Concatenates the new person to the persons array
    persons = persons.concat(person);
    response.json(person);

});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);