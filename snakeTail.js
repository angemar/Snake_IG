function SnakeTail (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeTail (radius1, radius2, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    for (var i = 0; i < slices; i++) {
        var angle1 = Math.PI - (i * (Math.PI / 2) / slices);
        var nextAngle1 = Math.PI - ((i + 1) * (Math.PI / 2) / slices);
        
        for (var j = 0; j <= slices; j++) {
            var angle2 = j * Math.PI / slices;
            
            var x1 = radius1 * Math.sin (angle1) * Math.cos (angle2);
            var y1 = radius1 * Math.sin (angle1) * Math.sin (angle2);
            var z1 = radius2 * Math.cos (angle1);
            
            var x2 = radius1 * Math.sin (nextAngle1) * Math.cos (angle2);
            var y2 = radius1 * Math.sin (nextAngle1) * Math.sin (angle2);
            var z2 = radius2 * Math.cos (nextAngle1);
            
            var v1 = vec4 (x1, y1, z1 + 0.5, 1.0);
            var v2 = vec4 (x2, y2, z2 + 0.5, 1.0);
            
            var n1 = vec4 (x1, y1, z1, 1.0);
            var n2 = vec4 (x2, y2, z2, 1.0);
            
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
    
    SnakeTail.radius1 = radius1;
    SnakeTail.radius2 = radius2;
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