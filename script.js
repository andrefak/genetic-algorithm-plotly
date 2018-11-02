var genQtt = 50;
var szPop = 50;
var mutRatio = 0.5;
var MAX = 20;

function getF(x, y) {
	return Math.exp(Math.sin(x)) - Math.sin(x*x*x*y*y) + Math.sqrt(y/10) + Math.log(x*x*x*x*y*y*y+1) - Math.sqrt(x/10);
	// return (x*x/9 + y*y/16)/25;
}

function setup() {
	DIV = document.getElementById('plot-function');
	var nX = MAX;
	var nY = MAX;

	var f = new Array(nX).fill(new Array(nY));

	_z = [];
	for (var y = 0; y < nY; y++) {
		_zrow = [];
		for (var x = 0; x < nX; x++) {
			var vZ = getF(x, y);

			f[x][y] = vZ;
			_zrow.push(vZ);
		}
		_z.push(_zrow);
	}

	var data = {z : _z, type: 'surface'};

	return f, data;
}

function initPop() {
	var ind = [];
	for (var i = 0; i < szPop; i++)
		ind.push([Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX)]);
	return ind;
}

function genFitness(ind) {
	var fit = [];
	for (var i = 0; i < szPop; i++)
		fit.push(getF(ind[i][0], ind[i][1]));
	return fit;
}

//elitism: the best to transa with everybody
function selectPop(ind, fit) {

	//find the best
	var best = 0;
	for (var i = 1; i < szPop; i++) 
		if (fit[i] > fit[best]) best = i;

	//crossover
	for (var i = 0; i < szPop; i++) { 
		ind[i][0] = (ind[i][0] + ind[best][0]) / 2;
		ind[i][1] = (ind[i][1] + ind[best][1]) / 2;
	}

	fit = genFitness(ind);

	//mutation
	for (var i = 0; i < szPop; i++) {
		var bkp1 = ind[i][0];
		var bkp2 = ind[i][1];

		if (fit[i] != fit[best]) {
			ind[i][0] = Math.floor(ind[i][0]*(Math.random()/mutRatio+1));
			ind[i][1] = Math.floor(ind[i][1]*(Math.random()/mutRatio+1));
		}

		if (ind[i][0] >= MAX || ind[i][1] >= MAX) {
			ind[i][0] = bkp1;
			ind[i][1] = bkp2;
			i--;
		}
	}

	fit = genFitness(ind);
	
	return ind, fit;
}

function findTheMax(ind, fit) {
	var pX = new Array(szPop);
	var pY = new Array(szPop);
	var pZ = new Array(szPop);

	for (var i = 0; i < genQtt; i++) {
		ind, fit = selectPop(ind, fit);

		pX = [];
		pY = [];
		pZ = [];

		for (var i = 0; i < szPop; i++) {
			pX.push(ind[i][0]);
			pY.push(ind[i][1]);
			pZ.push(fit[i]);
		}
	}

	var points = {
		x: pX,
		y: pY,
		z: pZ,
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

	return points; // pX, pY, pZ;
}

var f, data = setup();

var ind = initPop();
var fit = genFitness(ind);

var points = findTheMax(ind, fit);

Plotly.newPlot(DIV, [data, points]);