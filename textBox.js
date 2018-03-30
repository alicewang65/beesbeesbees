// The object used for the score textBox, as well as any other necessary texts
// fontSize, x, and y are ints, and everything else is a string/bool
function textBox(fontSize, fontStyle, x, y, text, color, animate)
{
	this.fontSize = fontSize.toString() + "px";;
	this.fontStyle = fontStyle;
	this.x = x;
	// For some reason canvas text prints up instead of down, so when setting the y we need
	// to adjust for this
	this.y = y + fontSize;
	this.text = text;
	this.fontColor = color;
	// Determines whether or not the text box will fade
	this.animate = animate;
	// Initially the image is completely opaque
	this.transparency = 1;

	ctx = myGameArea.context;
	ctx.font = this.fontSize + " " + this.fontStyle;

	//Gets the width of the text in the current font
	this.width = ctx.measureText(this.text).width;
	// Text height is just font size
	this.height = fontSize;

	this.getX = function() {
		return this.x;
	}

	this.getY = function() {
		// For some reason canvas text prints up instead of down, so when getting the y we need
		// to adjust for this
		return this.y - this.height;
	}

	this.getWidth = function() {
		this.width = ctx.measureText(this.text).width;
		return this.width;
	}

	this.getHeight = function() {
		return this.height;
	}

	this.setX = function(x) {
		this.x = x;
	}

	this.setY = function(y) {
		// For some reason canvas text prints up instead of down, so when setting the height we have to adjust for this
		this.y = y + this.height;
	}

	// Changes the text of this textBox
	this.setText = function(text) {
		this.text = text;
		ctx = myGameArea.context;
		ctx.font = this.fontSize + " " + this.fontStyle;
		this.width = ctx.measureText(this.text).width;
	}

	this.hit = function() {
		return;
	}

	// Makes animated text slowly fade to invisible
	this.adjustTransparency = function() {
		this.transparency -= .02;
	}

	// Draws the textbox to the canvas
	this.update = function() {
		hitWall(this);

		ctx = myGameArea.context;
		ctx.font = this.fontSize + " " + this.fontStyle;

		// If this text should be animated, change the transparency value
		if (this.animate)
		{
			this.adjustTransparency();
			this.y--;
		}

		// If the text is invisible or invalid, delete the text box and don't draw
		if (this.transparency <= 0)
		{
			index = allObjects.indexOf(this);
			allObjects.splice(index, 1);
			return;
		}

		ctx.globalAlpha = this.transparency;
		ctx.fillStyle = this.fontColor;
		ctx.fillText(this.text, this.x, this.y);
		ctx.globalAlpha = 1;
	}
}