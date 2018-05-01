// The object used for upgrade boosts or displaying Honey Pot effect timers.
// This object will probably never be used, but can be a parent object of different boost types.
function boost(x, y, width, height)
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
	gameContainer.appendChild(this.node);

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

// The object used for displaying a timer for honey pot effects. Inherits boost(). Takes timer length in ms as a parameter.
function effectTimer(reference)
{
	boost.call(this, ((canvasWidth*0.95) - boostSize), (canvasHeight*0.05), boostSize, boostSize);
	this.node.setAttribute("class", "effectTimer");
	this.reference = reference;
	this.length = reference.effectLength;
	this.currentTime = reference.effectLength;

	var buffer = this.y + (boostSize*1.25)*(activeEffects.length);
	this.setY(buffer);

	this.whitespace = document.createElement("div");
	this.whitespace.setAttribute("class", "timer_whitespace");
	this.whitespace.style.height = "0 px";
	this.whitespace.style.width = boostSize + "px"
	this.node.appendChild(this.whitespace);

	this.reference.startEffect();
	allObjects.push(this);
	avoidArray.push(this);

	this.hit = function()
	{
		return;
	}

	this.terminate = function()
	{
		index = avoidArray.indexOf(this);
		avoidArray.splice(index, 1);
		index = allObjects.indexOf(this);
		allObjects.splice(index, 1);

		var that = this; // I hate this
		this.node.parentNode.removeChild(that.node);

		this.reference.endEffect();
	}

	this.setTime = function(length)
	{
		if (this.length < length)
		{
			this.length = length;
		}

		this.currentTime = length;
	}

	this.update = function()
	{
		buffer = (canvasHeight*0.05) + (boostSize*1.25)*activeEffects.indexOf(this.reference);
		this.setY(buffer);

		if (this.currentTime <= 20)
		{
			this.terminate();
		}

		else
		{
			this.currentTime -= 20;
			this.whitespace.style.height = (1 - this.currentTime/this.length)*boostSize + "px";
		}
	}
}