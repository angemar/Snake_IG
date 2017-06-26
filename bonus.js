function Bonus (tranX, tranZ) {
    this.modelMat = translate(tranX, Bonus.radius, tranZ);
    this.modelNormMat = normalMatrix(this.modelMat, false);

    var obst = mult(this.modelMat, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureBonus (radius, slices, texture, rotAngle) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    var norm;
    
    for (var i = 0; i < slices; i++) {
        var angle1 = i * 2.0 * Math.PI / slices;
        var nextAngle1 = (i + 1) * 2.0 * Math.PI / slices;
        for (var j = -slices; j < slices; j++) {
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
            
            texCoords.push((nextAngle1 + Math.PI / 2) / (2 * Math.PI),
                           (nextAngle2 + Math.PI / 2) / Math.PI);
            texCoords.push((nextAngle1 + Math.PI / 2) / (2 * Math.PI),
                           (angle2 + Math.PI / 2) / Math.PI);
            texCoords.push((angle1 + Math.PI / 2) / (2 * Math.PI),
                           (angle2 + Math.PI / 2) / Math.PI);
            
            vertices.push (upLeft);
            vertices.push (downRight);
            vertices.push (upRight);
            
            norm = vec4 (cross (subtract (upLeft, downLeft),
                                subtract (downRight, downLeft)));
            
            normals.push (norm);
            normals.push (norm);
            normals.push (norm);
            
            texCoords.push((nextAngle1 + Math.PI / 2) / (2 * Math.PI),
                           (nextAngle2 + Math.PI / 2) / Math.PI);
            texCoords.push((angle1 + Math.PI / 2) / (2 * Math.PI),
                           (angle2 + Math.PI / 2) / Math.PI);
            texCoords.push((angle1 + Math.PI / 2) / (2 * Math.PI),
                           (nextAngle2 + Math.PI / 2) / Math.PI);
        }
    }
    
    Bonus.radius = radius;
    Bonus.slices = slices;
    Bonus.texture = texture;
    Bonus.rotMat = rotate (rotAngle, 1.0, 1.0, 0.0);

    Bonus.vertices = vertices;
    Bonus.normals = normals;
    Bonus.texCoords = texCoords;
    
    Bonus.prototype.vertices = function () { return Bonus.vertices; };
    Bonus.prototype.normals = function () { return Bonus.normals; };
    Bonus.prototype.texCoords = function () { return Bonus.texCoords; };
    Bonus.prototype.texture = function () { return Bonus.texture; };

    Bonus.prototype.collide = function (tail, other) {
        var dist = subtract(tail.obstacle, other);
        var distance = Math.sqrt(Math.pow(dist[0], 2) + Math.pow(dist[2], 2));
        if (distance <= Bonus.radius + Bonus.radius * 0.5)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}
