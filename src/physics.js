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

export { PhysicsBody, Newtonian_Gravity };
