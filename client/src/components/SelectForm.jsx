import { useState } from 'react';
import { Form, Row, Button } from 'react-bootstrap';

import API from '../API';



const SelectForm = (props) => {
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const seats = props.seats;
  const numSeats = props.numSeats;
  const setInvalidSeats = props.setInvalidSeats;
  const setDirty = props.setDirty;
  const loggedIn = props.loggedIn;
  const reservedSeats = props.reservedSeats;
  const planeID = props.planeID;

  


  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const Nseats = parseInt(form.elements.seats.value, 10);
      if (Nseats <= numSeats) {
        setErrorMessage('');
        setInvalidSeats(await API.createReservations(assignSeats(Nseats), planeID));
        setTimeout(function() {
          setInvalidSeats([]);

        }, 1000);
      } else {
        setErrorMessage(`Max ${numSeats} seats available!`);

      }
    }
    setDirty(true);
    setValidated(true);
  };

  const handleBackToSelection = () => {
    setErrorMessage('');
  };



  const assignSeats = (n) => {
    let assignedCount = 0;
    let changed = [];
    for (const seat of seats) {
      if (seat.isClicked === 0) {
        changed.push(seat.id);
        assignedCount++;
  
        if (assignedCount === n) {
          break; 
        }
      }
    }
    return changed;
  }
  console.log()

  return (
    <>
<Form noValidate validated={validated} onSubmit={handleSubmit}>
  <Row className="mb-2">
    <Form.Group controlId="validationCustom01">
      <Form.Label>Select how many seats you need</Form.Label>
      <Form.Control
        required
        type="number"
        name="seats"
        min="1"
        defaultValue=""
      />
    </Form.Group>
  </Row>
  <Button type="submit" disabled={!loggedIn || (loggedIn && reservedSeats.length)}>
    Submit form
  </Button>
</Form>


      {errorMessage && (
        <div>
          <p>{errorMessage}</p>
          <Button onClick={handleBackToSelection}>Back to Selection</Button>
        </div>
      )}
    </>
  );
}

export {SelectForm};