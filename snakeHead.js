function SnakeHead (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeHead (radius1, radius2, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    for (var i = slices / 4; i < slices; i++) {
        var angle1 = Math.PI - (i * Math.PI / slices);
        var nextAngle1 = Math.PI - ((i + 1) * Math.PI / slices);
        
        for (var j = 0; j <= slices; j++) {
            var angle2 = j * Math.PI / slices;
            
            var x1 = radius1 * Math.sin (angle1) * Math.cos (angle2);
            var y1 = radius1 * Math.sin (angle1) * Math.sin (angle2);
            var z1 = radius2 * Math.cos (angle1);
            
            var x2 = radius1 * Math.sin (nextAngle1) * Math.cos (angle2);
            var y2 = radius1 * Math.sin (nextAngle1) * Math.sin (angle2);
            var z2 = radius2 * Math.cos (nextAngle1);
            
            var v1 = vec4 (x1, y1, z1 - 0.2, 1.0);
            var v2 = vec4 (x2, y2, z2 - 0.2, 1.0);
            
            var n1 = vec4 (x1 / radius1, y1 / radius1, z1 / radius2, 1.0);
            var n2 = vec4 (x2 / radius1, y2 / radius1, z2 / radius2, 1.0);
            
            if (j === 0) {
                vertices.push (v1);
                normals.push (n1);
                texCoords.push (-j / slices, -i / slices);
            }
            
            vertices.push (v1);
            normals.push (n1);
            texCoords.push (-j / slices, -i / slices);
            
            vertices.push (v2);
            normals.push (n2);
            texCoords.push (-j / slices, -(i + 1) / slices);
            
            if (j === slices) {
                vertices.push (v2);
                normals.push (n2);
                texCoords.push (-j / slices, -(i + 1) / slices);
            }
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