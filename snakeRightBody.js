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
        var a1 = Math.PI - (i * (Math.PI / 2) / slices);
        var nA1 = Math.PI - ((i + 1) * (Math.PI / 2) / slices);
        
        for (var j = 0; j <= slices; j++) {
            var a2 = j * Math.PI / slices;
            var nA2 = (j + 1) * Math.PI / slices;
            
            var x1 = -0.5 -(0.5 - radius * Math.cos (a2)) * Math.cos (a1);
            var y1 = radius * Math.sin (a2);
            var z1 = -0.5 + (0.5 - radius * Math.cos (a2)) * Math.sin (a1);
            
            var x2 = -0.5 -(0.5 - radius * Math.cos (a2)) * Math.cos (nA1);
            var y2 = radius * Math.sin (a2);
            var z2 = -0.5 + (0.5 - radius * Math.cos (a2)) * Math.sin (nA1);
            
            var nX1 = -0.5 -(0.5 - radius * Math.cos (nA2)) * Math.cos (a1);
            var nY1 = radius * Math.sin (nA2);
            var nZ1 = -0.5 + (0.5 - radius * Math.cos (nA2)) * Math.sin (a1);
            
            var nX2 = -0.5 -(0.5 - radius * Math.cos (nA2)) * Math.cos (nA1);
            var nY2 = radius * Math.sin (nA2);
            var nZ2 = -0.5 + (0.5 - radius * Math.cos (nA2)) * Math.sin (nA1);
            
            var v1 = vec4 (x1, y1, z1, 1.0);
            var v2 = vec4 (x2, y2, z2, 1.0);
            
            var nV1 = vec4 (nX1, nY1, nZ1, 1.0);
            var nV2 = vec4 (nX2, nY2, nZ2, 1.0);
            
            var n1 = vec4 (cross (subtract (nV2, nV1), subtract (nV1, v1)));
            var n2 = n1;
                         
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