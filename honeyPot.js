// Creates Honey Pot object
function honeyPot()
{
	// The node that carries the div (required for placing the div in the game container)
	this.node = document.createElement("div");
	this.node.setAttribute("class", "honeyPot");
	var that = this; // I hate this

	// Returnable variables
	this.width = honeyPotSize;
	this.height = honeyPotSize;
	this.x = Math.floor(Math.random()*(canvasWidth - this.width));
	this.y = Math.floor(Math.random()*(canvasHeight - this.height));

	// Node Styling
	this.node.style.width = this.width + "px";
	this.node.style.height = this.height + "px";
	this.node.style.left = this.x + "px";
	this.node.style.top = this.y + "px";
	this.node.addEventListener("click", function(){that.click()});

	this.image = document.createElement("IMG");
	this.image.setAttribute("src", "honey pot.png");
	this.image.style.width = honeyPotSize + "px";
	this.image.style.height = honeyPotSize + "px";

	// Gets a random honey pot effect
	index = Math.floor(Math.random()*honeyPotEffects.length);
	this.effect = honeyPotEffects[index];

	// Attach the node to the game container
	this.node.appendChild(this.image);
	gameContainer.appendChild(this.node);

	// The node will self-delete after 3 seconds
	this.delete = setTimeout(function(){that.node.parentNode.removeChild(that.node)} , 3000);

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

	// Called when the honey pot (node) is clicked
	this.click = function()
	{
		// Add a boost of honey equal 10 + to 1 minute of hps
		if (this.effect == "Boost")
		{
			var boost = (10 + hps*multiplier*60);
			scoreCount += boost;
			temp = new textBox(30, "Arial", this.x, this.y, "Boost! +" + simplifyNumber(boost), "#000000", true);
		}

		// Boost hps by 10x for 10 seconds
		else if (this.effect == "Hyper")
		{
			multiplier *= 10;
			setTimeout(function(){multiplier /= 10} , 10000);
			temp = new textBox(30, "Arial", this.x, this.y, "Hyper! x10 Production", "#000000", true);
		}

		// Deletes the node from the game container
		this.node.parentNode.removeChild(this.node);
		// Create text box
		allObjects.push(temp);
		// Prevent the node from self-deleting in 3 seconds, because it has already deleted
		clearTimeout(this.delete);
	}
}