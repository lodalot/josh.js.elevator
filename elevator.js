/*
1. Initialize the elevator simulation with the desired number of elevators, and the desired number of floors. Assume ground/min of 1. 
2. Each elevator will report as is moves from floor to floor. 
3. Each elevator will report when it opens or closes its doors. 
4. An elevator cannot proceed above the top floor. 
5. An elevator cannot proceed below the ground floor (assume 1 as the min) 
6. An elevator request can be made at any floor, to go to any other floor. 
7. When an elevator request is made, the unoccupied elevator closest to it will answer the call, unless an occupied elevator is moving and will pass that floor on its way. The exception is that if an unoccupied elevator is already stopped at that floor, then it will always have the highest priority answering that call. 
8. The elevator should keep track of how many trips it has made, and how many floors it has passed. The elevator should go into maintenance mode after 
100 trips, and stop functioning until serviced, therefore not be available for elevator calls. 
*/

var ElevatorManager = function(){
	this.elevatorsQueue = [];
	
	// this should compile with node.js
	// I added a quick brainstorm at the bottom

	var maxFloors = 50;
	var minFloors = 0;
	
	this.CreateElevator = function(elevator){
		this.elevatorsQueue.push(elevator);
	};
	
	this.RequestElevator = function(elevator){
		if(elevator.MaintenanceMode){
			console.log("Sorry elevator is out of order");
			return false;
		}
		var index = this.elevatorsQueue.indexOf(elevator);
		if(index > -1) {
			this.elevatorsQueue[index].notify(index);
		}
	};
}

var Elevator = function() {
	var _id;
	var _up = false;
	var _down = false;
	var _floorLevel = 1;
	var _doorClosed = true;
	var _occupied = false;
	var _currentFloor = 0;
	var _floorCount = 0;
	var _tripCount = 0;
	var _maintenanceMode = false;
	
	this.FloorLevel = {
		get : function () { return this._floorLevel; },
		set : function (value) {
			if(value !== undefined && value !== null && typeof value === "number"){
				this._currentFloor = this._floorLevel; //set the current floor to the last request.. yeah what happens if we started throwing in multiple requests.. but this is basic for now
				this._floorLevel = value;
			}
			else{
				console.log("error selecting the floor level");
			}
		}
	}
	
	this.MaintenanceMode = {
		get : function () { return _maintenanceMode; },
		set : function (value) {
			if(value !== undefined && value !== null && typeof value === "boolean"){
				_maintenanceMode = value;
			}
			else{
				console.log("error");
			}
		}
	}
	
	this.Id = {
		get : function () { return _id; },
		set : function (value) {
			if(value !== undefined && value !== null && typeof value === "number"){
				_id = value; //figured it has to be a number
			}
			else{
				console.log("error adding elevator id");
			}
		}
	}

	
	return {
		notify :function (index) {
			this._floorCount = this._floorCount + this.FloorLevel;
			this._occupied = true;
			this._doorClosed = true;
			this._up = true;
			this._tripCount ++;
			console.log("Elevator " + this.Id + " requested at floor " + this.FloorLevel + ". Elevator is currently on floor: " + this._currentFloor);
			if(this._tripCount == 100){
				this._maintenanceMode = true;
			}
		} 
	}
}

var manager = new ElevatorManager();

//create elevator 1
var elevator1 = new Elevator();
elevator1.Id = 1;
manager.CreateElevator(elevator1);

//create elevator 2
var elevator2 = new Elevator();
elevator2.Id = 2;
manager.CreateElevator(elevator2);

//create elevator 3
var elevator3 = new Elevator();
elevator3.Id = 3;
manager.CreateElevator(elevator3);

//requesting

elevator1.FloorLevel = 4;
manager.RequestElevator(elevator1);

elevator2.FloorLevel = 10;
manager.RequestElevator(elevator2);

elevator3.FloorLevel = 6;
manager.RequestElevator(elevator3);


	// need to calculate floor timing..
	// during requests we need to know when the elevator was requested and then add some type of weight for how long it takes to travel for each floor.
	// we could also add in the time it takes for stopping to include opening and closing the doors.
	// does it take longer for a door to open when more people are riding
	// multiple people are riding clicking multiple floors
	
	// Welp. now that I've had some time to think about this some more I'd probably go a different route
	///////////////////////////////////////////////////////////////////////////////////////////
	// Add a floor controller to handle requesting floors and have that manager figure out which
	// elevator to use instead of the below approach of requesting a floor based on an elevator.
	
	// the elevator manager would handle global properties for the floor controller.
	// definitely need some more queues 
	
