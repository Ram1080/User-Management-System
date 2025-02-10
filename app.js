const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

let users;
try {
    users = require('./MOCK_DATA.json');
} catch (err) {
    users = [];
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.route('/users/:id').get((req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}).delete((req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        fs.writeFileSync(path.join(__dirname, 'MOCK_DATA.json'), JSON.stringify(users, null, 2));
        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender
    };

    users.push(newUser);
    fs.writeFileSync(path.join(__dirname, 'MOCK_DATA.json'), JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
});

const port = 9999;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
