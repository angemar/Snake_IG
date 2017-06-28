function SnakeRightBody (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeRightBody (radius, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    for (var i = 0; i < slices; i++) {
        var a1 = (Math.PI / 2.0) + (i * (Math.PI / 2) / slices);
        var nA1 = (Math.PI / 2.0) +  ((i + 1) * (Math.PI / 2) / slices);
        
        for (var j = 0; j < slices; j++) {
            var a2 = j * 2 * Math.PI / slices;
            var nA2 = (j + 1) * 2 * Math.PI / slices;
            
            var downLeftX = -0.5 -(0.5 + radius * Math.cos (a2)) * Math.cos (a1);
            var downLeftY = -radius * Math.sin (a2);
            var downLeftZ = -0.5 -(-0.5 - radius * Math.cos (a2)) * Math.sin (a1);
            
            var downRightX = -0.5 - (0.5 + radius * Math.cos (a2)) * Math.cos (nA1);
            var downRightY = -radius * Math.sin (a2);
            var downRightZ = -0.5 -(-0.5 - radius * Math.cos (a2)) * Math.sin (nA1);
            
            var upLeftX = -0.5 -(0.5 + radius * Math.cos (nA2)) * Math.cos (a1);
            var upLeftY = -radius * Math.sin (nA2);
            var upLeftZ = -0.5 -(-0.5 - radius * Math.cos (nA2)) * Math.sin (a1);
            
            var upRightX = -0.5 -(0.5 + radius * Math.cos (nA2)) * Math.cos (nA1);
            var upRightY = -radius * Math.sin (nA2);
            var upRightZ = -0.5 -(-0.5 - radius * Math.cos (nA2)) * Math.sin (nA1);
            
            var downLeft = vec4 (downLeftX, downLeftY, downLeftZ, 1.0);
            var downRight = vec4 (downRightX, downRightY, downRightZ, 1.0);
            var upLeft = vec4 (upLeftX, upLeftY, upLeftZ, 1.0);
            var upRight = vec4 (upRightX, upRightY, upRightZ, 1.0);
            
            vertices.push (upLeft);
            vertices.push (downLeft);
            vertices.push (downRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push(-nA2 / Math.PI, i / slices);
            texCoords.push(-a2 / Math.PI, i / slices);
            texCoords.push(-a2 / Math.PI, (i + 1) / slices);
            
            vertices.push (upLeft);
            vertices.push (downRight);
            vertices.push (upRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push(-nA2 / Math.PI, i / slices);
            texCoords.push(-a2 / Math.PI, (i + 1) / slices);
            texCoords.push(-nA2 / Math.PI, (i + 1) / slices);
            
        }
    }
    
    SnakeRightBody.radius = radius;
    SnakeRightBody.slices = slices;
    SnakeRightBody.texture = texture;

    SnakeRightBody.vertices = vertices;
    SnakeRightBody.normals = normals;
    SnakeRightBody.texCoords = texCoords;
    
    SnakeRightBody.prototype.vertices = function () { return SnakeRightBody.vertices; };
    SnakeRightBody.prototype.normals = function () { return SnakeRightBody.normals; };
    SnakeRightBody.prototype.texCoords = function () { return SnakeRightBody.texCoords; };
    SnakeRightBody.prototype.texture = function () { return SnakeRightBody.texture; };

    SnakeRightBody.prototype.collide = function (cylinder, other) {
        var dist = subtract(cylinder.obstacle, other);
        var distance = Math.sqrt(Math.pow(dist[0], 2) + Math.pow(dist[2], 2));
        if (distance <= SnakeRightBody.radius + SnakeRightBody.radius * 0.5)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}