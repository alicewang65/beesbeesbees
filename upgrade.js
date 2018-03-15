// Creates upgrade object
function upgrade()
{
	// Draw the upgrade
	this.draw = function()
	{
		ctx = upgradeArea.context;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 100, upgradeWidth, 50);
	}
}