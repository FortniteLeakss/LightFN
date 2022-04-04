const express = require('express');
const app = express();
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const config = require('../fortnite');


app.get('/library/api/public/items', (req, res) => {
res.json(require("../library.json"))
});


module.exports = app;