const express = require('express');
const session = require('express-session')
const cors = require('cors');
require('dotenv').config();

const authRoutes =require('./routes/authRoute')
const connectDB = require('./config/db');
const { isAuthenticated, isRole } = require('./middleware/authMiddleware');
const employeRoute =require('./routes/employeRoute');
const adminRoute =require('./routes/adminRoute');


const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({limit: '20mb', extended: true }));


app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true // Permite el envío de cookies
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Cambia a `true` si usas HTTPS
      httpOnly: true,
      sameSite: 'lax' // Asegura que las cookies se envíen entre subdominios
  },
}));



// Conecta a la base de datos y luego inicia el servidor
connectDB().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is up and running on port : ${port}`);
    });
  }).catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });



app.use('/auth', authRoutes);

app.use('/employe',isAuthenticated, employeRoute)
app.use('/admin',isAuthenticated, isRole("ADMIN"), adminRoute)



