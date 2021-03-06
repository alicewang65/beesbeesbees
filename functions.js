//Parker M., Alice W., Catilin C.
//Bees Bees Bees
//Function file with the main functions. The bulk of the functionality of the game is located in this file.
//6/3/18


// VARIABLES AND CONSTANTS ///////////////////////////////////////////////////////////////////////////////////////

var myBee;		// The bee
var allObjects = []; // The array of every object that needs to be drawn
var avoidArray = []; // The array of objects that spawing flowers/etc. should avoid.

var flowers = [];	// The array of flowers, used for creating/deleting flowers
var rocks = [];	// The array of rocks
var maxFlowers = 10; // The maximum amount of flowers that can appear on the screen at once
var maxFlowerHoney = 150; // The maximum amount of honey a flower can contain
var collectionSpeed = 30;	// The rate at which flowers lose honey. Collection Speed * 20 = ms it takes to collect points (e.g 50 collectionSpeed = 50 * 20 = 1000 ms)
var flowerBundle = false;	// Whether or not flowers come in bundles (Flower Power)

var upgrades = [];	// The array of upgrades on screen
var miniUpgrades = []; // The array of mini upgrades
var activeEffects = [];	// The array of active honeyPot effects

function hph()
{
	return maxFlowerHoney/3;
}

var hps = 0;	// Honey per second (auto-collected)
var multiplier = 1;
var hpSpawnRate = 1500;	// How often a honey pot spawns. Spawn rate * 20 = ms it takes to spawn (e.g 1500 spawn rate is a 30 second spawn rate)
						// The extra 1 is for presentation day.

var scoreBox;	// The score textBox
var autoCollect; // The user's honey per second
var scoreCount = 0;	// The current score count
var scoreString = "0"; // The score converted to a string (for millions, billions, etc.)

var canvasWidth = window.innerWidth*0.75;	// Width of the canvas 
var canvasHeight = window.innerHeight*0.95;	// Height of the canvas 
const beeSize = 50;			// The height/width of the bee
const rockSize = 50;		// The height/width of rocks
const flowerWidth = 70;		// The max width of the flower
const flowerHeight = 90;	// The max height of the flower
const honeyPotSize = 100;	// The height and width of a honey pot
const boostSize = 50;		// The height and width of a boost box
var miniSize;				
var frameNo = 0;			// The number of frames that have passed

//sets the x and y positions of the score box
var scoreBoxY = canvasHeight*(.05);
var scoreBoxX = canvasWidth*(.05);

//the width and height of the upgrade area, based off of the size of the window
var upgradeCanvasWidth = window.innerWidth*0.20;
var upgradeCanvasHeight = canvasHeight;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCTIONS AND GAME VARIABLES //////////////////////////////////////////////////////////////////////////////////

// Function called to start the game and initialize variables
function startGame()
{
	// Initializes the bee object that is controlled by the mouse
	myBee.start();

	// Initialize game area, and begin the game-running loop
	myGameArea.start();

	//Initialize upgrade area
	upgradeArea.start();

	//add an event listener to resize canvases if window is resized
	window.addEventListener("resize", resizeCanvas, false);
}

