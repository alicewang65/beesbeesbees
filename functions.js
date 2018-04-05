// VARIABLES AND CONSTANTS ///////////////////////////////////////////////////////////////////////////////////////

var myBee;		// The bee
var allObjects = []; // The array of every object that needs to be drawn

var flowers = [];	// The array of flowers, used for creating/deleting flowers
var rocks = [];
var maxFlowers = 10; // The maximum amount of flowers that can appear on the screen at once
var maxFlowerHoney = 150; // The maximum amount of honey a flower can contain
var collectionSpeed = 30;	// The rate at which flowers lose honey. Collection Speed * 20 = ms it takes to collect points (e.g 50 collectionSpeed = 50 * 20 = 1000 ms)

var upgrades = [];	// The array of upgrades on screen
var honeyPotEffects = ["Boost", "Hyper"]; //"Flower Power", "Swarm"

var hph = maxFlowerHoney/3;	// Honey Per Hover (used for flowers)
var hps = 0;	// Honey per second (auto-collected)

var scoreBox;	// The score textBox
var autoCollect; // The user's honey per second
var scoreCount = 0;	// The current score count
var scoreString = "0"; // The score converted to a string (for millions, billions, etc.)
var multiplier = 1;

var canvasWidth = window.innerWidth*0.75;	// Width of the canvas - 1210 originally
var canvasHeight = window.innerHeight*0.95;	// Height of the canvas - 710 originally
const beeSize = 50;			// The height/width of the bee
const rockSize = 50;		// The height/width of rocks
const flowerWidth = 70;		// The max width of the flower
const flowerHeight = 90;	// The max height of the flower
var frameNo = 0;			// The number of frames that have passed

//sets the x and y positions of the score box
var scoreBoxY = canvasHeight*(.05);
var scoreBoxX = canvasWidth*(.05);

