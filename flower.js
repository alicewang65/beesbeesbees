// Creates flower object
// image is an html image element
function flower(x, y, image)
{
	this.x = x;
	this.y = y;
	this.image = image;

	// Consider making the widths/heights proportional to honey at the start (right now the valid hover space is bigger than the drawing if the initial honey is less than max). This might be hard to fix
	this.image.width = flowerWidth;
	this.image.height = flowerHeight;

	// Number of seconds before the flower deletes
	this.lifeSpan = 10;
	// Minimum honey is 30% of maxFlowerHoney, maximum honey is maxFlowerHoney
	this.honey = Math.floor(Math.random()*(0.71*maxFlowerHoney)) + (.3*maxFlowerHoney);
	
	// How many frames the bee has been hovering over this flower
	this.hoverCount = 0;

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
		
		// We can add upgrades that change how long it takes to harvest honey, right now it takes 1 second to get 10 honey
		if (this.hoverCount%50 == 0)
		{
			scoreCount += 10;
			this.honey -= 10;
			// Create a "+10" above the flower
			temp = new textBox(30, "Arial", this.x, this.y-30, "+10", "#000000", true);
			allObjects.push(temp);

			// Adjust for the position change that happens when width/height change
			this.x++;
			this.y++;

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

	// Draw the flower
	this.update = function() {
		ctx = myGameArea.context;
		// Minimum width is 1/3 the flowerWidth, so flowers don't get too small
		tempWidth = this.image.width * ((maxFlowerHoney/3 + this.honey/3) / maxFlowerHoney);
		// Minimum height is half the flowerHeight, so flowers don't get too small
		tempHeight = this.image.height * ((maxFlowerHoney/3 + this.honey/3) / maxFlowerHoney);
		ctx.drawImage(this.image, this.x, this.y, tempWidth, tempHeight);
	}
}