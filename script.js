var genQtt = 5;
var szPop = 5;
var mutRatio = 1;
var MAX = 20;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getF(x, y) {
	return Math.exp(Math.sin(x)) - Math.sin(x*x*x*y*y) + Math.sqrt(y/10) + Math.log(x*x*x*x*y*y*y+1) - Math.sqrt(x/10);
	// return (x*x/9 + y*y/16)/25;
	// return x*Math.sin(x) + y*Math.cos(y);
	// return x + y;
}

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
function selectPop(indX, indY, fit) {
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

function addText(indX, indY, fit, gen) {
	var best = findTheBest(fit);
	
	var str = "<br>[" + gen.toString() + "] ";
	for (var i = 0; i < szPop; i++) {
		if (i === best) str += "<b>";
		str += "(" + indX[i].toFixed(1).toString() + "," + indY[i].toFixed(1).toString() + "," + fit[i].toFixed(1).toString() + ") ";
		if (i === best) str += "</b>";
	}
	
	document.getElementById('points-description').innerHTML += str.toString();
}

function plotEverything(data, coords) {
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

	Plotly.newPlot('plot-function', [data, points]);
}

function findTheMax(indX, indY, fit, data) {
	var coord = [];

	for (var i = 0; i < genQtt; i++) {
		plotEverything(data, [indX, indY, fit]);
		addText(indX, indY, fit, i);

		// animPoints(data, ind, fit);
		coord = selectPop(indX, indY, fit);

		indX = coord[0];
		indY = coord[1];
		fit  = coord[2];

		sleep(100);
	}

	addText(indX, indY, fit, genQtt);
	plotEverything(data, [indX, indY, fit]);
}

var data = setup();

var indX = initPop();
var indY = initPop();

var fit = genFitness(indX, indY);

var points = findTheMax(indX, indY, fit, data);