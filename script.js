var genQtt, szPop, mutRatio, plotOrNo; //number of generations, genes, mutation ratio
var MAX = 20, maxZ = 0, minZ = 0; //maximum of X and Y; maximum and minimum Z found (by the original function)
var funcToPlot; //the function to plot

//return the f(x, y)
var getF = function(x, y) {
	return eval(funcToPlot);
}

//return the main function (the colorized one).
function setup() {
	minZ = maxZ = 0;

	var _z = [];
	for (var y = 0; y < MAX+1; y++) {
		var _zrow = [];
		for (var x = 0; x < MAX+1; x++) {
			_zrow.push(getF(x, y));
			if (_zrow[x] > maxZ) maxZ = _zrow[x];
			if (_zrow[x] < minZ) minZ = _zrow[x];
		}
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

//return the fitness array with the x and y values.
function genFitness(indX, indY) {
	var fit = [];
	for (var i = 0; i < szPop; i++)
		fit.push(getF(indX[i], indY[i]));
	return fit;
}

//return the index of the best on the fitness array
function findTheBest(fit) {
	var best = 0;
	for (var i = 1; i < szPop; i++) 
		if (fit[i] > fit[best]) best = i;
	return best;
}

//mutate a gene
function mutateGene(ind) {
	if (mutRatio === 0) return ind;
	// ret = ind + ( (Math.random() * ((parseFloat(mutRatio)))) - 0.5);

	var maxPos = ind * (1 + mutRatio/100);
	if (maxPos > MAX) maxPos = MAX;

	var minPos = ind * (1 - mutRatio/100);
	if (minPos < 0) minPos = 0;

	ret = Math.random()*(maxPos-minPos) + minPos;
	return ret;
}

//elitism: the best to transa with everybody
function selectElitism(indX, indY, fit) {
	//find the best
	var best = findTheBest(fit);

	//crossover
	for (var i = 0; i < szPop; i++) { 
		if (i === best) continue;

		indX[i] = (indX[i] + indX[best]) / 2;
		indY[i] = (indY[i] + indY[best]) / 2;

		indX[i] = mutateGene(indX[i]);
		indY[i] = mutateGene(indY[i]);

		fit[i] = getF(indX[i], indY[i]);
	}

	var coord = [indX, indY, fit];
	return coord;
}

//return the index of a parent for the Roulette Method
function getParent(fit) {
	var sum = 0;
	for (var i = 0; i < szPop; i++)
		sum += fit[i];

	var rnd = Math.floor(Math.random() * sum);

	var total = 0, i;
	for (i = 0; i < szPop; i++) {
		total += fit[i];
		if (total >= rnd) break;
	}

	return i;
}

//roulette: method known by Priscila and Yudi researches
function selectRoulette(indX, indY, fit) {
	var best = findTheBest(fit);

	for (var i = 0; i < szPop; i++) {
		if (i === best) continue;

		var mom = getParent(fit);
		var dad = getParent(fit);

		//child of the mom and the dad
		indX[i] = (indX[mom]+indX[dad])/2;
		indY[i] = (indY[mom]+indY[dad])/2;

		indX[i] = mutateGene(indX[i]);
		indY[i] = mutateGene(indY[i]);

		fit[i] = getF(indX[i], indY[i]);
	}

	var coord = [indX, indY, fit];	
	return coord;
}

//fight function for the tournament method
function fight(indX, indY, tournament_size){
	var best_ind = -1;
	var ind;

	for(var i = 0; i < tournament_size; i++) {
		ind = Math.floor(Math.random() * szPop);		

		if(best_ind === -1 ||getF(indX[best_ind], indY[best_ind]) < getF(indX[ind], indY[ind]))
			best_ind = ind;
	}

	return best_ind;
}

//tournament: two retards fight and see whos best
function selectTournament(indX, indY, fit) {
	var bestOfAll = findTheBest(fit);

	for(var i = 0; i < indX.length; i++) {
		if (i == bestOfAll) continue;
		
		var ind = fight(indX, indY, 3);

		indX[i] = indX[ind];
		indY[i] = indY[ind];

		indX[i] = mutateGene(indX[i]);
		indY[i] = mutateGene(indY[i]);

		fit[i] = getF(indX[i], indY[i]);
	}

	var coord = [indX, indY, fit];
	return coord;
}

//add a description for a generation
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
	if (div === "func-tournament") desc = "desc-tournament";
	document.getElementById(desc).innerHTML += str.toString();
}

//plot a function and the best gene (maximum function point)
function plotEverything(div, data, coords) {

	var best = 0;
	for (var i = 1; i < szPop; i++)
		if (coords[2][i] > coords[2][best]) best = i;

	var points = {
		x: [coords[0][best]],
		y: [coords[1][best]],
		z: [coords[2][best]],
		mode: 'markers', 
		marker: {
			size: 5,
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
	if (plotOrNo)
		Plotly.plot(div, [data, points], layout);
}

//find the maximum of a function by the method given in "div"
function findTheMax(div, data) {
	var indX = initPop();
	var indY = initPop();
	var fit = genFitness(indX, indY);

	var coord = [];
	var maximum = [];

	//clears the text
	var desc;
	if (div === "func-elitism") desc = "desc-elitism";
	if (div === "func-roulette") desc = "desc-roulette";
	if (div === "func-tournament") desc = "desc-tournament";
	document.getElementById(desc).innerHTML = "";

	for (var i = 0; i < genQtt; i++) {
		addText(div, indX, indY, fit, i);
		maximum.push(fit[findTheBest(fit)]);

		if (div === "func-elitism") coord = selectElitism(indX, indY, fit);
		if (div === "func-roulette") coord = selectRoulette(indX, indY, fit);
		if (div === "func-tournament") coord = selectTournament(indX, indY, fit);

		indX = coord[0];
		indY = coord[1];
		fit  = coord[2];
	}

	maximum.push(fit[findTheBest(fit)]);
	addText(div, indX, indY, fit, genQtt);
	plotEverything(div, data, [indX, indY, fit]);

	return maximum;
}

//generate everything
function generateAll() {
	plotOrNo = document.getElementById("plotOrNo").checked;

	genQtt = document.getElementById("generations").value;
	szPop = document.getElementById("population").value;
	mutRatio = document.getElementById("mutation").value;

	if (genQtt <= 0 || szPop <= 0 || mutRatio <= 0 || genQtt > 300 || szPop > 300) {
		alert("Invalid values.");
		return;
	}

	var elitism = document.getElementById("elitism").checked;
	var roulette = document.getElementById("roulette").checked;
	var tournament = document.getElementById("tournament").checked;


	if (document.getElementById("funcToPlotTxt").readOnly)
		funcToPlot = document.getElementById("funcToPlot").value.toString();
	else
		funcToPlot = document.getElementById("funcToPlotTxt").value.toString();

	var data = setup();

	//change the width of the functions
	var elements = document.getElementsByClassName("points-description");
	for (var i = 0; i < elements.length; i++)
		elements[i].style.width = (self.innerWidth - 700 + "px");


	var maxOfEach = [];
	var maxi = [];

	if (elitism === true) {
		document.getElementById("f-elitism").style.display = "block";
		maxi = [];
		maxi.push(findTheMax("func-elitism", data));
		maxi.push("Elitism");
		maxOfEach.push(maxi);
	} else {
		document.getElementById("f-elitism").style.display = "none";
	}


	if (roulette === true) {
		document.getElementById("f-roulette").style.display = "block"; 
		maxi = [];
		maxi.push(findTheMax("func-roulette", data));
		maxi.push("Roulette");
		maxOfEach.push(maxi);
	} else {
		document.getElementById("f-roulette").style.display = "none";
	}

	if (tournament === true) {
		document.getElementById("f-tournament").style.display = "block";
		maxi = [];
		maxi.push(findTheMax("func-tournament", data));
		maxi.push("Tournament");
		maxOfEach.push(maxi);
	} else {
		document.getElementById("f-tournament").style.display = "none";
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
		yaxis: {range: [minZ-1, maxZ+1]}
	};

	Plotly.purge('func-compare');
	Plotly.plot('func-compare', traces, layout);
}

//enable or disable readOnly
function changeOtherReadOnly(opt) {
	if (opt.value == "other")
		document.getElementById("funcToPlotTxt").readOnly = false;
	else
		document.getElementById("funcToPlotTxt").readOnly = true;
}