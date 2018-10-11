class Vehicle {
    constructor(x, y, dna, health) {
        this.pos = createVector(x,y);
        this.vel = createVector(0,-2);
        this.accl = createVector(0, 0);
        this.size = random(10, 20);
        this.r = 5;
        if (health >= 1){
            this.health = health;
        }
        else{
            this.health = 1;
        }
        this.maxSpeed = 4;
        this.maxforce = 0.2
        this.male = (random(1) > 0.5);
        (this.male) ? males++ : females++;
        
        this.dna = [];
        if(dna == undefined){
            this.dna[0] = random(-2,2);
            this.dna[1] = random(-2,2);
            this.dna[2] = random(10,100);
            this.dna[3] = random(10,100);
            
            // For male vehicles
            this.dna[4] = random(0,2);
            this.dna[5] = random(10,100);
            //this.dna[4] = 2;
            //this.dna[5] = 100;
        }
        else{
            this.dna[0] = dna[0];
            if(random(1) < mutationRate) { this.dna[0] += random(-0.1, 0.1); }
            this.dna[1] = dna[1];
            if(random(1) < mutationRate) { this.dna[1] += random(-0.1, 0.1); }
            this.dna[2] = dna[2];
            if(random(1) < mutationRate) { this.dna[2] += random(-10, 10); }
            this.dna[3] = dna[3];
            if(random(1) < mutationRate) { this.dna[3] += random(-10, 10); }
            this.dna[4] = dna[4];
            if(random(1) < mutationRate) {this.dna[4] += random(-0.1, 0.1); }
            this.dna[5] = dna[5];
            if(random(1) < mutationRate) {this.dna[5] += random(-10, 10); }
        }
    }
    
    layEgg() {
        //if(random(1) < 0.001){
        if(random(1) < 0.005){
            //console.log("Layed Egg");
            eggs.push(new Egg(this.pos.x, this.pos.y, this.dna));
        }
    }
    
    behaviours(good, bad){
        var steerG = this.eat(food, 0.3, this.dna[2]);
        var steerB = this.eat(poison, -0.5, this.dna[3]);
        var steerE = createVector(0,0);
        if(this.male){
            steerE = this.searchEggs(eggs);
        }
        else{
            this.layEgg();
        }
        
        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);
        steerE.mult(this.dna[4]);
        
        this.applyForce(steerG);
        this.applyForce(steerB);
        this.applyForce(steerE);
    }
    
    clone() {
        clones += 1;
        return (new Vehicle(this.pos.x, this.pos.y, this.dna, this.health/2));
    }
    
    fertilize(egg) {
        //console.log("fertilised egg");
        children++;
        var dna = [0,0,0,0,0,0];
        //Taking the best of both the DNA.
        //dna[0] = (this.dna[0] > egg.dna[0] ? this.dna[0] : egg.dna[0]);
        //dna[1] = (this.dna[1] < egg.dna[1] ? this.dna[1] : egg.dna[1]);
        //dna[2] = (this.dna[2] > egg.dna[2] ? this.dna[2] : egg.dna[2]);
        //dna[3] = (this.dna[3] < egg.dna[3] ? this.dna[3] : egg.dna[3]);
        //dna[4] = (this.dna[4] > egg.dna[4] ? this.dna[4] : egg.dna[4]);
        //dna[5] = (this.dna[5] > egg.dna[5] ? this.dna[5] : egg.dna[5]);
        
        dna[0] = (random(1) > 0.5 ? this.dna[0] : egg.dna[0]);
        dna[1] = (random(1) > 0.5 ? this.dna[1] : egg.dna[1]);
        dna[2] = (random(1) > 0.5 ? this.dna[2] : egg.dna[2]);
        dna[3] = (random(1) > 0.5 ? this.dna[3] : egg.dna[3]);
        //Always take this from the male dna.
        dna[4] = (random(1) > 0 ? this.dna[4] : egg.dna[4]);
        dna[5] = (random(1) > 0 ? this.dna[5] : egg.dna[5]);
        
        vehicles.push(new Vehicle(egg.pos.x, egg.pos.y, dna, this.health));
    }
    
    searchEggs(eggs) {
        var dist = Infinity;
        var closest = -1;
        
        for(var i = 0; i < eggs.length; i++){
            var d = this.pos.dist(eggs[i].pos);
            if(d < dist && d < this.dna[5]){
                dist = d;
                closest = i;
            }
        }
        
        if(closest != -1){
            if (dist < 5){
                this.fertilize(eggs[closest]);
                eggs.splice(closest,1);
            }
            else{
                return(this.seek(eggs[closest].pos));
            }
        }
        return createVector(0,0);
    }
    
    eat(list, nutrition, perception) {
        var dist = Infinity;
        var closest = -1;
        for(var i = 0; i < list.length; i++){
            var d = this.pos.dist(list[i]);
            if(d < dist && d < perception){
                dist = d;
                closest = i;
            }
        }

        if(closest != -1){
            if(dist < 5){
                if(this.health < 4){
                    this.health += nutrition;
                }
                list.splice(closest,1);
            }
            else{
                return(this.seek(list[closest]));
            }
        }
        
        return createVector(0,0);
    }
    
    calculateStats() {
        dead += 1;
        this.male ? males-- : females--;
    }
    
    move() {
        var mouse = createVector(mouseX, mouseY);
        mouse.sub(this.pos);
        mouse.setMag(0.1);
        this.accl = mouse;
        
        this.vel.add(this.accl);
        this.pos.add(this.vel);
        this.vel.limit(5);
    }
    
    update() {
        this.vel.add(this.accl);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        
        this.accl.mult(0);
        this.age += 0.01;
        this.health -= 0.005
    }
    
    seek(target) {
        var desired = p5.Vector.sub(target, this.pos);
        
        desired.setMag(this.maxSpeed);
        
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return(steer);
    }
    
    applyForce(force) {
        this.accl.add(force);
    }
    /*
    checkAndRotate(){
        if(this.pos.x > width) {this.pos.x = 0}
        if(this.pos.x < 0) {this.pos.x = width}
        if(this.pos.y > height) {this.pos.y = 0}
        if(this.pos.y < 0) {this.pos.y = height}
    }
    checkAndBounce() {
        if((this.pos.x + this.size/2 > width) ||
           (this.pos.x - this.size/2) < 0) {
            this.vel.x *= -1;
        }
        if((this.pos.y + this.size/2 > height) ||
           (this.pos.y - this.size/2 < 0)) {
            this.vel.y *= -1;
        }
    }*/
    
    display() {
        // Color based on health.
        var green = color(0, 255, 0);
        var red = color(255, 0, 0);
        var col = lerpColor(red, green, this.health);
        
        var angle = this.vel.heading() + PI / 2;
        push();
        translate(this.pos.x, this.pos.y);
        rotate(angle);
        if(debug.checked()){
            stroke(0,255,0);
            noFill();
            strokeWeight(3);
            line(0,0,0, -this.dna[0] * 20);
            strokeWeight(1);
            ellipse(0,0,this.dna[2]*2);
            stroke(255,0,0);
            //strokeWeight(1);
            line(0,0,0, -this.dna[1] * 20);
            ellipse(0,0,this.dna[3]*2); 
            stroke(0,0,255);
            ellipse(0,0,this.dna[5]*2);
            line(0,0,-this.dna[4]*20,0);
        }
        // Draw the vehicle itself
        fill(col);
        if(!this.male){
            col = color(255,0,255);
        }
        stroke(col);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
    
    boundaries() { 
        var d = 20;
        var desired = null;

        if (this.pos.x < d) {
            desired = createVector(this.maxSpeed, this.vel.y);
        }
        else if (this.pos.x > width -d) {
            desired = createVector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < d) {
            desired = createVector(this.vel.x, this.maxSpeed);
        }
        else if (this.pos.y > height-d) {
            desired = createVector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            var steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}