const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');




const PORT = process.env.PORT || 5000;
connectDB(); // connect to MongoDB

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});