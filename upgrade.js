//Parker M., Alice W., Catilin C.
//Bees Bees Bees
//Upgrade file for the functionality of the upgrades, including updating costs and number of each upgrade.
//6/3/18


// Creates upgrade object
function upgrade(name, startCost, honeyPerSec)
{
	// This is the node that contains the div
	this.node = document.createElement("div");
	this.node.setAttribute("class", "upgrade unselectable");

	// Save cost, upgrade count, and honey variables to this object
	this.cost = startCost;
	this.costString = this.cost.toString() + " nanoliters";
	this.count = 0;
	this.name = name;
	this.isHovering = false;
	this.hps = honeyPerSec;

	// Used when referencing this object from a function
	var that = this;

	this.node.addEventListener("mouseover", function(){that.hover()});
	this.node.addEventListener("mouseout", function()
	{
		that.isHovering = false;
	});

	// When the upgrade is clicked, go through the buy function
	this.node.addEventListener("click", function(){that.buy()});

	// Set the css and positioning for the upgrade
	this.node.style.width = upgradeCanvasWidth + "px"; // Magic Number for Border
	this.node.style.height = "100px"; // This just looks nice

	// Text that goes inside the upgrade node
	this.node.innerHTML= "<span class='upgradeName'>" + this.name + "</span> <br> <p class = \"upgradeCost\"> Cost: " + this.costString + "</p>"

	// Put the upgrade in the upgradeArea canvas
	upgradeArea.container.appendChild(this.node);
	upgrades.push(this);

	// Called when the upgrade is hovered over
	this.hover = function()
	{
		if (scoreCount >= this.cost)
		{
			this.node.style.backgroundColor = "#d9d9d9";
		}

		this.isHovering = true;
	}

	// Called when this upgrade is bought
	this.buy = function()
	{
		if (scoreCount >= this.cost)
		{
			scoreCount -= this.cost;
			hps += this.hps;
			this.cost *= 1.25;
			this.costString = simplifyNumber(this.cost);
			this.count += 1;
			this.node.innerHTML = "<span class='upgradeName'>" + this.name + "</span> <br> <p class = \"upgradeCost\"> Cost: " + this.costString + "</p> <p class = \"upgradeCount\"> " + this.count + "</p>"
		}
	}
}