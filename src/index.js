const express = require('express');
const { createServer } = require('http');
const path = require('path');

const app = express();
const server = createServer(app);


const port = 80;
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

  // Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});