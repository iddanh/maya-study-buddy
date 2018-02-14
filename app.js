'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('app'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const port = process.env.PORT || 80;
app.listen(port, () => console.log('listening on port 3000!'));