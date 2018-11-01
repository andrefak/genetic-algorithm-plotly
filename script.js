function setup() {
	DIV = document.getElementById('plot-function');
	var nX = 50;
	var nY = 50;

	var f = new Array(nX).fill(new Array(nY));

	_z = [];
	for (var x = 0; x < nX; x++) {
		_zrow = [];
		for (var y = 0; y < nY; y++) {
			var vZ = Math.exp(Math.sin(x)) - Math.sin(x*x*x*y*y) + Math.sqrt(y/10) + Math.log(x*x*x*x*y*y*y+1) - Math.sqrt(x/10);
			f[x][y] = vZ;
			_zrow.push(vZ);
		}
		_z.push(_zrow);
	}

	var data = {z : _z, type: 'surface'};
	Plotly.newPlot(DIV, [data]);

	return f;
}

setup();