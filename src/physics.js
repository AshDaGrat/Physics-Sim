const G = 6.6743e-11;
const k = 9e9;

function mag(rx, ry) {

    /*returns magnitude of the resulting vector given its two components*/
    
    return Math.sqrt(rx**2 + ry**2);
}

function Newtonian_Gravity(G, b1, b2) {

    /*b2 is our body of interest
    calculates force exerted by m1 on m2*/

    let rx = b2.pos_x - b1.pos_x;
    let ry = b2.pos_y - b1.pos_y;
    let r = mag(rx, ry);

    let F_net = -1*(G * b1.mass * b2.mass) / (r**2);
    let Fx = F_net * (rx / r); // resolving force into component vectors
    let Fy = F_net * (ry / r);

    return [Fx, Fy];
}

function Coulomb_Electrostatic(k, b1, b2) {

    /*b2 is our body of interest
    calculates force exerted by m1 on m2*/

    let rx = b2.pos_x - b1.pos_x;
    let ry = b2.pos_y - b1.pos_y;
    let r = mag(rx, ry);

    let F_net = (k * b1.charge * b2.charge) / (r**2);
    let Fx = F_net * (rx / r); // resolving force into component vectors
    let Fy = F_net * (ry / r);

    return [Fx, Fy];
}

class PhysicsBody {
    constructor(name, vel_x, vel_y, pos_x, pos_y, radius, charge, mass, color) {
        this.name = name;
        this.vel_x = vel_x;
        this.vel_y = vel_y;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.a_x = 0;
        this.a_y = 0;
        this.radius = radius;
        this.charge = charge;
        this.mass = mass;
        this.color = color;
    }

    net_f(b1) {

        /*calculating net force on this body due to body b1*/

        let F_g = Newtonian_Gravity(G, b1, this);
        let F_c = Coulomb_Electrostatic(k, b1, this);
        let f_x = F_g[0] + F_c[0]; // Net force on this body
        let f_y = F_g[1] + F_c[1];

        return [f_x, f_y];
    }

    net_a(F) {

        /*calculating net acceleration on this body
        F must be an array with two elements f_x and f_y*/

        this.a_x = F[0] / this.mass;
        this.a_y = F[1] / this.mass;
    }

    update(del_t) {

        /*update position of this body*/

        let del_pos_x = this.vel_x * del_t;
        this.pos_x += del_pos_x;
        let del_pos_y = this.vel_y * del_t;
        this.pos_y += del_pos_y;

        /*update velocity of this body*/

        let del_vel_x = this.a_x * del_t;
        this.vel_x += del_vel_x;
        let del_vel_y = this.a_y * del_t;
        this.vel_y += del_vel_y;
    }
}

function detect_collision(b1, b2) {
    let distance = b1.radius + b2.radius; 
    let dx = b2.pos_x - b1.pos_x;
    let dy = b2.pos_y - b1.pos_y;
    let actualDistance = mag(dx, dy);
    
    if (actualDistance <= distance) {
        console.log("Collision detected");
        return true;
    } else {
        return false;
    }
}


/*
function collision(b1, b2){

    //handing x axis collision 

    let px = (b1.mass*b1.vel_x) + (b2.mass*b2.vel_x); //total initial momentum
    let kx = (b1.mass*(b1.vel_x)**2) + (b2.mass*(b2.vel_x)**2); //total inital kinetic energy

    let ax = (b2.mass/b1.mass) + (b2.mass**2);
    let bx = -1*px*b2.mass;
    let cx = (px**2) - (b1.mass*kx);

    let v2x1 = (-bx + Math.sqrt(((bx**2)-(4*ax*cx))))/(2*ax); //quadratic formula to find final velocity of body 2
    let v2x2 = (-bx - Math.sqrt(((bx**2)-(4*ax*cx))))/(2*ax);
    let body_2_final_velocity_x = 0

    /*After collision there has to be some change of velocity. 
    Hence if initial and final are the same, it cannot be the correct solution.

    if (v2x1 === b2.vel_x){
        body_2_final_velocity_x = v2x2 
    }
    else {
        body_2_final_velocity_x = v2x1
    }

    let body_1_final_velocity_x = (px-((b2.mass)*body_2_final_velocity_x))/b1.mass

    //handling y axis collision

    let py = (b1.mass*b1.vel_y) + (b2.mass*b2.vel_y); //total initial momentum
    let ky = (b1.mass*(b1.vel_y)**2) + (b2.mass*(b2.vel_y)**2); //total inital kinetic energy

    let ay = (b2.mass/b1.mass) + (b2.mass**2);
    let by = -1*py*b2.mass;
    let cy = (py**2) - (b1.mass*ky);

    let v2y1 = (-by + Math.sqrt(((by**2)-(4*ay*cy))))/(2*ay); //quadratic formula to find final velocity of body 2
    let v2y2 = (-by - Math.sqrt(((by**2)-(4*ay*cy))))/(2*ay);
    let body_2_final_velocity_y = 0

    if (v2y1 === b2.vel_y){
        body_2_final_velocity_y = v2y2 
    }
    else {
        body_2_final_velocity_y = v2y1
    }

    let body_1_final_velocity_y = (py-((b2.mass)*body_2_final_velocity_y))/b1.mass  

    //new velocities
    b1.vel_x = body_1_final_velocity_x
    b2.vel_x = body_2_final_velocity_x
    b1.vel_y = body_1_final_velocity_y
    b2.vel_y = body_2_final_velocity_y

    console.log(b1.vel_x,b1.vel_y, b2.vel_x, b2.vel_y)
}
*/

function collision(b1, b2) {
    // Calculate the distance between the two bodies
    let dx = b2.pos_x - b1.pos_x;
    let dy = b2.pos_y - b1.pos_y;
    let distance = mag(dx, dy);

    // Calculate the normal and tangent vectors
    let normalX = dx / distance;
    let normalY = dy / distance;
    let tangentX = -normalY;
    let tangentY = normalX;

    // Project the velocities onto the normal and tangent vectors
    let vel1n = b1.vel_x * normalX + b1.vel_y * normalY;
    let vel1t = b1.vel_x * tangentX + b1.vel_y * tangentY;
    let vel2n = b2.vel_x * normalX + b2.vel_y * normalY;
    let vel2t = b2.vel_x * tangentX + b2.vel_y * tangentY;

    // Calculate the new normal velocities using conservation of momentum
    let vel1nFinal = (vel1n * (b1.mass - b2.mass) + 2 * b2.mass * vel2n) / (b1.mass + b2.mass);
    let vel2nFinal = (vel2n * (b2.mass - b1.mass) + 2 * b1.mass * vel1n) / (b1.mass + b2.mass);

    // The tangent velocities remain the same
    let vel1tFinal = vel1t;
    let vel2tFinal = vel2t;

    // Convert the scalar normal and tangential velocities into vectors
    b1.vel_x = vel1nFinal * normalX + vel1tFinal * tangentX;
    b1.vel_y = vel1nFinal * normalY + vel1tFinal * tangentY;
    b2.vel_x = vel2nFinal * normalX + vel2tFinal * tangentX;
    b2.vel_y = vel2nFinal * normalY + vel2tFinal * tangentY;

    console.log(`b1 final velocities: (${b1.vel_x}, ${b1.vel_y}), b2 final velocities: (${b2.vel_x}, ${b2.vel_y})`);
}


export { PhysicsBody, Newtonian_Gravity, collision, detect_collision };
