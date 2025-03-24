const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;

const limiter = rateLimit({
    windowMs: 15. * 60 * 1000, //15 minutos
    max: 100,
    message: 'Te pasaste socio.',
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const randomNumber = Math.floor(Math.random() * 9999);
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static('public'));
const fs = require('fs');
const path = require('path');

const passwordList = fs.readFileSync(path.join(__dirname, 'passwords.txt'), 'utf-8').split('\n');

const randomElementFromArray = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

const createUser = (n) => {
    const users = [];
    users.push({
        username: "admin",
        password: randomElementFromArray(passwordList)
    })
    for (let i = 0; i < n; i++) {
        const username = randomElementFromArray(passwordList);
        const password = randomElementFromArray(passwordList);
        users.push({ username, password });
    }
    return users;
}

const users = createUser(10); // Crear una lista de usuarios

console.log(`Random number: ${randomNumber}`);
console.log(`Users: ${JSON.stringify(users)}`);
app.get(`/${randomNumber}`, (req, res) => {
    res.send("The flag is guacamole")
});

app.post('/api/login', limiter, (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json({ success: true, redirectUrl: `/${randomNumber}` });
    } else {
        res.status(401).json({ message: 'Invalid username or password', success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});