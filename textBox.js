//Parker M., Alice W., Catilin C.
//Bees Bees Bees
//Text box file for the functionality of the texts boxes.
//6/3/18


// The object used for all canvas context drawn textboxes.
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

	// Gets the canvas drawing context
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
		ctx.font = this.fontSize + " " + this.fontStyle;
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

		// Sets the transparency of the text
		ctx.globalAlpha = this.transparency;
		ctx.fillStyle = this.fontColor;
		ctx.fillText(this.text, this.x, this.y);
		ctx.globalAlpha = 1;
	}
}


// The object used for any textboxes that need to be divs (not canvas). Appends the div to the game wrapper
function stringBox(fontSize, x, y, text, time)
{
	textBox.call(this, fontSize, "Arial", x, y, text, "#000000", false);
	this.y = y;
	this.time = time;

	// The node that carries the div (required for placing the div in the wrapper)
	this.node = document.createElement("div");
	this.node.setAttribute("class", "TextBox unselectable");

	this.par = document.createElement("P");
	this.par.setAttribute("class", "BoxText unselectable");
	this.par.innerHTML = this.text;
	this.par.style.fontSize = this.fontSize;
	this.par.style.fontStyle = this.fontStyle;
	this.par.style.color = this.fontColor;

	//Gets the width of the text in the current font
	this.width = this.par.getBoundingClientRect().width;
	// Text height is just font size
	this.height = this.par.getBoundingClientRect().height;

	// Node Styling
	this.node.style.left = this.x - this.width + "px";
	this.node.style.top = this.y - this.height + "px";

	var container = document.getElementById("wrapper");
	this.node.appendChild(this.par);
	container.appendChild(this.node);

	this.getY = function() {
		return this.y;
	}

	this.getWidth = function() {
		this.width = this.par.getBoundingClientRect().width;
		return this.width;
	}

	this.getHeight = function() {
		this.height = this.par.getBoundingClientRect().height;
		return this.height;
	}

	this.setY = function(y) {
		this.y = y;
	}

	// Changes the text of this textBox
	this.setText = function(text) {
		this.text = text;
		this.par.innerHTML = text;
	}

	// Draws the textbox to the canvas
	this.update = function() {

		this.time--;

		// If the time has run out, delete the string box
		if (this.time == 0)
		{
			index = allObjects.indexOf(this);
			allObjects.splice(index, 1);
			this.node.parentNode.removeChild(this.node);
			return;
		}
	}
}