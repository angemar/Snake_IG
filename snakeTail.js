function SnakeTail (tranX, tranZ) {
    this.modelMat = translate(tranX, SnakeTail.radius / 2, tranZ);
    this.modelNormMat = normalMatrix(this.modelMat, false);

    var obst = mult(this.modelMat, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeTail (radius, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    var bottom = -height / 2.0, top = height / 2.0;
    var vertex = vec4 (0.0, radius * 1.5, bottom, 1.0);
    for (var i = 0; i < slices; i++) {
        var angle = i * 2.0 * Math.PI / slices;
        var nextAngle = (i + 1) * 2.0 * Math.PI / slices;
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        var nextX = radius * Math.cos(nextAngle);
        var nextY = radius * Math.sin(nextAngle);
        
        var p1 = vec4(x, y, top, 1.0);
        var p2 = vec4(nextX, nextY, top, 1.0);
        
        vertices.push (p1);
        vertices.push (vertex);
        vertices.push (p2);

        normals.push (vec4 (cross (subtract (p2, p1), subtract (p1, vertex))));
        normals.push (vec4 (cross (subtract (p2, p1), subtract (p1, vertex))));
        normals.push (vec4 (cross (subtract (p2, p1), subtract (p1, vertex))));

        texCoords.push (angle / (Math.PI), 1.0);
        texCoords.push (0.5, 0.0);
        texCoords.push (nextAngle / (Math.PI), 1.0);
    }
    
    SnakeTail.radius = radius;
    SnakeTail.height = height;
    SnakeTail.slices = slices;
    SnakeTail.texture = texture;

    SnakeTail.vertices = vertices;
    SnakeTail.normals = normals;
    SnakeTail.texCoords = texCoords;
    
    SnakeTail.prototype.vertices = function () { return SnakeTail.vertices; };
    SnakeTail.prototype.normals = function () { return SnakeTail.normals; };
    SnakeTail.prototype.texCoords = function () { return SnakeTail.texCoords; };
    SnakeTail.prototype.texture = function () { return SnakeTail.texture; };

    SnakeTail.prototype.collide = function (tail, other) {
        var dist = subtract(tail.obstacle, other);
        var distance = Math.sqrt(Math.pow(dist[0], 2) + Math.pow(dist[2], 2));
        if (distance <= SnakeTail.radius + SnakeTail.radius * 0.5)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}