// Creates flower object
// image is an html image element
function flower(x, y, image)
{
	this.x = x;
	this.y = y;
	this.image = image;

	this.originalWidth = flowerWidth;
	this.originalHeight = flowerHeight;
	this.originalX = this.x;
	this.originalY = this.y;
	this.image.width = flowerWidth;
	this.image.height = flowerHeight;

	// Number of seconds before the flower deletes
	this.lifeSpan = 10;
	// Minimum honey is 30% of maxFlowerHoney, maximum honey is maxFlowerHoney
	this.honey = Math.floor(Math.random()*(0.71*maxFlowerHoney)) + (.3*maxFlowerHoney);
	
	// How many frames the bee has been hovering over this flower. Starts at 49 so that a "+10" will pop up right away
	this.hoverCount = 49;

	this.getX = function() {
		return this.x;
	}

	this.getY = function() {
		return this.y;
	}

	this.getWidth = function() {
		return this.image.width;
	}

	this.getHeight = function() {
		return this.image.height;
	}

	this.setX = function(x) {
		this.x = x;
	}

	this.setY = function(y) {
		this.y = y;
	}

	// This function is called when the bee is in contact with the flower
	this.hit = function() {
		this.hoverCount++;

		if (this.hoverCount%(collectionSpeed/10) == 0)
		{
			this.honey -= hph/10;
		}
		
		// We can add upgrades that change how long it takes to harvest honey, right now it takes 1 second to get 10 honey
		if (this.hoverCount%collectionSpeed == 0)
		{
			scoreCount += hph;
			// Create a "+10" above the flower
			temp = new textBox(30, "Arial", this.x, this.y-30, "+" + simplifyNumber(hph), "#000000", true);
			allObjects.push(temp);
		}

		// If the flower has no more honey, it dies
		if (this.honey <= 0)
		{
			this.terminate();
		}
	}

	// Every second this flower will age, and its lifespan is shortened
	this.age = function() {

		this.lifeSpan--;

		// If the flower's lifespan has run out, delete it
		if (this.lifeSpan <= 0)
		{
			this.terminate();
		}
	}

	// Deletes the flower from all existing object arrays
	this.terminate = function() {
		index = flowers.indexOf(this);
		flowers.splice(index, 1);
		index = allObjects.indexOf(this);
		allObjects.splice(index, 1);
	}

	// Draw the flower. Shrink according to honey in flower, shift to keep the flower centered
	this.update = function() {
		ctx = myGameArea.context;

		// Shrink flower

		// Minimum width is 1/3 the flowerWidth, so flowers don't get too small
		this.image.width = 2 * this.originalWidth * (this.honey / maxFlowerHoney)/3 + this.originalWidth/3;
		// Minimum height is half the flowerHeight, so flowers don't get too small
		this.image.height = 2 * this.originalHeight * (this.honey / maxFlowerHoney)/3 + this.originalHeight/3;

		// Shift flower

		this.x = this.originalX + (this.originalWidth - this.image.width)/2;
		this.y = this.originalY + (this.originalHeight - this.image.height)/2;

		ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
	}
}