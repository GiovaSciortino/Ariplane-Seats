import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import {NavLink} from 'react-router-dom';


const SideBar = (props) => {
  const { planes } = props;

  return (
    <ListGroup as="ul">
      {planes.map((plane) => (
        <NavLink
          variant="primary"
          className="list-group-item"
          key={plane.id}
          to={`/plane/${plane.id}`}
          style={{ textDecoration: 'none' }}
        >
          {plane.name}
        </NavLink>
      ))}
    </ListGroup>
  );
};


export {SideBar};