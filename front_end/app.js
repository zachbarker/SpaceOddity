const http = require('http')
const express = require('express')
const app = express()
const hostname = '127.0.0.1'
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname + '/'))

app.get('/', function(req, res) {
  res.statusCode = 200
  // res.setHeader('Content-Type', 'text/plain')
  res.sendFile('index.html', {root: __dirname})
})

app.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`)
})