// Variable that contains all canvas elements
var myGameArea = 
{
	// Create container for game area elements
	container : document.createElement("div"),

	// Create and initialize canvas
	canvas : document.createElement("canvas"),
	start : function() {
		this.container.setAttribute("id", "gameContainer");

		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.canvas.setAttribute("id", "myCanvas");
		this.context = this.canvas.getContext("2d");

		// When the mouse is moved, call mouseMove function (makes bee move)
		this.canvas.addEventListener("mousemove", function(){mouseMove()});
		// Add the canvas to the start of html body
		document.body.insertBefore(this.container, document.body.childNodes[0]);
		this.container.appendChild(this.canvas);

		// Add flower object(s) to the flowers array
		obstacleChange();

		// Draw the bee for the initial frame
		myBee.draw();

		// Creates the score textBox object
		scoreBox = new textBox(30, "Arial", scoreBoxX, scoreBoxY, "SCORE: 0", "#000000", false);
		autoCollect = new textBox(20, "Arial", scoreBoxX, scoreBoxY + scoreBox.getHeight(), "Hps: 0", "#000000", false);
		avoidArray.push(scoreBox);
		avoidArray.push(autoCollect);

		// Every 20ms, call the updateGameArea function
		this.interval = setInterval(updateGameArea, 20);

	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

//Variable that updates the game area
var upgradeArea =
{
	// Create a div container for all upgrade elements
	container : document.createElement("div"),

	// The div that contains the store sign
	storeSign : document.createElement("div"),
	// The div that contains all the mini upgrades
	storeArea : document.createElement("div"),
	start : function() {
		this.container.setAttribute("id", "upgradeContainer");
		this.container.style.maxHeight = canvasHeight + "px";

		this.storeSign.setAttribute("id", "storeSign");
		this.storeSign.setAttribute("class", "unselectable");
		this.storeSign.style.width = upgradeCanvasWidth + "px";
		this.storeSign.innerHTML = "STORE";

		this.storeArea.setAttribute("id", "storeArea");
		this.storeArea.style.width = upgradeCanvasWidth + "px";
		this.storeArea.style.borderWidth = "4px";

		// Gets the width of the store, and uses it to set the mini upgrade size.
		var area = this.storeArea.style.width;
		var size = parseFloat(area.substring(0, area.length));
		miniSize = size/5;

		this.storeArea.style.height = miniSize + "px";

		// Add this container to the start of html body, after the game canvas
		var mainCanvas = document.getElementById("gameContainer");
		mainCanvas.parentNode.insertBefore(this.container, mainCanvas.nextSibling);
		this.container.appendChild(this.storeSign);
		this.container.appendChild(this.storeArea);

		//event listeners so that when moused over, area expands/drops down
		this.storeArea.addEventListener("mouseover", function(){storeArea.hover()});
		this.storeArea.addEventListener("mouseout", function(){storeArea.unhover()});

		storeArea.hover = function()
		{
			// 5 not 4
			upgradeArea.storeArea.style.height = Math.ceil(miniUpgrades.length/4)*miniSize + "px";
		}

		storeArea.unhover = function()
		{
			if (miniUpgrades.length > 0)
			{
				upgradeArea.storeArea.style.height = miniSize + "px";
			}

			else
				upgradeArea.storeArea.style.height = "0px"
		}

		//creation of miniupgrades
		new miniUpgrade();
		new miniUpgrade();
		new miniUpgrade();
		new miniUpgrade();
		new miniUpgrade();
		new miniUpgrade();
		new miniUpgrade();

		//creation of upgrades
		new upgrade("Worker Bee", 10, 1);
		new upgrade("Queen Bee", 50, 2);
		new upgrade("Hive", 100, 5);
		new upgrade("Honey Farm", 500, 10);
		new upgrade("Honey Plantation", 1000, 50)
		new upgrade("Nectar CEO", 2500, 100);

	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

//resizes different aspects of the game as the window is resized
function resizeCanvas()
{
	//updates the width and height of the canvases
	canvasWidth = window.innerWidth*0.75;
	canvasHeight = window.innerHeight*0.95;
	upgradeWidth = window.innerWidth*0.20;
	upgradeHeight = canvasHeight;

	upgradeContainer.style.maxHeight = canvasHeight + "px";

	// The store area border is set outside the div, so the actual width of the store is 8px less
	storeWidth = (upgradeWidth - 8) + "px";
	storeHeight = canvasHeight*.3 + "px";

	//update the x and y position of the score box
	scoreBoxX = canvasWidth*(.05);
	socreBoxY = canvasHeight*(.05);

	//changes the actual canvases' widths and heights
	myGameArea.canvas.width = canvasWidth;
	myGameArea.canvas.height = canvasHeight;

	//changes the score box object's positions
	scoreBox.setX(scoreBoxX);
	scoreBox.setY(scoreBoxY);

	//changes the store area's and sign's width;
	storeArea.style.width = storeWidth;
	storeSign.style.width = storeWidth;

	//resizes the upgrades
	for (let instance of upgrades)
	{
		instance.node.style.width = storeWidth;
	}

}

// Reanimates the canvas, checks if a bee is hovering over a flower, and update the score
function updateGameArea()
{
	myGameArea.clear();
	frameNo++;
	scoreCount += (hps*multiplier)/50;

	// Every 50 frames (or one second), there is a chance of flowers/rocks moving/deleting/creating
	if (frameNo % 50 == 0)
	{
		obstacleChange();
	}

	// Every time the spawn rate is hit, a honey pot will spawn
	if (frameNo % hpSpawnRate == 0)
	{
		hp = new honeyPot();
		avoid(hp, avoidArray);
	}

	scoreString = simplifyNumber(scoreCount);

	// Update the score for the game
	scoreBox.setText(scoreString + "of honey");
	autoCollect.setText(simplifyNumber(hps*multiplier) + "per second");

	// Checks all objects if they are in contact with the bee and updates them
	for (let object of allObjects)
	{
		if (crash(myBee, object))
		{
			object.hit();
		}

		object.update();
	}

	// Changes color of upgrade background depending on if it is affordable/hovered over
	for (let instance of upgrades)
	{
		if (scoreCount >= instance.cost)
		{
			var color = "white";
		}

		else
			var color = "#eb8a44"; //#ff8080

		if (!instance.isHovering || scoreCount < instance.cost || instance.isHovering)
		{
			instance.node.style.backgroundColor = color;
		}
	}

	scoreBox.update();
	autoCollect.update();

	myBee.draw();
}

// Deletes/Creates flowers/rocks at a random new position at random intervals
function obstacleChange()
{
	for (ii = flowers.length; ii < maxFlowers; ii++)
	{
		// 1/1 chance for new flower if there are 0, 1/2 chance if there is 1 flower, 1/3 chance if there are 2 flowers, and so on... Do we want to change flowers.length in the if statement to ii?
		if (Math.floor(Math.random()*(flowers.length + 1)) == 0)
		{
			randomX = Math.floor(Math.random() * (canvasWidth - flowerWidth));
			randomY = Math.floor(Math.random() * (canvasHeight - flowerHeight));
			randomImageId = Math.floor(Math.random() * 3) + 1;
			flowerImage = new Image();
			flowerImage.src = "flower" + randomImageId + ".png";

			if (flowerBundle)
			{
				flowerImage.src = "flowerBundle.png"
			}

			tempFlower = new flower(randomX, randomY, flowerImage);

			flowerSpawn = avoidArray;
			flowerSpawn.concat(rocks);
			avoid(tempFlower, flowerSpawn);

			flowers.push(tempFlower);
			allObjects.push(tempFlower);
		}
	}

	// 1/20 chance of a rock spawning
	if (Math.floor(Math.random()*20) == 0)
	{
		randomX = Math.floor(Math.random() * (canvasWidth - rockSize));
		randomY = Math.floor(Math.random() * (canvasHeight - rockSize));
		newRock = new rock(randomX, randomY);

		// Rocks avoid scoreboxes
		avoid(newRock, avoidArray);

		rocks.push(newRock);
		allObjects.push(newRock);
	}

	// For each flower in the array
	for (let flower of flowers)
	{
		// Take off some of its lifespan
		flower.age();
	}

	// For each rock in the array
	for (let rock of rocks)
	{
		// Take off some of its lifespan
		rock.age();
	}
}

// If this object is at the edge of the canvas, don't go past the border
function hitWall(obj)
{
	var bottom = myGameArea.canvas.height - obj.getHeight();
	var right = myGameArea.canvas.width - obj.getWidth();

	if (obj.getY() > bottom)
	{
		obj.setY(bottom);
	}

	if (obj.getY() < 0)
	{
		obj.setY(0);
	}

	if (obj.getX() > right)
	{
		obj.setX(right);
		}

	if (obj.getX() < 0)
	{
		obj.setX(0);
	}
}

// Checks if two objects are in contact. Returns true if they are in contact.
function crash(obj1, obj2)
{
	var myleft = obj1.getX();
	var myright = obj1.getX() + obj1.getWidth();
	var mytop = obj1.getY();
	var mybottom = obj1.getY() + obj1.getHeight();
	var otherleft = obj2.getX();
	var otherright = obj2.getX() + (obj2.getWidth());
	var othertop = obj2.getY();
	var otherbottom = obj2.getY() + (obj2.getHeight());
	var crash = true;

	if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))
	{
		crash = false;
	}

	return crash;
}

// Repositions an object toCreate to avoid an array of objects toAvoid. Returns true if the objects were never in contact, or false if toCreate was repositioned.
function avoid(toCreate, toAvoid)
{
	var avoided = true;

	// For each object in the array of objects to avoid, if there is contact reposition toCreate
	for (ii = 0; ii < toAvoid.length; ii++)
	{
		if (crash(toCreate, toAvoid[ii]))
		{
			randomX = Math.floor(Math.random() * (canvasWidth - rockSize));
			randomY = Math.floor(Math.random() * (canvasHeight - rockSize));
			toCreate.setX(randomX);
			toCreate.setY(randomY);

			avoided = false;

			// We have to go through the whole array again if there was contact/repositioning
			ii = -1;
		}
	}

	return avoided;
}

// Moves the bee according to the cursor
function mouseMove()
{
	var mouseX = event.clientX;
	var mouseY = event.clientY;
	myBee.newPos(mouseX, mouseY);
}

// Takes in a number and returns a shortened string version
function simplifyNumber(number)
{
	if (number < 0)
	{
		number = 0;
		return "0 ";
	}

	else if (number < Math.pow(10, 3))
	{
		return number.toFixed() + " nanoliters ";
	}

	else if (number < Math.pow(10, 6))
	{
		return (number/Math.pow(10, 3)).toFixed(3) + " mililiters ";
	}

	else if (number < Math.pow(10, 9))
	{
		return (number/Math.pow(10, 6)).toFixed(3) + " liters ";
	}

	else if (number < Math.pow(10, 12))
	{
		return (number/Math.pow(10, 9)).toFixed(3) + " kiloliters ";
	}

	else if (number < Math.pow(10, 15))
	{
		return (number/Math.pow(10, 12)).toFixed(3) + " megaliters ";
	}

	else if (number < Math.pow(10, 18))
	{
		return (number/Math.pow(10, 15)).toFixed(3) + " gigaliters ";
	}

	else if (number < Math.pow(10, 21))
	{
		return (number/Math.pow(10, 18)).toFixed(3) + " teraliters ";
	}

	else if (number < Math.pow(10, 24))
	{
		return (number/Math.pow(10, 21)).toFixed(3) + " petaliters ";
	}

	else if (number < Math.pow(10, 27))
	{
		return (number/Math.pow(10, 24)).toFixed(3) + " exaliters ";
	}

	else if (number < Math.pow(10, 30))
	{
		return (number/Math.pow(10, 27)).toFixed(3) + " zottaliters ";
	}

	else if (number < Math.pow(10, 33))
	{
		return (number/Math.pow(10, 30)).toFixed(3) + " yottaliters ";
	}

	else
	{
		return "Infinity ";
	}
	
}