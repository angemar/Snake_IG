function SnakeHead (tranX, tranZ) {
    var modelMat = translate(tranX, SnakeHead.radius / 2, tranZ);
    this.modelMat = flatten (modelMat);
    this.modelNormMat = flatten (normalMatrix(modelMat, false));

    var obst = mult(modelMat, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeHead (radius, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    var norm;
    
    for (var i = 0; i < slices; i++) {
        var angle1 = i * 2.0 * Math.PI / slices;
        var nextAngle1 = (i + 1) * 2.0 * Math.PI / slices;
        for (var j = -slices / 2.5; j < slices; j++) {
            var angle2 = j * (Math.PI / 2) / slices;
            var nextAngle2 = (j + 1) * (Math.PI / 2) / slices;
            
            var downRightX = radius * Math.cos (angle1) * Math.cos (angle2);
            var downRightY = radius * Math.sin (angle1) * Math.cos (angle2);
            var downRightZ = radius * Math.sin (angle2);
            
            var upRightX = radius * Math.cos (angle1) * Math.cos (nextAngle2);
            var upRightY = radius * Math.sin (angle1) * Math.cos (nextAngle2);
            var upRightZ = radius * Math.sin (nextAngle2);
            
            var downLeftX = radius * Math.cos (nextAngle1) * Math.cos (angle2);
            var downLeftY = radius * Math.sin (nextAngle1) * Math.cos (angle2);
            var downLeftZ = radius * Math.sin (angle2);
            
            var upLeftX = radius * Math.cos (nextAngle1) * Math.cos (nextAngle2);
            var upLeftY = radius * Math.sin (nextAngle1) * Math.cos (nextAngle2);
            var upLeftZ = radius * Math.sin (nextAngle2);
            
            var downRight = vec4 (downRightX, downRightY, downRightZ, 1.0);
            var upRight = vec4 (upRightX, upRightY, upRightZ, 1.0);
            var downLeft = vec4 (downLeftX, downLeftY, downLeftZ, 1.0);
            var upLeft = vec4 (upLeftX, upLeftY, upLeftZ, 1.0);
            
            vertices.push (upLeft);
            vertices.push (downLeft);
            vertices.push (downRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push(nextAngle1 / (Math.PI), nextAngle2 / (Math.PI / 2));
            texCoords.push(nextAngle1 / (Math.PI), angle2 / (Math.PI / 2));
            texCoords.push(angle1 / (Math.PI), angle2 / (Math.PI / 2));
            
            vertices.push (upLeft);
            vertices.push (downRight);
            vertices.push (upRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push(nextAngle1 / (Math.PI), nextAngle2 / (Math.PI / 2));
            texCoords.push(angle1 / (Math.PI), angle2 / (Math.PI / 2));
            texCoords.push(angle1 / (Math.PI), nextAngle2 / (Math.PI / 2));
        }
    }
    
    
    SnakeHead.radius = radius;
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
        if (distance <= SnakeHead.radius + SnakeHead.radius * 0.5)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}

/*
function initBuffers() {
        var latitudeBands = 30;
        var longitudeBands = 30;
        var radius = 2;

        var vertexPositionData = [];
        var normalData = [];
        var textureCoordData = [];
        for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
                textureCoordData.push(u);
                textureCoordData.push(v);
                vertexPositionData.push(radius * x);
                vertexPositionData.push(radius * y);
                vertexPositionData.push(radius * z);
            }
        }
 */