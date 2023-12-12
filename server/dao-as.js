'use strict';

const db = require('./db');


//function used to retrieve all the planes listed in the database
exports.listPlanes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM planes' ;
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err) ;
            else {
                resolve(rows) ;
            }
        }) ;
    }) ;
};

//function used to retrieve all the seats referred to a single plane
exports.seatsPlane = (planeId) =>{
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM seats WHERE plane_id = ?'
        db.all(sql, [planeId], (err, rows) => {
            if(err)
                reject(err) ;
            else {
                if(rows.length === 0)
                    resolve({ error: 'Page not found' }) ;
                else
                    resolve(rows) ;
            }
        }) ;

    })
};

exports.seatsReserved = (userId, planeId) =>{
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM seats WHERE user_id=? AND plane_id=?';
    db.all(sql, [userId, planeId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
  


//function to check if a seat is occupied or not
exports.checkOccupied = (seatId) =>{
  return new Promise((resolve, reject) => {
    const sql = 'SELECT occupied FROM seats WHERE id = ?' ;
    db.get(sql, [seatId], (err, row) => {
        if(err)
            reject(err) ;
        else {
            resolve(row.occupied) ;
        }
    }) ;
  });
};


exports.deleteReservation = (userId, planeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE seats SET user_id=NULL, occupied=0 WHERE user_id=? AND plane_id=?';
    db.all(sql, [userId, planeId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(planeId);
      }
    });
  });
};



exports.createReservation = (userId, seatId) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'UPDATE seats SET user_id=?, occupied=? WHERE id=?';
        db.all(sql, [userId, 2, seatId], function (err) {
          if (err) {
            reject(err);
          }
          if (this.changes !== 1) {
            resolve({ error: 'No seat is updated' });
          } else {
            resolve(id); 
          }
        });

    });
};





















