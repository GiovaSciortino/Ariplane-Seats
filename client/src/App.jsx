import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';


import { React, useEffect, useState} from 'react';
import { Container} from 'react-bootstrap/'


import {Navigation} from './components/Navigation';
import { DefaultLayout, MainLayout, LoginLayout, LoadingLayout } from './components/PageLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import API from './API';
import { PLANES2} from './planes'


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [planes, setPlanes] = useState(PLANES2);
  const [dirty, setDirty] = useState(true);

  
  useEffect(() => {
    const init = async () => {
      try {
          setLoading(true);
          setPlanes(await API.listPlanes());
          const user = await API.getUserInfo();  
          setUser(user);
          setLoggedIn(true); setLoading(false);
      } catch (err) {
        setUser(null);
        setLoggedIn(false); setLoading(false);
      }
    };

    init();
  }, []);


  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <BrowserRouter>
       <Container fluid className='App'>
       <Navigation logout={handleLogout} user={user} loggedIn={loggedIn}/>
        
        <Routes>
          <Route path="/" element={ loading ? <LoadingLayout /> : <DefaultLayout planes={planes} /> } >
              <Route index element={<MainLayout planes={planes} dirty = {dirty}  setDirty = {setDirty} default={1} />} />
              <Route path = "/plane/:planeId" element = {<MainLayout planes={planes} dirty={dirty} setDirty={setDirty} loggedIn={loggedIn }default={0}/>}/>
          </Route>
        <Route path="/login" element={<LoginLayout login={handleLogin} />} />
        </Routes>
      </Container>
    </BrowserRouter>
   
  );
}

export default App;



