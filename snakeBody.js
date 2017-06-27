function SnakeBody (tranX, tranZ) {
    this.model = translate(tranX, 0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeBody (radius, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];

    var bottom = -height / 2.0, top = height / 2.0;
    for (var i = 0; i < slices; i++) {
        var angle = i * 2.0 * Math.PI / slices;
        var nextAngle = (i + 1) * 2.0 * Math.PI / slices;
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        var nextX = radius * Math.cos(nextAngle);
        var nextY = radius * Math.sin(nextAngle);

        var midAngle = (angle + nextAngle) / 2;
        var sideNorm = vec4(Math.cos(midAngle), Math.sin(midAngle), 0.0, 1.0);

        vertices.push (vec4(x, y, bottom, 1.0));
        vertices.push (vec4(nextX, nextY, bottom, 1.0));
        vertices.push (vec4(x, y, top, 1.0));

        normals.push (sideNorm);
        normals.push (sideNorm);
        normals.push (sideNorm);

        texCoords.push(-angle / (Math.PI), 0.0);
        texCoords.push(-nextAngle / (Math.PI), 0.0);
        texCoords.push(-angle / (Math.PI), -1.0);

        vertices.push (vec4(nextX, nextY, bottom, 1.0));
        vertices.push (vec4(nextX, nextY, top, 1.0));
        vertices.push (vec4(x, y, top, 1.0));

        normals.push (sideNorm);
        normals.push (sideNorm);
        normals.push (sideNorm);

        texCoords.push(-nextAngle / (Math.PI), 0.0);
        texCoords.push(-nextAngle / (Math.PI), -1.0);
        texCoords.push(-angle / (Math.PI), -1.0);
    }
    
    SnakeBody.radius = radius;
    SnakeBody.height = height;
    SnakeBody.slices = slices;
    SnakeBody.texture = texture;

    SnakeBody.vertices = vertices;
    SnakeBody.normals = normals;
    SnakeBody.texCoords = texCoords;
    
    SnakeBody.prototype.vertices = function () { return SnakeBody.vertices; };
    SnakeBody.prototype.normals = function () { return SnakeBody.normals; };
    SnakeBody.prototype.texCoords = function () { return SnakeBody.texCoords; };
    SnakeBody.prototype.texture = function () { return SnakeBody.texture; };

    SnakeBody.prototype.collide = function (cylinder, other) {
        var dist = subtract(cylinder.obstacle, other);
        var distance = Math.sqrt(Math.pow(dist[0], 2) + Math.pow(dist[2], 2));
        if (distance <= SnakeBody.radius + SnakeBody.radius * 0.5)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}