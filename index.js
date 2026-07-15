import express from 'express';
import mongoose from 'mongoose';
import Account from './model/Account.js'
import FacultyProfile from './model/FacultyProfile.js';
import StudentProfile from './model/StudentProfile.js';
import nodemailer from 'nodemailer'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import path from 'path'
import { dirname } from 'path'


const app = express();
const port = process.env.PORT;
const baseUrl = process.env.BASE_URL
const MASTER_KEY = process.env.SECRET_KEY
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  await mongoose.connect(process.env.DATABASE_STRING)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  console.log("Connected to database")
} catch (error) {
  console.log("Database connection failed", error)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_APP_PASSKEY
  }
})
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
app.set('view engine', 'ejs');

//custom middleware for verifying the token send by /dashboard at endpoint logInRequestEndPoint
async function verifyToken(req, res, next) {
  let authHeader = req.headers.authorization
  let tokenReceived = authHeader && authHeader.split(" ")[1]

  if (!tokenReceived) {
    return res.status(401).json({ "error": "Access denied no token provided", status: 400 })
  }
  //verifying the token
  try {
    let checkUserId = jwt.verify(tokenReceived, MASTER_KEY)
    req.userId = checkUserId.userId
    next()
  } catch (error) {
    
    res.status(400).json({ "error": "invalid token", status: 400 })
  }



}

app.get('/', (req, res) => {
  res.send('express server');
});

app.post('/signUp', async (req, res) => {

  //error handling
  if (!req.body.email || !req.body.userName || !req.body.password) {
    return res.status(400).json({ "error": "invalid input data" })
  }

  //checking if the user already exits or not
  let isUserExits = await Account.findOne({
    $or: [{ userName: req.body.userName }, { userEmail: req.body.email }]
  })
  if (isUserExits) {
    return res.status(409).json({ "error": "username or email already exists", 'status': 409 })
  }


  try {

    //password hashing
    let hashedPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hashedPassword

    //temporarily stroing in database
    let userAccount = await Account.create(
      {
        userEmail: req.body.email,
        userName: req.body.userName,
        password: req.body.password
      }
    )

    let tempToken = jwt.sign({ userId: userAccount._id }, MASTER_KEY, { expiresIn: '15m' })
    let emailVerificationUrl = `${baseUrl}/emailverification?token=${tempToken}`

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: userAccount.userEmail,
      subject: "verify your email address for Caenex account",
      html:
        `
      <h1> Welcome to Caenex </h1>
      <h3> A platform for finding and booking available academic spaces in real time </h3>
      <p> 
          <a href="${emailVerificationUrl}">Click here </a> to verify your email address and further proceed to make your Caenex account
      </p>
      <p>This link will expire in 15 minutes. </p>
      `

    }
    await transporter.sendMail(mailOptions)

    res.status(201).json({ "message": "account created successfully. Check your email to verify and  proceed further", 'status': 201 })
    console.log("succesfully created account")
  } catch (error) {
    await Account.deleteOne({ userName: req.body.userName })
    res.status(500).json({ "error": "Internal Server Error. Failed to create account. Try again!", 'status': 500 })
    console.log(error)

  }



})

//route for the user when user clicks the link sent via email
app.get('/emailverification', async (req, res) => {

  let receivedToken = req.query.token
  if (!receivedToken) {


    return res.status(401).render('email-verification-failed-page', { errorTitle: "Email verification failed", errorMessage: null, tryMessage: "Please try again", link: `${baseUrl}/#tablet-display-content` });
  }

  try {// trying to verify the token
    let decoded = jwt.verify(receivedToken, MASTER_KEY) //returns an object which contains mongodb id

    //checking if the profile is already saved then prevent the user from entering into this endpoint again
    let account = await Account.findById(decoded.userId)
    if (!account) {
      return res.status(404).json({ "message": "account not found", status: 404 })
    }
    let isProfileAlreadySaved = account.isDetailsFilled
    if (isProfileAlreadySaved) {
      return res.status(409).render('email-verification-failed-page', { errorTitle: "Profile Already Saved", errorMessage: "This link has already been used and is now expired", tryMessage: "Please login through the login portal", link: `${baseUrl}/#tablet-display-content` });
    }


    //logic for serving the user verification_userProfile page
    console.log(decoded)
    await Account.findByIdAndUpdate(decoded.userId, { isEmailVerified: true })

    let tempLinkingToken = jwt.sign({ userId: decoded.userId }, MASTER_KEY, { expiresIn: '15m' })
    res.render('verification_userProfile', { linkingToken: tempLinkingToken })

  } catch (error) {

    return res.status(400).render('email-verification-failed-page', { errorTitle: "Email verification failed ", errorMessage: "Verification link expired or invalid", tryMessage: "Please try again", link: `${baseUrl}/#tablet-display-content` });
  }

})

