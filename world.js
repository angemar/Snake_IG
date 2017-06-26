function World (tranX, tranZ) {
    this.modelMat = translate(tranX, 0.0, tranZ);
    this.modelNormMat = normalMatrix(this.modelMat, false);
}

function configureWorld (width, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];

    var heightBottom = -height / 2.0, widthBottom = -width / 2.0;    
    var norm = vec4(0.0, 1.0, 0.0, 1.0);
    
    for (var i = 0; i < slices; i++) {
        for (var j = 0; j < slices; j++) {
            var x = widthBottom + i * width / slices;
            var z = heightBottom + j * height / slices;
            var nextX = widthBottom + (i + 1) * width / slices;
            var nextZ = heightBottom + (j + 1) * height / slices;

            vertices.push (vec4 (x, 0.0, nextZ, 1.0));
            vertices.push (vec4(x, 0.0, z, 1.0));
            vertices.push (vec4(nextX, 0.0, z, 1.0));

            normals.push (norm);
            normals.push (norm);
            normals.push (norm);

            texCoords.push(0.0, 1.0);
            texCoords.push(0.0, 0.0);
            texCoords.push(1.0, 0.0);

            vertices.push (vec4 (x, 0.0, nextZ, 1.0));
            vertices.push (vec4(nextX, 0.0, z, 1.0));
            vertices.push (vec4(nextX, 0.0, nextZ, 1.0));

            normals.push (norm);
            normals.push (norm);
            normals.push (norm);

            texCoords.push(0.0, 1.0);
            texCoords.push(1.0, 0.0);
            texCoords.push(1.0, 1.0);
        }
    }
    
    World.width = width;
    World.height = height;
    World.slices = slices;
    World.texture = texture;

    World.vertices = vertices;
    World.normals = normals;
    World.texCoords = texCoords;
    
    World.prototype.vertices = function () { return World.vertices; };
    World.prototype.normals = function () { return World.normals; };
    World.prototype.texCoords = function () { return World.texCoords; };
    World.prototype.texture = function () { return World.texture; };
}