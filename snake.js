function Snake () {
    this.model = translate (0.0, 0.0, 0.0);
    this.modelNorm = this.model;
    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnake (texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    
    configureSnakeHead (0.35, 0.5, 30, texture);
    configureSnakeBody (0.25, 1.0, 15, texture);
    configureSnakeRightBody (0.25, 30, texture);
    configureSnakeTail (0.25, 1.0, 60, texture);
    
    var parts = [new SnakeHead (0.0, 0.0),
                 new SnakeBody (0.0, -1.0),
                 new SnakeBody (0.0, -2.0),
                 new SnakeTail (0.0, -3.0),
                 new SnakeRightBody (0.0, -4.0)];
    
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
    console.log (vertices.length);
    indices = new Uint16Array(indices);
    console.log (indices.length);
    
    Snake.vertices = vertices;
    Snake.normals = normals;
    Snake.texCoords = texCoords;
    Snake.indices = indices;
    Snake.texture = texture;
    Snake.parts = parts;
    
    Snake.prototype.vertices = function () { return Snake.vertices; };
    Snake.prototype.normals = function () { return Snake.normals; };
    Snake.prototype.texCoords = function () { return Snake.texCoords; };
    Snake.prototype.indices = function () { return Snake.indices; };
    Snake.prototype.texture = function () { return Snake.texture; };
}