var upgradeCanvasWidth = canvasWidth*0.29;
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
		scoreBox = new textBox(30, "Arial", scoreBoxX, scoreBoxY, "Score: 0", "#000000", false);
		autoCollect = new textBox(20, "Arial", scoreBoxX, scoreBoxY + scoreBox.getHeight(), "Hps: 0", "#000000", false);

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
	container : document.createElement("div"),

	// Create and initialize canvas and container
	canvas : document.createElement("canvas"),
	start : function() {
		this.container.setAttribute("id", "upgradeContainer");

		this.canvas.width = upgradeCanvasWidth;
		this.canvas.height = upgradeCanvasHeight;
		this.canvas.setAttribute("id", "upgradeCanvas");
		this.context = this.canvas.getContext("2d");

		// Add the canvas to the start of html body, after the game canvas
		var mainCanvas = document.getElementById("gameContainer");
		mainCanvas.parentNode.insertBefore(this.container, mainCanvas.nextSibling);
		this.container.appendChild(this.canvas);

		makeUpgrade("Worker Bee", 10, 1);
		makeUpgrade("Queen Bee", 15, 2);
		makeUpgrade("Hive", 50, 5);
		makeUpgrade("Honey Farm", 100, 10);
		makeUpgrade("Nectar CEO", 500, 100);
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
	upgradeWidth = canvasWidth*0.3;
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
	for (var ii = 0; ii < upgrades.length; ii++)
	{
		upgrades[ii].style.width = (upgradeWidth-8) + "px";
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

	// Every 1500 frames (or 30 seconds), a honey pot will spawn
	if (frameNo % 250 == 0)
	{
		honeyPotSpawn();
	}

	scoreString = simplifyNumber(scoreCount);

	// Update the score for the game
	scoreBox.setText("SCORE: " + scoreString);
	autoCollect.setText("Hps: " + simplifyNumber(hps*multiplier));

	// Checks all objects if they are in contact with the bee and updates them
	for (ii = 0; ii < allObjects.length; ii++)
	{
		if (crash(myBee, allObjects[ii]))
		{
			allObjects[ii].hit();
		}

		allObjects[ii].update();
	}

	for (let upgrade of upgrades)
	{
		if (scoreCount >= upgrade.cost)
		{
			var color = "white";
		}

		else
			var color = "gray";

		if (!upgrade.isHovering || scoreCount < upgrade.cost)
		{
			upgrade.style.backgroundColor = color;
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

			tempFlower = new flower(randomX, randomY, flowerImage);

			// Make sure the new flower isn't in contact with any rocks or the scoreBox
			for (rr = 0; rr < rocks.length; rr++)
			{
				if (!avoid(tempFlower, rocks[rr]) || !avoid(tempFlower, scoreBox))
				{
					// If the flower is in contact with something, we have to check the whole array again with the new position
					rr = 0;
					tempFlower.setX(Math.floor(Math.random() * (canvasWidth - flowerWidth)));
					tempFlower.setY(Math.floor(Math.random() * (canvasHeight - flowerHeight)));
				}
			}

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

		// Make sure the new rock isn't in contact with any other object or the scoreBox
		for (oo = 0; oo < allObjects.length; oo++)
		{
			if (!avoid(newRock, allObjects[oo]) || !avoid(newRock, scoreBox))
			{
				// If the rock is in contact with something, we have to check the whole array again with the new position
				oo = 0;
				newRock.setX(Math.floor(Math.random() * (canvasWidth - rockSize)));
				newRock.setY(Math.floor(Math.random() * (canvasHeight - rockSize)));
			}
		}

		rocks.push(newRock);
		allObjects.push(newRock);
	}

	// For each flower in the array
	for (ff = 0; ff < flowers.length; ff++)
	{
		// Take off some of its lifespan
		flowers[ff].age();
	}

	// For each rock in the array
	for (rr = 0; rr < rocks.length; rr++)
	{
		// Take off some of its lifespan
		rocks[rr].age();
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

// Checks if two objects are in contact
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

// Repositions an object toCreate to avoid an object toAvoid. Returns true if the objects were never in contact, or false if toCreate was repositioned.
function avoid(toCreate, toAvoid)
{
	while (crash(toCreate, toAvoid))
	{
		randomX = Math.floor(Math.random() * (canvasWidth - rockSize));
		randomY = Math.floor(Math.random() * (canvasHeight - rockSize));
		toCreate.setX(randomX);
		toCreate.setY(randomY);

		return false;
	}

	return true;
}

// Moves the bee according to the cursor, and save data for rock bounce animation
function mouseMove()
{
	var mouseX = event.clientX;
	var mouseY = event.clientY;
	myBee.newPos(mouseX, mouseY);

}

// Makes an upgrade object
function makeUpgrade(name, startCost, honey)
{
	var upgrade = document.createElement("div");
	upgrade.setAttribute("class", "upgrade");
	upgrade.cost = startCost;
	upgrade.costString = upgrade.cost.toString();
	upgrade.count = 0;
	upgrade.name = name;
	upgrade.isHovering = false;
	upgrade.honey = honey;

	upgrade.addEventListener("mouseover", function()
		{
			if (scoreCount >= upgrade.cost)
			{
				upgrade.style.backgroundColor = "#d9d9d9";
			}
			upgrade.isHovering = true;
		});

	upgrade.addEventListener("mouseout", function()
		{
			upgrade.isHovering = false;
		});

	upgrade.addEventListener("click", function()
		{
			buyUpgrade(upgrade);
		}
	);

	upgrade.style.width = (upgradeCanvasWidth-8) + "px"; // This accounts for 2px border... magic number used
	upgrade.style.height = "100px"; // Magic number, fix this
	upgrade.style.top = 108*upgrades.length + "px";

	upgrade.innerHTML = upgrade.name + "<br> <p class = \"upgradeCost\"> Cost: " + upgrade.costString + "</p>";

	upgradeArea.container.appendChild(upgrade);
	upgrades.push(upgrade);
}

// Called when the user clicks on the test upgrade. Checks if the user can afford the upgrade, then buys it if they can.
function buyUpgrade(upgrade)
{
	if (scoreCount >= upgrade.cost)
	{
		scoreCount -= upgrade.cost;
		hps += upgrade.honey;
		upgrade.cost = upgrade.cost * 1.25;
		upgrade.costString = simplifyNumber(upgrade.cost);
		upgrade.count += 1;
		upgrade.innerHTML = upgrade.name + "<br> <p class = \"upgradeCost\"> Cost: " + upgrade.costString + "</p> <p class = \"upgradeCount\"> " + upgrade.count + "</p>"
	}
}

// Spawns a honey pot
function honeyPotSpawn()
{
	honeyPot = document.createElement("div");
	honeyPot.setAttribute("class", "honeyPot");

	honeyPot.width = 100; // MAGIC NUMBER, fix this
	honeyPot.height = 100; // MAGIC NUMBER, fix this
	honeyPot.x = Math.floor(Math.random()*(canvasWidth - 100)); // MAGIC NUMBER, fix this
	honeyPot.y = Math.floor(Math.random()*(canvasHeight - 100)); // MAGIC NUMBER, fix this
	honeyPot.style.width = honeyPot.width + "px";
	honeyPot.style.height = honeyPot.height + "px";
	honeyPot.style.left = honeyPot.x + "px";
	honeyPot.style.top = honeyPot.y + "px";
	honeyPot.addEventListener("click", function(){honeyPotClick(honeyPot)});

	honeyPotImg = document.createElement("IMG");
	honeyPotImg.setAttribute("src", "honey pot.png");
	honeyPotImg.style.width = "100px"; // MAGIC NUMBER, fix this
	honeyPotImg.style.height = "100px"; // MAGIC NUMBER, fix this

	index = Math.floor(Math.random()*honeyPotEffects.length);
	honeyPot.effect = honeyPotEffects[index];

	gameContainer.appendChild(honeyPot);
	honeyPot.appendChild(honeyPotImg);

	honeyPot.delete = setTimeout(function(){honeyPot.parentNode.removeChild(honeyPot)} , 3000);
}

function honeyPotClick(honeyPot)
{
	console.log(honeyPot.effect);
	// Add a boost of honey equal 10 + to 1 minute of hps
	if (honeyPot.effect == "Boost")
	{
		var boost = (10 + hps*multiplier*60);
		scoreCount += boost;
		temp = new textBox(30, "Arial", honeyPot.x, honeyPot.y, "Boost! +" + simplifyNumber(boost), "#000000", true);
	}

	// Boost hps by 10x for 10 seconds
	else if (honeyPot.effect == "Hyper")
	{
		multiplier *= 10;
		setTimeout(function(){multiplier /= 10} , 10000);
		temp = new textBox(30, "Arial", honeyPot.x, honeyPot.y, "Hyper! x10 Production", "#000000", true);
	}

	honeyPot.parentNode.removeChild(honeyPot);
	allObjects.push(temp);
	clearTimeout(honeyPot.delete);

}

// Takes in a number and returns a shortened string version
function simplifyNumber(number)
{
	if (number < 0)
	{
		number = 0;
		return "0";
	}

	else if (number >= 0 && number < 1000)
	{
		return number.toFixed();
	}

	else if (number >= 1000 && number < 1000000)
	{
		temp = number.toFixed();
		strIndex = temp.length - 3; // This is the index where the comma will go
		return temp.substring(0, strIndex) + "," + temp.substring(strIndex);
	}

	else if (number >= 1000000 && number < 1000000000)
	{
		return (number/1000000).toFixed(3) + " Million";
	}

	else if (number >= 1000000000 && number < 1000000000000)
	{
		return (number/1000000000).toFixed(3) + " Billion";
	}

	else if (number >= 1000000000000 && number < 1000000000000000)
	{
		return (number/1000000000000).toFixed(3) + " Trillion";
	}

	else if (number >= 1000000000000000 && number < 1000000000000000000)
	{
		return (number/1000000000000000).toFixed(3) + " Quadrillion";
	}

	else if (number >= 1000000000000000000 && number < 1000000000000000000000)
	{
		return (number/1000000000000000000).toFixed(3) + " Pentillion";
	}

	else if (number >= 1000000000000000000000 && number < 1000000000000000000000000)
	{
		return (number/1000000000000000000000).toFixed(3) + " Hexillion";
	}

	else if (number >= 1000000000000000000000000 && number < 1000000000000000000000000000)
	{
		return (number/1000000000000000000000000).toFixed(3) + " Septillion";
	}

	else if (number >= 1000000000000000000000000000 && number < 1000000000000000000000000000000)
	{
		return (number/1000000000000000000000000000).toFixed(3) + " Octillion";
	}

	else if (number >= 1000000000000000000000000000000 && number < 1000000000000000000000000000000000)
	{
		return (number/1000000000000000000000000000000).toFixed(3) + " Nonillion";
	}

	else if (number >= 1000000000000000000000000000000000 && number < 1000000000000000000000000000000000000)
	{
		return (number/1000000000000000000000000000000000).toFixed(3) + " Decillion";
	}

	else
	{
		return "Infinity";
	}
	
}