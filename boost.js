// The object is used for honey pots and displaying Honey Pot effect timers.
// This object will probably never be used, but can be a parent object of different boost types.
function boost(x, y, width, height, imageSrc, symbol)
{
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;

	// The node that carries the div (required for placing the div in the game container)
	this.node = document.createElement("div");

	// Node Styling
	this.node.style.width = this.width + "px";
	this.node.style.height = this.height + "px";
	this.node.style.left = this.x + "px";
	this.node.style.top = this.y + "px";

	this.image = document.createElement("IMG");
	this.image.setAttribute("src", imageSrc);
	this.image.style.width = this.width + "px";
	this.image.style.height = this.height + "px";
	this.image.style.position = "absolute";
	this.node.appendChild(this.image);

	if (symbol !== null)
	{
		this.symbol = document.createElement("IMG");
		this.symbol.setAttribute("src", symbol);
		this.symbol.style.width = this.width*.9 + "px";
		this.symbol.style.height = this.height*.9 + "px";
		this.symbol.style.position = "absolute";
		this.node.appendChild(this.symbol);
	}


	this.getX = function() {
		return this.x;
	}

	this.getY = function() {
		return this.y;
	}

	this.getWidth = function() {
		return this.width;
	}

	this.getHeight = function() {
		return this.height;
	}

	this.setX = function(x) {
		this.x = x;
		this.node.style.left = x + "px";
	}

	this.setY = function(y) {
		this.y = y;
		this.node.style.top = y + "px";
	}
}

// The object used for displaying a timer for honey pot effects. Inherits boost(). Takes a honeypot as a parameter.
function effectTimer(reference)
{
	// Create the general structure of a timer
	boost.call(this, ((canvasWidth*0.95) - boostSize), (canvasHeight*0.05), boostSize, boostSize, "hexagon.png", reference.imageSrc);

	gameContainer.appendChild(this.node);

	this.node.setAttribute("class", "effectTimer");

	// Set the honey pot reference to this timer
	this.reference = reference;
	// Get the timer length values for the passed in honey pot effect
	this.length = reference.effectLength;
	this.currentTime = reference.effectLength;

	// Position the y value of the node, which will bump below any other timers
	var buffer = this.y + (boostSize*1.25)*(activeEffects.length);
	this.setY(buffer);

	// Create the whitespace div that covers up the gold in the timer.
	this.whitespace = document.createElement("div");
	this.whitespace.setAttribute("class", "timer_whitespace");
	this.whitespace.style.height = "0 px";
	this.whitespace.style.width = boostSize + "px";
	this.whitespace.style.position = "absolute";
	this.node.appendChild(this.whitespace);

	// Start the honey pot effect
	this.reference.startEffect();
	// Add this timer to the game arrays
	allObjects.push(this);
	avoidArray.push(this);

	// Required for allObjects array
	this.hit = function()
	{
		return;
	}

	// Called when the timer has run out
	this.terminate = function()
	{
		// Delete the timers from all arrays
		index = avoidArray.indexOf(this);
		avoidArray.splice(index, 1);
		index = allObjects.indexOf(this);
		allObjects.splice(index, 1);

		// Remove the timer node from the game area
		var that = this; // I hate this
		this.node.parentNode.removeChild(that.node);

		// End the honey pot effect
		this.reference.endEffect();
	}

	// Used to update timer length
	this.setTime = function(length)
	{
		if (this.length < length)
		{
			this.length = length;
		}

		this.currentTime = length;
	}

	// Called every 20 ms by updateGameArea(). Updates the whitespace on the timer node.
	this.update = function()
	{
		// Fix the y positioning of the timer in case a timer above it has been deleted.
		buffer = (canvasHeight*0.05) + (boostSize*1.25)*activeEffects.indexOf(this.reference);
		this.setY(buffer);

		// If the timer has run out, delete it.
		if (this.currentTime <= 20)
		{
			this.terminate();
		}

		// Otherwise, update the whitespace.
		else
		{
			this.currentTime -= 20;
			this.whitespace.style.height = (1 - this.currentTime/this.length)*(boostSize) + "px";
		}
	}
}

// The object for "mini upgrades", which appear in a section of the store. These are very similar in appearance to timers,
// and decrease the amount of time it takes for a honey pot to spawn.
function miniUpgrade(type)
{
	// Create the node structure
	boost.call(this, 0, 0, miniSize, miniSize, "upgradehexagon.png", "honey pot.png");

	// Add the node to the store area that contains all mini upgrades
	upgradeArea.storeArea.appendChild(this.node);

	this.node.setAttribute("class", "miniUpgrade unselectable");

	// Add all event listeners for the mini
	var that = this;
	this.node.addEventListener("mouseover", function(){that.hover()});
	this.node.addEventListener("mouseout", function(){that.unhover()});
	this.node.addEventListener("click", function(){that.click()});

	// When hovered over, this mini will have a background color of gray
	this.hover = function()
	{
		this.node.style.backgroundColor = "#d9d9d9";
	}

	// When the user stops hovering, the mini regains a white background
	this.unhover = function()
	{
		this.node.style.backgroundColor = "#ffffff";
	}

	// When clicked the mini will decrease the time it takes for a honey pot to spawn, then remove itself from the store.
	// We didn't have enough time to make/show a cost for minis, so they are free.
	this.click = function()
	{
		// Makes sure that purchasing the mini won't cause a fatal error with divide by 0 or negative number
		if (hpSpawnRate > 250)
		{
			// Reduce time it takes to spawn a honey pot by 5 seconds
			hpSpawnRate -= 250;
		}

		// Deletes the node from the game container
		this.node.parentNode.removeChild(this.node);

		// Removes this mini upgrade from the array of available ones
		arrayIndex = miniUpgrades.indexOf(this);
		miniUpgrades.splice(arrayIndex, 1);
	}

	// Add the mini upgrade to the array holding mini references, after it's been created
	miniUpgrades.push(this);
}