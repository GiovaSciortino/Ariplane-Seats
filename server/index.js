/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const { check, validationResult, } = require('express-validator'); // validation middleware

//const filmDao = require('./dao-films'); // module for accessing the films table in the DB
const userDao = require('./dao-users'); // module for accessing the user table in the DB
const asDao = require('./dao-as'); 

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        return res.status(200).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


function checkAvailSeat(SeatId){
  return asDao.checkOccupied(SeatId);
}


// GET /api/planes
// route used to retrieve all the planes
app.get('/api/planes', async (req, res) => {
  try {
      const planes = await asDao.listPlanes() ;
      res.json(planes) ;
  } catch(err) {
      res.status(500).json(err) ;
  } ;
})

//GET api/seats/:planeId
//route used to retrieve all the seats of a specified plane
app.get('/api/seats/:planeId', [check('planeId').isInt({min:1, max:3})], async(req, res) =>{
  const errors = validationResult(req).formatWith(errorFormatter) ;
  if(!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(', ') }) ;
  }

  try{
      const seats = await asDao.seatsPlane(req.params.planeId) ;
      if(seats.error)
          return res.status(404).json(page) ;
      res.status(200).json(seats) ;
  }catch(err) {
      res.status(500).json(err) ;
  };
});

app.get('/api/reservation/:planeId', [check('planeId').isInt({min:1, max:3})], async(req, res) =>{
  const errors = validationResult(req).formatWith(errorFormatter) ;
  if(!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(', ') }) ;
  }
  try{
      const seats = await asDao.seatsReserved(req.user.id, req.params.planeId) ;
      if(seats.error)
          return res.status(404).json(seats) ;
      else{res.status(200).json(seats) ;}
  }catch(err) {
      res.status(500).json(err) ;
  };
});


// PUT /api/seats
//This route change only the state of a specified seat


app.put('/api/seats/:planeId',
  isLoggedIn,
  [check('planeId').isInt({min:1, max:3})],
  async(req, res) =>{
    const seatsOccupied = [];
    const seatsIdList = req.body;
    let planeID = req.params.planeId;
    let occupied;
    // Check if list contains only integers
    let containsOnlyIntegers = seatsIdList.every(item => {
      return Number.isInteger(item);
    });
    
    if (!containsOnlyIntegers) {
      res.status(400).send("List contains non-integer values");   
    } else {
      const errors = validationResult(req).formatWith(errorFormatter); // format error message
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
      }
       try {
        const conflict = await asDao.seatsReserved(req.user.id, planeID) ;
        if(conflict.length > 0){
          res.status(200).json({}) ;  
        }else{
          for(const seatId of seatsIdList){
            occupied = await checkAvailSeat(seatId);
            if(occupied != 0){ /// diverso da 0 vuol dire occupato, ritorno il valore
              seatsOccupied.push(seatId);
            }
          }
  
          if(seatsOccupied.length == 0){
            for(const seatId of seatsIdList){
              await asDao.createReservation(req.user.id, seatId);
            }
  
          }
          res.status(200).json(seatsOccupied) ;
        }
        
       } catch (err) {
        res.status(503).send({ error: `Database error during the update of : ${err}` }) ;
       }
    }
});


app.put('/api/deletereservation/:planeId',
isLoggedIn,
[check('planeId').isInt({min:1, max:3})],
async(req, res) =>{
  let planeID = req.params.planeId;
  if (!Number.isInteger(planeID))
    planeID = parseInt(planeID, 10);
  const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
    }
     try {
      let response = await asDao.deleteReservation(req.user.id, planeID);
      if (response.error)
        res.status(404).json(response);
      else {res.status(200).json({});}
     } catch (err) {
      res.status(503).send({ error: `Database error during the update of : ${err}` }) ;
     }
});





// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
