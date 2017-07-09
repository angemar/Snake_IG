function Snake () {
    this.model = translate (0.0, 0.0, 0.0);
    this.modelNorm = this.model;
    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.move = function (step) {
        this.model=mult(this.model, translate(0.0, 0.0, step));
        this.modelNorm = normalMatrix(this.model, false);        
    };
    
    this.changeDir = function(code){
        if(code === 110)
            this.model=mult(this.model, rotate (90, 0.0, 1.0, 0.0));
        else
            this.model=mult(this.model, rotate (-90, 0.0, 1.0, 0.0));
        
        this.modelNorm = normalMatrix(this.model, false);
    };
    
    this.aggiugni = function(){
        var parts = Snake.prototype.parts();
        parts.splice(2, 0, new SnakeBody(0.0, 0.0));
        configureSnake2(parts);
        
    };
}

function configureSnake (texture) {

    configureSnakeHead (0.35, 0.5, 30, texture);
    configureSnakeBody (0.25, 1.0, 15, texture);
    configureSnakeTail (0.25, 1.0, 60, texture);
    
    var parts = [
        new SnakeHead (0.0, 0.0),
        new SnakeBody (0.0, 0.0),
        new SnakeBody (0.0, 0.0),
        new SnakeTail (0.0, 0.0)
    ];
    
    for (var i = 1; i < parts.length; i++){
        parts[i].model=mult(parts[i-1].model, translate(0.0, 0.0, -1.0));
        parts[i].modelNorm = normalMatrix(parts[i].model, false);
    }
    
    Snake.texture = texture;
    Snake.prototype.texture = function () { return Snake.texture; };
    
    configureSnake2(parts);
}

function configureSnake2(parts){ 
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    
    for (var i = 1; i < parts.length; i++){
        parts[i].model=mult(parts[i-1].model, translate(0.0, 0.0, -1.0));
        parts[i].modelNorm = normalMatrix(parts[i].model, false);
    }
    
    var protos = [];
    for (var i = 0; i < parts.length; i++)
        protos.push (Object.getPrototypeOf(parts[i]));
    
    var tot = 0;
    
    for (var i = 0; i < protos.length; i++) {
        var v = protos[i].vertices ();
        var n = protos[i].normals ();
        var t = protos[i].texCoords ();
        var c = protos[i].indices ();

        for (var j = 0; j < v.length; j++) {
            vertices.push (mult (parts[i].model, v[j]));
            normals.push (mult (parts[i].modelNorm, n[j]));
            texCoords.push (t[j]);
        }
        for (var k = 0; k < c.length; k++) indices.push (c[k] + tot);
        
        tot += v.length;
    }
    indices = new Uint16Array(indices);
    
    Snake.vertices = vertices;
    Snake.normals = normals;
    Snake.texCoords = texCoords;
    Snake.indices = indices;
    Snake.parts = parts;
    
    Snake.prototype.vertices = function () { return Snake.vertices; };
    Snake.prototype.normals = function () { return Snake.normals; };
    Snake.prototype.texCoords = function () { return Snake.texCoords; };
    Snake.prototype.indices = function () { return Snake.indices; };
    Snake.prototype.parts = function () { return Snake.parts; };

}