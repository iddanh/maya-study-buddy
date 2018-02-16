'use strict';

const express = require('express');
const path = require('path');
const app = express();
const cloudinary = require('cloudinary');

app.use(express.static('app'));

cloudinary.config({
	cloud_name: 'hdzc7seee',
	api_key: '368627986173271',
	api_secret: 't5CY20XAH58FpmJxAwXPMagdN3Q'
});

app.get('/images', (req, res) => {
	cloudinary.v2.api.resources({max_results: 500}, function (error, result) {
		result.resources.splice(0, 1);
		res.json(result);
	});
});


app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const port = process.env.PORT || 80;
app.listen(port, () => console.log('listening on port 3000!'));