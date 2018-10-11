let vehicles = [];
let food = [];
let poison = [];
let eggs = [];
let avgDna = [0,0,0,0];
var dead = 0;
var averageAge = 0
var averageSize = 0;
var clones = 0;
var cloningRate = 0.001;
var mutationRate = 0.1;
var debug;
var vehicleReg = 0;
var children = 0;
var males = 0;
var females = 0;
var foodRate;
var eggRate;

function setup() {
	createCanvas(windowWidth, windowHeight - 50);
    background(51);
    
    debug = createCheckbox('Show Debuginfo');
    stats = createCheckbox('Show Stats');
    foodRate = createSlider(1, 100, 10);
    foodRate.position(150, windowHeight - 45);
    text("foodRate", foodRate.x * 2 + foodRate.width, windowHeight - 40)
}

function draw() {
    background(51);
    console.log(foodRate.value());
    var rand = random(100);
    if (rand < foodRate.value()){
        food.push(createVector(random(width), random(height)));
        //if (rand < 0.03){
        if (rand < 5){
            poison.push(createVector(random(width), random(height)));
        }
        
        //Hatch some eggs immaculately
        if(rand < 0.0005){
            //console.log("cleansing");
            //poison.splice(0, poison.length/10);
            
            if(males == 0 && eggs.length > 0){
                console.log("Immaculate child");
                vehicles.push(new Vehicle(eggs[0].pos.x, eggs[0].pos.y, null, 0));
                eggs.splice(0,1);
                //poison.splice(0, poison.length/10);
            }
        }
    }
    
    noStroke();
    for(var i = 0; i < food.length; i++){
        fill(0,255,0);
        ellipse(food[i].x, food[i].y, 4);
    }
    for(var i = 0; i < poison.length; i++){
        fill(255,0,0);
        ellipse(poison[i].x, poison[i].y, 4);
    }
    for(var i = 0; i < eggs.length; i++){
        stroke(255,0,255);
        fill(0,0,255);
        ellipse(eggs[i].pos.x, eggs[i].pos.y, 8);
    }
    
    for(var i = vehicles.length - 1; i >=0; i--){
        vehicles[i].behaviours(food, poison);
        vehicles[i].boundaries();
        vehicles[i].update();
        vehicles[i].display();
        
        // Check for cloning.
        //if (random(1) < cloningRate) {
        //    var newVehicle = vehicles[i].clone();
        //    vehicles.push(newVehicle);
        //}
        
        // Death of a vehicle.
        if(vehicles[i].health <= 0){
            // Calculate stats
            vehicles[i].calculateStats();
            // Create a food where it died.
            food.push(createVector(vehicles[i].pos.x, vehicles[i].pos.y));
            vehicles.splice(i,1);
            // Calculate average DNA of the remaining vehicles.
            // calculateAverage();
        }
    }
    
    if(stats.checked()){
        drawingContext.font = 'normal 12px courier';
        noStroke();
        fill(0);
        text('TOTAL VEHICLES = '+ vehicles.length + ', MALES/FEMALES: ' + males + '/' + females, 10, height -36);
        text('TOTAL EGGS: HATCHED/UNHATCHED: ' + children + '/' + eggs.length, 10, height - 24)
        //text('AVERAGE DNA = ' + avgDna, 10, height - 12);
    }
//    if(vehicles.length == 0){
//        clones = 0;
//    }
    
//    if(vehicles.length <= 2){
//        poison.splice(0, 1);
//    }
    
    if(vehicles.length == 0 && eggs.length > 0){
        //destroy all the poison
        poison.splice(0, poison.length);
        immaculate();
    }
    
}

function immaculate() {
    for(var i = eggs.length - 1; i >= 0; i--){
        vehicles.push(new Vehicle(eggs[i].pos.x, eggs[i].pos.y, null, 0));
        children++;
        eggs.splice(i, 1);
    }
}

function calculateAverage(){
    if(stats.checked()){
        if (vehicles.length == 0) {
            avgDna = [0,0,0,0];
            return;
        }
        var totalFoodAttr = 0;
        var totalPoisonAttr = 0;
        var totalFoodPerception = 0;
        var totalPoisonPerception = 0;

        var length = vehicles.length;
        for(var i = 0; i < vehicles.length; i++){
            var dna = vehicles[i].dna;
            totalFoodAttr         += dna[0];
            totalPoisonAttr       += dna[1];
            totalFoodPerception   += dna[2];
            totalPoisonPerception += dna[3];
        }

        avgDna[0] = totalFoodAttr         / length;
        avgDna[1] = totalPoisonAttr       / length;
        avgDna[2] = totalFoodPerception   / length;
        avgDna[3] = totalPoisonPerception / length;
    }
}

function keyPressed() {
    if(key == ' ') {
        vehicles.push(new Vehicle(random(width), random(height), null, 0));
        // calculateAverage();
    }
    
    if(key == 'D') {
        if(vehicles.length > 0){
            vehicles.splice(0,1);
        }
    }
    
    if (key == 'L') {
        for(var i = 0; i < 25; i++){
            vehicles.push(new Vehicle(random(width), random(height), null, 0));
        }
    }
}