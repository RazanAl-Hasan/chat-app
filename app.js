const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const Message = require('./models/messageModel');

dotenv.config();
connectToDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/chat', (req, res) => {
  res.render('chat');
});

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // إرسال الرسائل السابقة
  const messages = await Message.find().sort({ createdAt: 1 });
  messages.forEach((msg) => {
    socket.emit('message', { text: msg.text });
  });

  // استلام رسالة جديدة
  socket.on('message', async (text) => {
    const msg = new Message({ senderId: socket.id, text });
    await msg.save();
    io.emit('message', { text }); // بث لجميع المستخدمين
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
