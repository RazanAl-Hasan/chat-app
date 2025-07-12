const express = require('express');
const connectToDB = require('./config/db');
const { extend } = require('joi');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// الاتصال بقاعدة البيانات
connectToDB();

// إنشاء التطبيق
const app = express();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`app running on PORT ${PORT}`);
});
