import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Container, Row, Col, Form , Badge, ListGroup} from 'react-bootstrap';
import { SelectForm } from './SelectForm';


import API from '../API';


let currentPrenotation = [];


const SeatsMap = (props) => {
  let seats = props.Seats;
  let nrows = props.nrows;
  let ncols = props.ncols;   
  let setSeats = props.setSeats;

  const planeID = props.planeID;
  const loggedIn = props.loggedIn


  const [srows, setSrows] = useState([]);
  const [invalidSeats, setInvalidSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [dirty, setDirty] = useState(false);
  const availSeats = srows.flat().filter(seat => seat.isClicked === 0).length;
  const selectedSeats = srows.flat().filter(seat => seat.isClicked === 1).length;
  const occupiedSeats = srows.flat().filter(seat => seat.isClicked === 2).length;

  function generateSeatGrid(seats, nrows, ncols) {
    const seatGrid = Array.from({ length: nrows }, () =>
      Array.from({ length: ncols }, () => null)
    );
  
    for (let i = 0; i < seats.length; i++) {
      const row = Math.floor(i / ncols);
      const col = i % ncols;
      if (row >= nrows) {
        break;
      }
      seatGrid[row][col] = seats[i];
    }
  
    return seatGrid;
  }
  
  useEffect(() => {
    const init = async() =>{
      let matrix = generateSeatGrid(seats, nrows, ncols);
      setSrows(matrix);
      currentPrenotation=[];
      if(loggedIn)
        setReservedSeats(await API.getReservations(planeID));
      setDirty(false);
    }
    if (dirty)
      init();
  }, [seats, dirty]);

  useEffect(() =>{
      const init = async() =>{
        const tempSeats = seats;
        if (invalidSeats.length===0){
          setSeats(await API.listSeats(planeID));
          setDirty(true);
        }else {
          for (const invalidId of invalidSeats) {
            const pos = tempSeats.find((seat) => seat.id === invalidId);
            if (pos) 
              pos.isClicked = 3;
            setSeats(tempSeats);  
            setDirty(true);
        }}

      }
     init();
   }, [invalidSeats]);

  const handleSubmitButtons = async () => {
    try {

      const response = await API.createReservations(currentPrenotation, planeID);
      if (response.length === 0) {
        setSeats(await API.listSeats(planeID));
        setDirty(true);
      } else {
        setInvalidSeats(response);
        setTimeout(function() {
          setInvalidSeats([]);

        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = async () =>{
    if(loggedIn)
      await API.getReservations(planeID);
    setDirty(true);
}

  const handleDelete = async () =>{
      let temp = await API.deleteReservation(currentPrenotation, planeID);
      setSeats(await API.listSeats(planeID));
      setReservedSeats([]);
      setDirty(true);
  }


  const switchState = (id, index) => {
    const updateSeatState = (seat, seatIndex) => {
      if (seatIndex === id && seat.isClicked !== 2) {
        const seatId = seat.id;
        const index = currentPrenotation.indexOf(seatId);
        if (index === -1) {
          currentPrenotation.push(seatId);
        } else {
          currentPrenotation = currentPrenotation.reduce((acc, element, idx) => {
            if (idx !== index) {
              acc.push(element);
            }
            return acc;
          }, []);
        }
        return {
          ...seat,
          isClicked: seat.isClicked === 0 ? 1 : 0,
        };
      }
      return seat;
    };
  
    const updateRowState = (row, rowIndex) =>
      rowIndex === index ? row.map(updateSeatState) : row;
  
    const updatedSrows = srows.map(updateRowState);
  
    setSrows(updatedSrows);
  };

  return (
    <Container>
      <Row className='justify-content-left mt-4'>
        {loggedIn ? (<>
        <h2>List of seats reserved displayed below (if any):</h2>
        <ListGroup variant="flush">
          {reservedSeats.map((seat) => (
            <ListGroup.Item key={seat.id} variant="primary">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{seat.pos}</h5>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        </>) : (<></>)
        }
      </Row>
      <Row className='justify-content-left mt-4'>
        <Col>
          <p>Available Seats: <Badge bg="secondary">{availSeats}</Badge></p>
        </Col>
        {loggedIn ? (<Col>
          <p>Selected Seats: <Badge bg="secondary">{selectedSeats}</Badge></p>
        </Col>):(<></>)}
        <Col>
          <p>Occupied Seats: <Badge bg="secondary">{occupiedSeats}</Badge></p>
        </Col>
      </Row>

      <Container className="mt-4">
        {srows.map((row, rowIndex) => (
          <Row key={rowIndex} className="justify-content-center my-2">
            {row.map((seat, colIndex) => {
              let variantColor = "light";
              let buttonText = "Select";
              
              switch (seat.isClicked) {
                case 0:
                  variantColor = "success";
                  buttonText = "Select";
                  break;
                case 1:
                  variantColor = "warning";
                  buttonText = "Selected";
                  break;
                case 2:
                  variantColor = "danger";
                  buttonText = "Taken";
                  break;
                case 3:
                  variantColor = "info";
                  buttonText = "Reserved";
                  break;
                default:
                  break;
              }

              return (
                <Col key={colIndex} className="text-center">
                  <ButtonGroup>
                    <Button variant="light" disabled>
                      {seat.pos}
                    </Button>
                    <Button
                      variant={variantColor}
                      onClick={() => switchState(colIndex, rowIndex)}
                      disabled={seat.isClicked === 2 || seat.isClicked === 3 || !loggedIn}
                    >
                      {buttonText}
                    </Button>
                  </ButtonGroup>
                </Col>
              );
            })}
          </Row>
        ))}
      </Container>
      {loggedIn ? (<>
        <Row className="justify-content-center my-4">
        <Col>
          <Form noValidate onClick={handleSubmitButtons}>
            <Button variant="success" disabled={!loggedIn || (loggedIn && reservedSeats.length)}>
             Confirm
            </Button>
          </Form>
        </Col>
        <Col>
          <Form noValidate onClick={handleReset}>
            <Button  variant="warning" disabled={!loggedIn || (loggedIn && reservedSeats.length)}>
             Reset
            </Button>
          </Form>
        </Col>
        <Col>
        <Form noValidate onClick={handleDelete}>
            <Button variant="danger" disabled={!loggedIn || (loggedIn && !reservedSeats.length)}>
             Delete Reservation
            </Button> 
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4"> 
        <SelectForm numSeats={availSeats} reservedSeats={reservedSeats} setDirty={setDirty }seats={seats} setInvalidSeats={setInvalidSeats} planeID={planeID} loggedIn={loggedIn}/>
      </Row>
      
      </>) : (<></>)}
    </Container>
  );
};
export { SeatsMap };