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
    
    configureSnakeHead (0.35, 0.5, 60, texture);
    configureSnakeBody (0.25, 1.0, 60, texture);
    configureSnakeTail (0.25, 0.5, 60, texture);
    
    var parts = [new SnakeHead (0.0, 0.0),
                 new SnakeBody (0.0, -1.0),
                 new SnakeTail (0.0, -2.0)];
             
    console.log (parts.toString());
    
    var protos = [];
    for (var i = 0; i < parts.length; i++)
        protos.push (Object.getPrototypeOf(parts[i]));
    
    console.log (protos.toString());
    
    for (var i = 0; i < 3; i++) {
        var v = protos[i].vertices ();
        var n = protos[i].normals ();
        var t = protos[i].texCoords ();
        
        for (var j = 0; j < v.length; j++) {
            vertices.push (mult (parts[i].model, v[j]));
            normals.push (mult (parts[i].modelNorm, n[j]));
            texCoords.push (t[2 * j]);
            texCoords.push (t[2 * j + 1]);
        }
    }
    
    Snake.vertices = vertices;
    Snake.normals = normals;
    Snake.texCoords = texCoords;
    Snake.texture = texture;
    Snake.parts = parts;
    
    Snake.prototype.vertices = function () { return Snake.vertices; };
    Snake.prototype.normals = function () { return Snake.normals; };
    Snake.prototype.texCoords = function () { return Snake.texCoords; };
    Snake.prototype.texture = function () { return Snake.texture; };
}