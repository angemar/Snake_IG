function World (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);
}

function configureWorld (width, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];

    var heightBottom = -height / 2.0, widthBottom = -width / 2.0;    
    var norm = vec4(0.0, 1.0, 0.0, 1.0);
    
    for (var i = 0; i < slices; i++) {
        for (var j = 0; j < slices; j++) {
            var x1 = widthBottom + i * width / slices;
            var z1 = heightBottom + j * height / slices;
            
            var x2 = widthBottom + (i + 1) * width / slices;
            var z2 = z1;
            
            var v1 = vec4 (x1, 0.0, z1, 1.0);
            var v2 = vec4 (x2, 0.0, z2, 1.0);
            
            if (j === 0) {
                vertices.push (v1);
                normals.push (norm);
                texCoords.push (0.0, 1.0);
            }

            vertices.push (vec4 (x1, 0.0, z1, 1.0));
            normals.push (norm);
            texCoords.push(j % 2, 1.0);
            
            vertices.push (vec4(x2, 0.0, z2, 1.0));
            normals.push (norm);
            texCoords.push(j % 2, 0.0);
            
            if (j === slices - 1) {
                vertices.push (v2);
                normals.push (norm);
                texCoords.push (j % 2, 0.0);
            }
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