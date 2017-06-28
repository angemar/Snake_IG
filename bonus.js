function Bonus (tranX, tranZ) {
    this.model = translate(tranX, Bonus.radius, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureBonus (radius, slices, rotAngle, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    
    for (var i = 0; i < slices; i++) {
        var angle1 = Math.PI - (i * Math.PI / slices);
        var nextAngle1 = Math.PI - ((i + 1) *  Math.PI / slices);
        
        for (var j = 0; j <= slices; j++) {
            var angle2 = j * 2 * Math.PI / slices;
            
            var x1 = radius * Math.sin (angle1) * Math.cos (angle2);
            var y1 = radius * Math.sin (angle1) * Math.sin (angle2);
            var z1 = radius * Math.cos (angle1);
            
            var x2 = radius * Math.sin (nextAngle1) * Math.cos (angle2);
            var y2 = radius * Math.sin (nextAngle1) * Math.sin (angle2);
            var z2 = radius * Math.cos (nextAngle1);
            
            var v1 = vec4 (x1, y1, z1, 1.0);
            var v2 = vec4 (x2, y2, z2, 1.0);
            
            var n1 = vec4 (x1 / radius, y1 / radius, z1 / radius, 1.0);
            var n2 = vec4 (x2 / radius, y2 / radius, z2 / radius, 1.0);
            
            if (j === 0) {
                vertices.push (v1);
                normals.push (n1);
                texCoords.push (j / slices, i / slices);
            }
            
            vertices.push (v1);
            normals.push (n1);
            texCoords.push (j / slices, i / slices);
            
            vertices.push (v2);
            normals.push (n2);
            texCoords.push (j / slices, (i + 1) / slices);
            
            if (j === slices) {
                vertices.push (v2);
                normals.push (n2);
                texCoords.push (j / slices, (i + 1) / slices);
            }
        }
    }
    
    Bonus.radius = radius;
    Bonus.slices = slices;
    Bonus.texture = texture;
    Bonus.rotMat = rotate (rotAngle, -1.0, 1.0, 0.0);

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
