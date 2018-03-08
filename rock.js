// Creates canvas components
// image is an html image element
function rock(x, y)
{
	this.x = x;
	this.y = y;

	this.width = rockSize;
	this.height = rockSize;

	this.image = new Image();
	this.image.src = "rock.png";

	// Number of seconds before the rock deletes
	this.lifeSpan = 30;

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
	}

	this.setY = function(y) {
		this.y = y;
	}

	// This function is called when the bee is in contact with the rock
	this.hit = function() {
		// How many points do we want a rock to take off?
		if (scoreCount >= 20)
			scoreCount -= 20;

		else
			scoreCount = 0;

		// Create a "-20" above the rock
		temp = new textBox(30, "Arial", this.x, this.y-30, "-20", "#e80b0b", true);
		allObjects.push(temp);

		this.terminate();
	}

	// Every second this rock will age, and its lifespan is shortened
	this.age = function() {

		this.lifeSpan--;

		// If the rock's lifespan has run out, delete it
		if (this.lifeSpan <= 0)
		{
			this.terminate();
		}
	}

	// Deletes the rock from all arrays
	this.terminate = function() {
		index = rocks.indexOf(this);
		rocks.splice(index, 1);
		index = allObjects.indexOf(this);
		allObjects.splice(index, 1);
	}

	// Draw the rock
	this.update = function() {
		ctx = myGameArea.context;
		ctx.fillStyle = "#4d5259";
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}