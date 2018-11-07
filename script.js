var genQtt, szPop, mutRatio;
var MAX = 50;

//return the f(x, y)
function getF(x, y) {
	return Math.exp(Math.sin(x)) - Math.sin(x*x*x*y*y) + Math.sqrt(y/10) + Math.log(x*x*x*x*y*y*y+1) - Math.sqrt(x/10);
	// return (x*x/9 + y*y/16)/25;
	// return x*Math.sin(x) + y*Math.cos(y);
	// return x + y;
}

//return the main function (the colorized one).
//TODO: replace this with a CSV
function setup() {
	var _z = [];
	for (var y = 0; y < MAX+1; y++) {
		var _zrow = [];
		for (var x = 0; x < MAX+1; x++)
			_zrow.push(getF(x, y));
		_z.push(_zrow);
	}

	return {z : _z, type: 'surface'};
}

//initialize the population with random values
function initPop() {
	var ind = [];
	for (var i = 0; i < szPop; i++)
		ind.push(Math.random() * MAX);
	return ind;
}

function genFitness(indX, indY) {
	var fit = [];
	for (var i = 0; i < szPop; i++)
		fit.push(getF(indX[i], indY[i]));
	return fit;
}

function findTheBest(fit) {
	var best = 0;
	for (var i = 1; i < szPop; i++) 
		if (fit[i] > fit[best]) best = i;
	return best;
}

//elitism: the best to transa with everybody
function selectElitism(indX, indY, fit) {
	//find the best
	var best = findTheBest(fit);

	//crossover
	for (var i = 0; i < szPop; i++) { 
		indX[i] = (indX[i] + indX[best]) / 2;
		indY[i] = (indY[i] + indY[best]) / 2;
	}

	fit = genFitness(indX, indY);

	//mutation
	for (var i = 0; i < szPop; i++) {
		var bkp1 = indX[i];
		var bkp2 = indY[i];

		if (fit[i] != fit[best]) {
			indX[i] = indX[i]*(Math.random()/mutRatio+1);
			indY[i] = indY[i]*(Math.random()/mutRatio+1);
		}

		if (indX[i] >= MAX || indY[i] >= MAX) {
			indX[i] = bkp1;
			indY[i] = bkp2;
			i--;
		}
	}

	fit = genFitness(indX, indY);

	var coord = [indX, indY, fit];
	
	return coord;
}

function selectRoulette(indX, indY, fit) {
	//find the best
	var best = findTheBest(fit);

	//crossover
	for (var i = 0; i < szPop; i++) { 
		indX[i] = (indX[i] + indX[best]) / 2;
		indY[i] = (indY[i] + indY[best]) / 2;
	}

	fit = genFitness(indX, indY);

	//mutation
	for (var i = 0; i < szPop; i++) {
		var bkp1 = indX[i];
		var bkp2 = indY[i];

		if (fit[i] != fit[best]) {
			indX[i] = indX[i]*(Math.random()/mutRatio+1);
			indY[i] = indY[i]*(Math.random()/mutRatio+1);
		}

		if (indX[i] >= MAX || indY[i] >= MAX) {
			indX[i] = bkp1;
			indY[i] = bkp2;
			i--;
		}
	}

	fit = genFitness(indX, indY);

	var coord = [indX, indY, fit];
	
	return coord;
}

function selectTourney(indX, indY, fit) {
	//find the best
	var best = findTheBest(fit);

	//crossover
	for (var i = 0; i < szPop; i++) { 
		indX[i] = (indX[i] + indX[best]) / 2;
		indY[i] = (indY[i] + indY[best]) / 2;
	}

	fit = genFitness(indX, indY);

	//mutation
	for (var i = 0; i < szPop; i++) {
		var bkp1 = indX[i];
		var bkp2 = indY[i];

		if (fit[i] != fit[best]) {
			indX[i] = indX[i]*(Math.random()/mutRatio+1);
			indY[i] = indY[i]*(Math.random()/mutRatio+1);
		}

		if (indX[i] >= MAX || indY[i] >= MAX) {
			indX[i] = bkp1;
			indY[i] = bkp2;
			i--;
		}
	}

	fit = genFitness(indX, indY);

	var coord = [indX, indY, fit];
	
	return coord;
}

