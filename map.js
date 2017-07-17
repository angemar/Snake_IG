function Map () {
    this.model = translate(0.0, -3.0, 0.0);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.width = function () { return Map.width; };
    this.height = function () { return Map.height; };
    this.canvas = function () { return Map.canvas; };
    this.matrix = function () { return Map.matrix; };
    
    this.draw = function () {
        var ctx = Map.canvas.getContext('2d');
        var cw = Map.canvas.width;
        var ch = Map.canvas.height;
        var ww = World.height;
        var wh = World.width;

        for (var i = 0; i < wh; i++) {
            for (var j = 0; j < ww; j++) {

                if (Map.matrix[i][j] === 'b')
                    ctx.fillStyle = "rgb(255,0,0)"; 
                else if (Map.matrix[i][j] === 'h' || Map.matrix[i][j] === 'h1')
                    ctx.fillStyle = "rgb(220,220,220)";
                else ctx.fillStyle = "rgb(0,0,0)";

                ctx.fillRect((wh - 1 - i) * ch / wh, (ww - 1 - j) * cw / ww, cw / ww, ch / wh);
            }
        }
    };
    
    this.rotate = function (dir) {
        var ctx = Map.canvas.getContext('2d');
        ctx.clearRect(0, 0, Map.canvas.width, Map.canvas.height);
        ctx.translate(Map.canvas.width / 2, Map.canvas.height / 2);
        if (dir === -1) ctx.rotate(Math.PI/2);
        else ctx.rotate(-Math.PI/2);
        ctx.translate(-Map.canvas.width / 2, -Map.canvas.height / 2);
        ctx.restore();
    };
}

function configureMap (width, height, canvas) {
    var matrix = [];
    
    for(var i = 0; i < height; i++){
        matrix.push([]);
        for(var j = 0;j < width; j++){
            matrix[i].push('0');
        }
    }
    
    Map.width = width;
    Map.height = height;
    Map.canvas = canvas;
    Map.matrix = matrix;
}