var polygon1 = {
	inverted : false,
	regions : [
		[
			[50, 50],
			[150, 50],
			[150, 150],
			[50, 150]
		],
		[
			[50, 450],
			[50, 350],
			[100, 300],
			[150, 350],
			[400, 350],
			[400, 450]
		]
	]
};
var polygon2 = {
	inverted : false,
	regions : [
		[
			[100, 100],
			[200, 100],
			[200, 200],
			[100, 200]
		],
		[
			[100, 480],
			[70, 310],
			[130, 330],
			[150, 300],
			[300, 400]
		],
		[
			[25, 400],
			[225, 300],
			[475, 400],
			[225, 475]
		]
	]
};

function onchangemode(mode)
{
	draw(mode);
}

function fillRegion(polygon, ctx)
{
	for (let i = 0, countPolygons = polygon.regions.length; i < countPolygons; i++)
	{
		let region = polygon.regions[i];
		let countPoints = region.length;

		if (2 > countPoints)
			continue;

		ctx.moveTo(region[0][0], region[0][1]);

		for (let j = 1, countPoints = region.length; j < countPoints; j++)
		{
			ctx.lineTo(region[j][0], region[j][1]);
		}

		ctx.closePath();
	}
}

function draw(mode)
{
	let width = 500;
	let height = 500;

	let canvasSource = document.getElementById("sources");
	let ctxSource = canvasSource.getContext("2d");

	ctxSource.clearRect(0, 0, width, height);
	ctxSource.strokeStyle = "#000000";
	ctxSource.lineWidth = 1;
	ctxSource.strokeRect(0, 0, width, height);

	// 1
	ctxSource.beginPath();
	ctxSource.fillStyle = "rgba(255, 0, 0, 0.5)";
	fillRegion(polygon1, ctxSource);
	ctxSource.fill("evenodd");

	// 2
	ctxSource.beginPath();
	ctxSource.fillStyle = "rgba(0, 0, 255, 0.5)";
	fillRegion(polygon2, ctxSource);
	ctxSource.fill("evenodd");

	// clear path
	ctxSource.beginPath();

	let canvasResult = document.getElementById("result");
	let ctxResult = canvasResult.getContext("2d");

	ctxResult.clearRect(0, 0, width, height);
	ctxResult.strokeStyle = "#000000";
	ctxResult.lineWidth = 1;
	ctxResult.strokeRect(0, 0, width, height);

	let apply = AscGeometry.PolyBool[mode];

	let time1 = performance.now();
	let regionResult = apply(polygon1, polygon2);
	let time2 = performance.now();

	console.log("time: " + (time2 - time1));

	ctxResult.beginPath();
	fillRegion(regionResult, ctxResult);
	ctxResult.stroke();
	ctxResult.beginPath();
}

window.onload = function()
{
	let combo = document.getElementById("id_mode");
	combo.selectedIndex = 0;
	onchangemode(combo.value);
}
