// The array of possible honeyPot effects, and their properties. Every honeyPot will contain the properties of one of these effects.
// Text is the textbox the effect creates, interact begins the intitial effects, startEffect begins the effect, and endEffect ends the effect.
var honeyPotEffects = [
	// Boost Effect: Adds 10 honey + 1 minute of Hps to the score count.
	{
		name: "Boost",
		timer: 0,
		text: function() {
			var boost = (10 + hps*multiplier*60);
			temp = new textBox(30, "Arial", this.x, this.y, "Boost! +" + simplifyNumber(boost), "#000000", true);
		},
		interact: function() {
			var boost = (10 + hps*multiplier*60);
			scoreCount += boost;
		},
		startEffect: function() {
		},
		endEffect: function() {
		}
	},

	// Hyper Effect: Multiplies Hps by 10 for ten seconds
	{
		name: "Hyper",
		timer: 10000,
		text: function() {
			temp = new textBox(30, "Arial", this.x, this.y, "Hyper! x10 Production", "#000000", true);
		},
		interact: function() {
			// Creates timer for the effect
			this.timer = new effectTimer(this);
		},
		startEffect: function() {
			multiplier *= 10;
			// Add this to the array of active effects
			activeEffects.push(this);
		},
		endEffect: function() {
			multiplier /= 10;
			honeyPot.removeEffect();
		}
	},

	// Flower Power Effect: All flowers are bundles, and give 150x honey per hover interval
	{
		name: "Flower Power",
		timer: 15000,
		text: function() {
			temp = new textBox(30, "Arial", this.x, this.y, "Flower Power! ", "#000000", true);
		},
		interact: function() {
			// creates timer for this efect
			this.timer = new effectTimer(this);
		},
		startEffect: function() {
			// Flowers are worth 1500x honey per hover
			maxFlowerHoney *= 1500;
			// All flowers will spawn as bundles
			flowerBundle = true;

			// Delete all flowers from flower array and allObjects array
			for (ii = flowers.length - 1; ii >= 0; ii--)
			{
				flowers[ii].terminate();
			}

			// Re-fill the game canvas with flowers
			obstacleChange();

			// Add this to the array of active effects
			activeEffects.push(this);
		},
		endEffect: function() {
			// Delete all flowers from flower array and allObjects array
			for (ii = flowers.length - 1; ii >= 0; ii--)
			{
				flowers[ii].terminate();
			}

			// Stop spawning flowerBundles
			flowerBundle = false;
			// Flower honey is back to original amount
			maxFlowerHoney /= 1500;

			// Refill the canvas with normal flowers
			obstacleChange();
			honeyPot.removeEffect();
		}
	}];
	// More ideas: "Swarm" - clears screen of flowers and collects all honey at once



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

	// Creating the image and sizing it
	this.image = document.createElement("IMG");
	this.image.setAttribute("src", "honey pot.png");
	this.image.style.width = honeyPotSize + "px";
	this.image.style.height = honeyPotSize + "px";

	// Gets and applies a random honey pot effect/properties
	index = Math.floor(Math.random()*honeyPotEffects.length);
	this.effect = honeyPotEffects[index].name;
	this.effectLength = honeyPotEffects[index].timer;
	this.text = honeyPotEffects[index].text;
	this.interact = honeyPotEffects[index].interact;
	this.startEffect = honeyPotEffects[index].startEffect;
	this.endEffect = honeyPotEffects[index].endEffect;
	this.timer;

	// Attach the node to the game container
	this.node.appendChild(this.image);
	gameContainer.appendChild(this.node);

	// The node will self-delete after 3 seconds if it is not clicked
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
		// Creates the textbox for this effect.
		this.text();

		// Check if this effect is already active
		arrayIndex = activeEffects.findIndex(honeyPot.searchEffect);

		// If it is active, clear the timer and reset the effect duration
		if (arrayIndex > -1)
		{
			activeEffects[arrayIndex].timer.setTime(this.effectLength);
		}

		// If it is not active, start the effect and begin the timer to end the effect.
		else
		{
			// This is a honeyPot effect function that determines the initial response to clicking a honey pot. Usually just makes the timer.
			this.interact();
		}

		// Deletes the node from the game container
		this.node.parentNode.removeChild(this.node);
		// Create text box
		allObjects.push(temp);
		// Prevent the node from self-deleting in 3 seconds, because it has already deleted
		clearTimeout(this.delete);
	}

	// Finds an active effect inside the activeEffects array
	honeyPot.searchEffect = function(element)
	{
		return element.effect == that.effect;
	}

	// Remove this honey pot effect from the array of active effects
	honeyPot.removeEffect = function()
	{
		arrayIndex = activeEffects.indexOf(this);
		activeEffects.splice(arrayIndex, 1);
	}
}