import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { PhysicsBody, Newtonian_Gravity, collision, detect_collision } from './physics';

const G = 6.6743e-11; 

function App() {

  //defining physics bodies
  const body1 = useRef(new PhysicsBody('Body1', -20, -20, 700, 600, 10, 0, 10, 'green'));
  const body2 = useRef(new PhysicsBody('Body2', 0, 0, 500, 400, 10, 0, 10, 'blue'));
  
  const del_t = 0.2; // Time step for the simulation

  const [positions, setPositions] = useState({
    body1: { x: body1.current.pos_x, y: body1.current.pos_y },
    body2: { x: body2.current.pos_x, y: body2.current.pos_y }
  });

  useEffect(() => {
    const updatePositions = () => {

      if (detect_collision(body1.current, body2.current)){
        collision(body1.current, body2.current);
      }

      const forceOnBody2 = Newtonian_Gravity(G, body1.current, body2.current);
      const forceOnBody1 = Newtonian_Gravity(G, body2.current, body1.current);

      body1.current.net_a(forceOnBody1);
      body2.current.net_a(forceOnBody2);

      body1.current.update(del_t);
      body2.current.update(del_t);

      setPositions({
        body1: { x: body1.current.pos_x, y: body1.current.pos_y },
        body2: { x: body2.current.pos_x, y: body2.current.pos_y }
      });

      setTimeout(updatePositions, 100);
    };

    updatePositions(); 


    
  }, [del_t]);

  return (
    <div className="App">
      <svg width="1000" height="800">
        <circle
          cx={positions.body1.x}
          cy={positions.body1.y}
          r={body1.current.radius}
          fill={body1.current.color}
        />
        <circle
          cx={positions.body2.x}
          cy={positions.body2.y}
          r={body2.current.radius}
          fill={body2.current.color}
        />
      </svg>
    </div>
  );
}

export default App;