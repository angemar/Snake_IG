function SnakeHead (tranX, tranZ) {
    this.model = translate(tranX, 0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeHead (radius1, radius2, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    var norm;
    for (var i = 0; i < slices; i++) {
        var angle1 = i * 2.0 * Math.PI / slices;
        var nextAngle1 = (i + 1) * 2.0 * Math.PI / slices;
        
        for (var j = -slices / 2; j < slices; j++) {
            var angle2 = j * (Math.PI / 2) / slices;
            var nextAngle2 = (j + 1) * (Math.PI / 2) / slices;
            
            var downRightX = radius1 * Math.cos (angle1) * Math.cos (angle2);
            var downRightY = radius1 * Math.sin (angle1) * Math.cos (angle2);
            var downRightZ = radius2 * Math.sin (angle2);
            
            var upRightX = radius1 * Math.cos (angle1) * Math.cos (nextAngle2);
            var upRightY = radius1 * Math.sin (angle1) * Math.cos (nextAngle2);
            var upRightZ = radius2 * Math.sin (nextAngle2);
            
            var downLeftX = radius1 * Math.cos (nextAngle1) * Math.cos (angle2);
            var downLeftY = radius1 * Math.sin (nextAngle1) * Math.cos (angle2);
            var downLeftZ = radius2 * Math.sin (angle2);
            
            var upLeftX = radius1 * Math.cos (nextAngle1) * Math.cos (nextAngle2);
            var upLeftY = radius1 * Math.sin (nextAngle1) * Math.cos (nextAngle2);
            var upLeftZ = radius2 * Math.sin (nextAngle2);
            
            var downRight = vec4 (downRightX, downRightY, downRightZ - 0.5, 1.0);
            var upRight = vec4 (upRightX, upRightY, upRightZ - 0.5, 1.0);
            var downLeft = vec4 (downLeftX, downLeftY, downLeftZ - 0.5, 1.0);
            var upLeft = vec4 (upLeftX, upLeftY, upLeftZ - 0.5, 1.0);
            
            vertices.push (upLeft);
            vertices.push (downLeft);
            vertices.push (downRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push(-nextAngle1 / Math.PI,
                           -(nextAngle2 + Math.PI / 2) / Math.PI);
            texCoords.push(-nextAngle1 / Math.PI,
                           -(angle2 + Math.PI / 2) / Math.PI);
            texCoords.push(-angle1 / Math.PI,
                           -(angle2 + Math.PI / 2) / Math.PI);
            
            vertices.push (upLeft);
            vertices.push (downRight);
            vertices.push (upRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push(-nextAngle1 / Math.PI,
                           -(nextAngle2 + Math.PI / 2) / Math.PI);
            texCoords.push(-angle1 / Math.PI,
                           -(angle2 + Math.PI / 2) / Math.PI);
            texCoords.push(-angle1 / Math.PI,
                           -(nextAngle2 + Math.PI / 2) / Math.PI);
        }
    }
    
    SnakeHead.radius1 = radius1;
    SnakeHead.radius2 = radius2;
    SnakeHead.slices = slices;
    SnakeHead.texture = texture;

    SnakeHead.vertices = vertices;
    SnakeHead.normals = normals;
    SnakeHead.texCoords = texCoords;
    
    SnakeHead.prototype.vertices = function () { return SnakeHead.vertices; };
    SnakeHead.prototype.normals = function () { return SnakeHead.normals; };
    SnakeHead.prototype.texCoords = function () { return SnakeHead.texCoords; };
    SnakeHead.prototype.texture = function () { return SnakeHead.texture; };

    SnakeHead.prototype.collide = function (tail, other) {
        var dist = subtract(tail.obstacle, other);
        var distance = Math.sqrt(Math.pow(dist[0], 2) + Math.pow(dist[2], 2));
        if (distance <= SnakeHead.height + SnakeHead.height * 0.25)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}