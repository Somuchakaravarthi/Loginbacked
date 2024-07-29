
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const nodemailer = require('nodemailer');
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend URL
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
const db = require('./db');
const { password } = require('./dbConfig');
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};
const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: process.env.EMAIL,
    pass:'tblqfezxmvddrdtr'
  }
});
transporter.sendMail({
  to:'jjshree831@gmail.com',
  subject:'Vanakkam',
  html:'<h1>Hlooo Elukalutha </h1>'
}).then(()=>{
  console.log('email sent');
}).catch(err=>{
  console.log(err);
})

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
app.use(express.json());
app.use(cors(corsOptions));
app.get('/', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
});

app.post('/add-user', async (req, res) => {
  try {
    const { name,password, email } = req.body;
      if (!name || !password || !email) {
      return res.status(500).send('Name, password, and email are required.');
    }
    const userExists=await db.userExists(name)
      if (userExists) {
      return res.status(400).send('Username already exists.');
    }
    const emailExsist=await db.emailExists(email)
    if(emailExsist){
        return res.status(400).send('Email already exists.'); 
    }
    await db.addUser(name,password, email);
    res.status(201).send('User added successfully');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Error adding user');
  }
});
app.post('/login',async(req,res)=>{
    try{
          const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }
        const Login=await db.login(username,password)
        if(Login){
            return res.status(200).send('Login successful');
        }
        else{
            return res.status(500).send('Invalid Username or Password');
        }
    }catch(err){
          res.status(500).send('Error adding user');
    }
})

// app.post('/add-user', async (req, res) => {
//   try {
//     console.log('Request body:', req.body); // Log the request body

//     const { name, password, email } = req.body;

//     if (!name || !password || !email) {
//       return res.status(400).send('Name, password, and email are required.');
//     }

//     console.log('Received data:', { name, password, email });

//     await db.addUser(name, password, email);
//     res.status(201).send('User added successfully');
//   } catch (err) {
//     console.error('Error adding user:', err);
//     res.status(500).send(`Error adding user: ${err.message}`);
//   }
// });
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const otp = generateOtp();
  try {
    await sendOtpEmail(email, otp);
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
