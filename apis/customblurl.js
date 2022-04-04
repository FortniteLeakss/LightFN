const express = require('express');
const app = express();
const fs = require('fs');
const config = require('../fortnite');

app.get("/:videoid/master.blurl", (req, res) => {
  if (fs.existsSync(`${__dirname}/Accounts/blurl/${req.params.videoid}/master.blurl`)) {
    res.setHeader("content-type", "application/octet-stream")
    res.sendFile(`${__dirname}/Accounts/blurl/${req.params.videoid}/master.blurl`)
  }
})

module.exports = app;