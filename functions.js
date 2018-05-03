// VARIABLES AND CONSTANTS ///////////////////////////////////////////////////////////////////////////////////////

var myBee;		// The bee
var allObjects = []; // The array of every object that needs to be drawn
var avoidArray = []; // The array of objects that spawing flowers/etc. should avoid.

var flowers = [];	// The array of flowers, used for creating/deleting flowers
var rocks = [];
var maxFlowers = 10; // The maximum amount of flowers that can appear on the screen at once
var maxFlowerHoney = 150; // The maximum amount of honey a flower can contain
var collectionSpeed = 30;	// The rate at which flowers lose honey. Collection Speed * 20 = ms it takes to collect points (e.g 50 collectionSpeed = 50 * 20 = 1000 ms)
var flowerBundle = false;	// Whether or not flowers come in bundles (Flower Power)

var upgrades = [];	// The array of upgrades on screen
var activeEffects = [];	// The array of active honeyPot effects

function hph()
{
	return maxFlowerHoney/3;
}
var hps = 0;	// Honey per second (auto-collected)
var multiplier = 1;

var scoreBox;	// The score textBox
var autoCollect; // The user's honey per second
var scoreCount = 0;	// The current score count
var scoreString = "0"; // The score converted to a string (for millions, billions, etc.)

var canvasWidth = window.innerWidth*0.75;	// Width of the canvas - 1210 originally
var canvasHeight = window.innerHeight*0.95;	// Height of the canvas - 710 originally
const beeSize = 50;			// The height/width of the bee
const rockSize = 50;		// The height/width of rocks
const flowerWidth = 70;		// The max width of the flower
const flowerHeight = 90;	// The max height of the flower
const honeyPotSize = 100;	// The height and width of a honey pot
const boostSize = 40;		// The height and width of a boost box
var frameNo = 0;			// The number of frames that have passed

//sets the x and y positions of the score box
var scoreBoxY = canvasHeight*(.05);
var scoreBoxX = canvasWidth*(.05);

var upgradeCanvasWidth = canvasWidth*0.28;
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

		// Creates the score textBox object
		scoreBox = new textBox(30, "Arial", scoreBoxX, scoreBoxY, "SCORE: 0", "#000000", false);
		autoCollect = new textBox(20, "Arial", scoreBoxX, scoreBoxY + scoreBox.getHeight(), "Hps: 0", "#000000", false);
		avoidArray.push(scoreBox);
		avoidArray.push(autoCollect);

		// Add flower object(s) to the flowers array
		obstacleChange();

		// Draw the bee and scoreBox for the initial frame
		myBee.draw();
		scoreBox.update();
		autoCollect.update();

		// When the mouse is moved, call mouseMove function (makes bee move)
		this.canvas.addEventListener("mousemove", function(){mouseMove()});
		// Add the canvas to the start of html body
		document.body.insertBefore(this.container, document.body.childNodes[0]);
		this.container.appendChild(this.canvas);

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

	// Create and initialize canvas and container
	canvas : document.createElement("canvas"),
	// The div that contains all the mini upgrades
	storeArea : document.createElement("div"),
	start : function() {
		this.container.setAttribute("id", "upgradeContainer");

		this.canvas.width = upgradeCanvasWidth;
		this.canvas.height = upgradeCanvasHeight;
		this.canvas.setAttribute("id", "upgradeCanvas");
		this.context = this.canvas.getContext("2d");

		this.storeArea.setAttribute("id", "storeArea");
		this.storeArea.style.width = (upgradeCanvasWidth-8) + "px";
		this.storeArea.style.height = upgradeCanvasHeight*(.3) + "px";
		this.storeArea.innerHTML = "STORE";

		// Add the canvas to the start of html body, after the game canvas
		var mainCanvas = document.getElementById("gameContainer");
		mainCanvas.parentNode.insertBefore(this.container, mainCanvas.nextSibling);
		this.container.appendChild(this.canvas);
		this.container.appendChild(this.storeArea);

		new upgrade("Worker Bee", 10, 1);
		new upgrade("Queen Bee", 15, 2);
		new upgrade("Hive", 50, 5);
		new upgrade("Honey Farm", 100, 10);
		new upgrade("Nectar CEO", 500, 100);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

//resizes the canvas if the window is resized
function resizeCanvas()
{
	//updates the width and height of the canvases
	canvasWidth = window.innerWidth*0.75;
	canvasHeight = window.innerHeight*0.95;
	upgradeWidth = window.innerWidth*0.20;
	upgradeHeight = canvasHeight;
	
	//update the x and y position of the score box
	scoreBoxX = canvasWidth*(.05);
	socreBoxY = canvasHeight*(.05);

	//changes the actual canvases' widths and heights
	myGameArea.canvas.width = canvasWidth;
	myGameArea.canvas.height = canvasHeight;
	upgradeArea.canvas.width = upgradeWidth;
	upgradeArea.canvas.height = upgradeHeight;

	//changes the score box object's positions
	scoreBox.setX(scoreBoxX);
	scoreBox.setY(scoreBoxY);

	//resizes the upgrades
	for (let instance of upgrades)
	{
		instance.node.style.width = (upgradeWidth-8) + "px";
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

	// Every 250 frames (or 5 seconds), a honey pot will spawn
	if (frameNo % 250 == 0)
	{
		hp = new honeyPot();
		avoid(hp, [scoreBox, autoCollect]);
	}

	scoreString = simplifyNumber(scoreCount);

	// Update the score for the game
	scoreBox.setText("SCORE: " + scoreString);
	autoCollect.setText("Hps: " + simplifyNumber(hps*multiplier));

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
			var color = "#ff8080";

		if (!instance.isHovering || scoreCount < instance.cost)
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
		return "0";
	}

	else if (number < Math.pow(10, 3))
	{
		return number.toFixed();
	}

	else if (number < Math.pow(10, 6))
	{
		temp = number.toFixed();
		strIndex = temp.length - 3; // This is the index where the comma will go
		return temp.substring(0, strIndex) + "," + temp.substring(strIndex);
	}

	else if (number < Math.pow(10, 9))
	{
		return (number/Math.pow(10, 6)).toFixed(3) + " Million";
	}

	else if (number < Math.pow(10, 12))
	{
		return (number/Math.pow(10, 9)).toFixed(3) + " Billion";
	}

	else if (number < Math.pow(10, 15))
	{
		return (number/Math.pow(10, 12)).toFixed(3) + " Trillion";
	}

	else if (number < Math.pow(10, 18))
	{
		return (number/Math.pow(10, 15)).toFixed(3) + " Quadrillion";
	}

	else if (number < Math.pow(10, 21))
	{
		return (number/Math.pow(10, 18)).toFixed(3) + " Pentillion";
	}

	else if (number < Math.pow(10, 24))
	{
		return (number/Math.pow(10, 21)).toFixed(3) + " Hexillion";
	}

	else if (number < Math.pow(10, 27))
	{
		return (number/Math.pow(10, 24)).toFixed(3) + " Septillion";
	}

	else if (number < Math.pow(10, 30))
	{
		return (number/Math.pow(10, 27)).toFixed(3) + " Octillion";
	}

	else if (number < Math.pow(10, 33))
	{
		return (number/Math.pow(10, 30)).toFixed(3) + " Nonillion";
	}

	else if (number < Math.pow(10, 36))
	{
		return (number/Math.pow(10, 33)).toFixed(3) + " Decillion";
	}

	else
	{
		return "Infinity";
	}
	
}