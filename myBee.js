//Parker M., Alice W., Catilin C.
//Bees Bees Bees
//Bee file for the functionality of the bee, including moving it and drawing it.
//6/3/18


// Bee object, which interacts with game screen and follows the mouse
var myBee = 
{
	start : function() {
		// Gets the bee image from the html code
		this.image = new Image();
		this.image.src = "bee.png";
		// These widths and heights look like a good size for the bee
		this.image.width = beeSize;
		this.image.height = beeSize;
		// Starting x and y positions before the mouse has moved
		this.x = canvasWidth/2 - this.image.width;
		this.y = canvasHeight/2 - this.image.height;
	},

	getX : function() {
		return this.x;
	},

	getY : function() {
		return this.y;
	},

	getWidth : function() {
		return this.image.width;
	},

	getHeight : function() {
		return this.image.height;
	},

	setX : function(x) {
		this.x = x;
	},

	setY : function(y) {
		this.y = y;
	},

	// Moves the bee to the mouse location
	newPos : function(x, y) {
		this.x = x - (this.image.width)/2;
		this.y = y - (this.image.height)/2;
		hitWall(this);
	},

	// Draws the bee to the canvas
	draw : function() {
		ctx = myGameArea.context;
		ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
	}
}