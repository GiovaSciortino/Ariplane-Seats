import {React,useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';

import { LoginForm } from './Auth';


import {SeatsMap } from './SeatsMap';
import {SideBar} from './SideBar';
import { useParams, Outlet } from 'react-router-dom';
import API from '../API';

function DefaultLayout(props){
  const planes = props.planes;
  const activePlane = props.activePlane;

  return (    
        <>
        <Row className="vh-100">
            <Col md={4} xl={3} bg="light" className="below-nav" id="left-sidebar">
              <SideBar planes={planes} activePlane={activePlane}/>
            </Col>
            <Col md={8} xl={9} className="below-nav">
                <Outlet/>
        </Col>
       </Row>
       
        </>    
    );
}




const LoadingLayout = () => {
  return (
      <Row className="center-position">
          <Col>
              <Spinner animation="border" role="status" variant="secondary" size="lg">
                  <span className="visually-hidden">Loading...</span>
              </Spinner>
          </Col>
      </Row>
  ) ;
}



function MainLayout(props){
 
  let planes = props.planes;
  const dirty = props.dirty;
  const setDirty = props.setDirty;
  const [seats, setSeats] = useState([]);
  const [nrows, setNrows] = useState(0);
  const [ncols, setNcols] = useState(0);
  const loggedIn = props.loggedIn;




  const {planeId} = useParams();
 
  let activePlaneID_int;
  if (props.default){
     activePlaneID_int = 1;
  } else{
    activePlaneID_int = parseInt(planeId, 10);
  }

  useEffect(() => {
    setDirty(true);
  }, [planeId]);

  useEffect(() => {//prova
    const init = async () =>{
      try {
        //// righe da invertire
        setSeats(await API.listSeats(activePlaneID_int));
        setNrows(planes[activePlaneID_int-1].nrows);
        setNcols(planes[activePlaneID_int-1].ncols);  

        setDirty(false);
      } catch (err) {
        setDirty(false);
      }
    }
    if (dirty) {
      init();
    }
  }, [planeId,  dirty]);


  if (props.default==1) {
      return (
      <>
        <Row className="my-5">
          <Col>
            <h1>Book Your Seats on a Plane</h1>
            <p>Welcome to our plane booking application! Here, you can easily book your seat on a plane and choose from a variety of options to make your trip comfortable and enjoyable. </p>
          </Col>
        </Row>
      </>
      );
    } 
    else{
   return(
    <>
      { dirty ? <LoadingLayout/> :
      <SeatsMap Seats={seats} setSeats={setSeats}nrows={nrows} ncols={ncols} planeID={activePlaneID_int} loggedIn={loggedIn}/>}
       </>  
      );
    }
    
}



function LoginLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <LoginForm login={props.login} />
      </Col>
    </Row>
  );
}


export {DefaultLayout, MainLayout, LoadingLayout, LoginLayout};