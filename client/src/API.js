
const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}



//list of all planes contained in the database
const listPlanes = async () => {
  return getJson(fetch(SERVER_URL + 'planes')).then((json) => json.map((plane) => {
      const singlePlane = {
          id: plane.id,
          name: plane.name,
          nrows: plane.n_rows,
          ncols: plane.n_cols,
      }
      return singlePlane;
  })) ;
}


//list of all seats given a planeId
const listSeats = async (planeId) => {
  return getJson(fetch(SERVER_URL + 'seats/' + planeId, { credentials: 'include' })).then((json) => json.map((seat)=>{
    const singleSeat = {
      id: seat.id,
      pos: seat.name,
      isClicked: seat.occupied,
    }
    return singleSeat;
  }));
} 


const createReservations = (seatsList, planeId) => {
  return getJson(fetch(SERVER_URL + 'seats/'+ planeId,{
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(seatsList)
  })) ;
} 

const getReservations = async (planeId) =>{
  return getJson(fetch(SERVER_URL + 'reservation/' + planeId, { credentials: 'include' })).then((json) => json.map((seat)=>{
    const singleSeat = {
      id: seat.id,
      pos: seat.name,
    }
    return singleSeat;
  }));

}


const deleteReservation = (seatsList, planeId) => {
  return getJson(fetch(SERVER_URL + 'deletereservation/'+ planeId,{
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify()
})) ;
};

/************************** USER **************************** */
/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}

const API = {logIn, getUserInfo, logOut, listPlanes, listSeats, createReservations, deleteReservation, getReservations};
export default API;