//post request by studentProfileInfo after verifying email
app.post('/studentProfileInfoEndpoint', async (req, res) => {

  let receivedTempLinkingToken = req.body.linkingToken
  console.log("receivedTempLinkingToken = ", receivedTempLinkingToken)
  if (!receivedTempLinkingToken) {
    return res.status(400).json('no linking token provided')
  }



  try {
    let decoded = jwt.verify(receivedTempLinkingToken, MASTER_KEY)
    console.log("decoded = ", decoded)

    //checking if the profile is already saved then prevent the user from entering into this endpoint again
    let account = await Account.findById(decoded.userId)
    if (!account) {
      return res.status(404).json({ "message": "account not found", status: 404 })
    }
    let isProfileAlreadySaved = account.isDetailsFilled
    if (isProfileAlreadySaved) {
      return res.status(409).render('email-verification-failed-page', { errorTitle: "Profile Already Saved", errorMessage: "This link has already been used and is now expired", tryMessage: "Please login through the login portal", link: `${baseUrl}/#tablet-display-content` });
    }


    //creating the studentProfile 
    let studentProfile = await StudentProfile.create(
      {
        "accountID": decoded.userId,
        "role": "student",
        "name": req.body.name,
        "gender": req.body.gender,
        "rollNumber": req.body.rollNumber,
        "branch": req.body.branch,
        "academicYear": req.body.academicYear,
        "studentPhoneNumber": req.body.studentPhoneNumber

      }

    )
    console.log("student Profile = ", studentProfile)


    await Account.findByIdAndUpdate(decoded.userId, { isDetailsFilled: true , isSetUpComplete : true })

    res.json("successfully made the userProfile")


  } catch (error) {
    res.status(500).json("failed to create studentProfile")
    console.log(error)
  }

})

//post request by studentProfileInfo after verifying email
app.post('/facultyProfileInfoEndpoint', async (req, res) => {

  let receivedTempLinkingToken = req.body.linkingToken

  if (!receivedTempLinkingToken) {
    return res.status(400).json({ "message": "no linking token provided", status: 400 })
  }

  try {
    let decoded = jwt.verify(receivedTempLinkingToken, MASTER_KEY)

    //checking if the profile is already saved then prevent the user from entering into this endpoint again
    let account = await Account.findById(decoded.userId)
    if (!account) {
      return res.status(404).json({ "message": "account not found", status: 404 })
    }
    let isProfileAlreadySaved = account.isDetailsFilled
    if (isProfileAlreadySaved) {
      return res.status(409).render('email-verification-failed-page', { errorTitle: "Profile Already Saved", errorMessage: "This link has already been used and is now expired", tryMessage: "Please login through the login portal", link: `${baseUrl}/#tablet-display-content` });
    }

    let facultyProfile = await FacultyProfile.create(
      {
        'accountID': decoded.userId,
        'role': 'faculty',
        'title': req.body.title,
        'name': req.body.name,
        'facultyID': req.body.facultyID,
        'department': req.body.department,
        'designation': req.body.designation,
        'facultyPhoneNumber': req.body.facultyPhoneNumber,

      }
    )

    await Account.findByIdAndUpdate(decoded.userId, { isDetailsFilled: true , isSetUpComplete : true})

    res.json("successfully made the userprofile")

  } catch (error) {
    res.status(500).json("failed to create userProfile for faculty")
    console.log(error)

  }
})

//handling post request for for login
app.post('/userLogInPostEndPoint', async (req, res) => {
  try {
    //error handling
    if (!req.body.loginUserName || !req.body.loginPassword) {
      return res.status(400).json({ "message": "missing fields", status: 400 })
    }
    
    let loginUserName = req.body.loginUserName
    let loginPassword = req.body.loginPassword
    let userInfo = await Account.findOne({ "userName": loginUserName })

    if (!userInfo) {
      return res.status(401).json({ "message": "invalid username or password", status: 401 })
    }


    let isPasswordCorrect = await bcrypt.compare(loginPassword, userInfo.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({ "message": "invalid username or password", status: 401 })
    }

    //error handling if details or email is not verified
    if(!userInfo.isSetUpComplete){
      return res.status(401).json({"message" : "please verify your Email and complete your user Profile  before login" , status : 401})
    }

    let token = jwt.sign({ userId: userInfo._id }, MASTER_KEY, { expiresIn: "1h" })

    res.json({ token: token, redirect: '/dashboard' })

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal server error")
  }

})

app.get('/dashboard', (req, res) => {
  res.render('dashboard')

})


//handling and checking the token sent by the dashboard frontened js and if it's correct then responding or serving the user data
app.get("/logInRequestEndPoint",verifyToken, async (req, res) => {
  let userId  = req.userId
 let userAccountInfo = await Account.findById(userId)

 let userProfileInfo = (await FacultyProfile.findOne({'accountID' : userId})) || (await StudentProfile.findOne({'accountID' : userId}))

  res.json(`Welcome ${userProfileInfo}`)

})

app.get("/page" ,(req, res) => {
  res.render("page")
})