function addText(div, indX, indY, fit, gen) {
	var best = findTheBest(fit);
	
	var str = "<br>[" + gen.toString() + "] ";
	for (var i = 0; i < szPop; i++) {
		if (i === best) str += "<b>";
		// str += "(" + indX[i].toFixed(1).toString() + "," + indY[i].toFixed(1).toString() + "," + fit[i].toFixed(1).toString() + ") ";
		str += fit[i].toFixed(2).toString() + " ";
		if (i === best) str += "</b>";
	}

	var desc;
	if (div === "func-elitism") desc = "desc-elitism";
	if (div === "func-roulette") desc = "desc-roulette";
	if (div === "func-tourney") desc = "desc-tourney";
	document.getElementById(desc).innerHTML += str.toString();
}

function plotEverything(div, data, coords) {
	var points = {
		x: coords[0],
		y: coords[1],
		z: coords[2],
		mode: 'markers', 
		marker: {
			size: 1,
			line: {
				color: 'rgba(217, 217, 217, 0.14)',
				width: 0.5
			},
			opacity: 0.8
		},
		type: 'scatter3d'
	};

	var layout = {
		autosize: false,
		width: 500,
		height: 500
	}

	Plotly.purge(div);
	Plotly.plot(div, [data, points], layout);
}

function findTheMax(div, indX, indY, fit, data) {
	var coord = [];
	var maximum = [];

	//clears the text
	var desc;
	if (div === "func-elitism") desc = "desc-elitism";
	if (div === "func-roulette") desc = "desc-roulette";
	if (div === "func-tourney") desc = "desc-tourney";
	document.getElementById(desc).innerHTML = "";

	for (var i = 0; i < genQtt; i++) {
		addText(div, indX, indY, fit, i);
		maximum.push(fit[findTheBest(fit)]);

		if (div === "func-elitism") coord = selectElitism(indX, indY, fit);
		if (div === "func-roulette") coord = selectRoulette(indX, indY, fit);
		if (div === "func-tourney") coord = selectTourney(indX, indY, fit);

		indX = coord[0];
		indY = coord[1];
		fit  = coord[2];
	}

	maximum.push(fit[findTheBest(fit)]);
	addText(div, indX, indY, fit, genQtt);
	plotEverything(div, data, [indX, indY, fit]);

	return maximum;
}

function generateAll() {
	genQtt = document.getElementById("generations").value;
	szPop = document.getElementById("population").value;
	mutRatio = document.getElementById("mutation").value;

	var elitism = document.getElementById("elitism").checked;
	var roulette = document.getElementById("roulette").checked;
	var tourney = document.getElementById("tourney").checked;

	var data = setup();

	var indX = initPop();
	var indY = initPop();

	var fit = genFitness(indX, indY);

	//change the width of the functions
	var elements = document.getElementsByClassName("points-description");
	for (var i = 0; i < elements.length; i++)
		elements[i].style.width = (self.innerWidth - 700 + "px");


	var maxOfEach = [];
	var maxi = [];

	if (elitism === true) {
		document.getElementById("f-elitism").style.display = "block";
		maxi = [];
		maxi.push(findTheMax("func-elitism", indX, indY, fit, data));
		maxi.push("Elitism");
		maxOfEach.push(maxi);
	} else {
		document.getElementById("f-elitism").style.display = "none";
	}


	if (roulette === true) {
		document.getElementById("f-roulette").style.display = "block"; 
		maxi = [];
		maxi.push(findTheMax("func-roulette", indX, indY, fit, data));
		maxi.push("Roulette");
		maxOfEach.push(maxi);
	} else {
		document.getElementById("f-roulette").style.display = "none";
	}

	if (tourney === true) {
		document.getElementById("f-tourney").style.display = "block";
		maxi = [];
		maxi.push(findTheMax("func-tourney", indX, indY, fit, data));
		maxi.push("Tourney");
		maxOfEach.push(maxi);
	} else {
		document.getElementById("f-tourney").style.display = "none";
	}

	//plot the comparison
	document.getElementById("f-compare").style.display = "block";

	var cX = [];
	for (var i = 0; i <= genQtt; i++)
		cX.push(i);
	var traces = [];
	for (var i = 0; i < maxOfEach.length; i++) {
		var t = {
			x: cX,
			y: maxOfEach[i][0],
			mode: 'lines+markers',
			name: maxOfEach[i][1],
			font: {
				size: 16
			}
		};
		traces.push(t);
	}

	var layout = {
		yaxis: {range: [0, MAX]}
	};

	Plotly.purge('func-compare');
	Plotly.plot('func-compare', traces, layout);
}
