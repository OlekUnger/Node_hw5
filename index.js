const app = require('./app')
// const http = require('http');
// const server = http.createServer(app);
// const io = require('socket.io').listen(server);
// require('./config/soket')(io)

const port = process.env.PORT || 4200
app.listen(port, () => console.log(`Server running on port ${port}`))