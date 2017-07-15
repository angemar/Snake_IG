function World () {
    this.model = translate(0.0, 0.0, 0.0);
    this.modelNorm = normalMatrix(this.model, false);
    
    this.width = function () { return World.width; };
    this.height = function () { return World.height; };
    this.vertices = function () { return World.vertices; };
    this.normals = function () { return World.normals; };
    this.texCoords = function () { return World.texCoords; };
    this.indices = function () { return World.indices; };
    this.texture = function () { return World.texture; };
}

function configureWorld (width, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var heightBottom = -height / 2.0, widthBottom = -width / 2.0;    
    
    for (var i = 0; i < slices; i++) {
        for (var j = 0; j <= slices; j++) {
            var x1 = widthBottom + j * width / slices;
            var z1 = heightBottom + i * height / slices;
            
            var x2 = x1;
            var z2 = heightBottom + (i + 1) * width / slices;
            
            var v1 = vec4 (x1, 0.0, z1, 1.0);
            var v2 = vec4 (x2, 0.0, z2, 1.0);
            
            var n1 = vec4 (0.0, 1.0, 0.0, 1.0);
            var n2 = vec4 (0.0, 1.0, 0.0, 1.0);
            
            var c1 = vec2 (j % 2, 1.0);
            var c2 = vec2 (j % 2, 0.0);
            
            var verts = [], norms = [], coords = [];
            
            if (j === 0){
                verts.push (v1);
                norms.push (n1);
                coords.push (c1);
            }
            
            verts.push (v1);
            norms.push (n1);
            coords.push (c1);
            
            verts.push (v2);
            norms.push (n2);
            coords.push (c2);
            
            if (j === slices){
                verts.push (v2);
                norms.push (n2);
                coords.push (c2);
            }
            
            for (var k = 0; k < verts.length; k ++) {
                var ind = -1;
                for (var z = 0; z < vertices.length; z++) {
                    if (verts[k][0] === vertices[z][0] &&
                            verts[k][1] === vertices[z][1] &&
                            verts[k][2] === vertices[z][2]) {
                        if (coords[k][0] === texCoords[z][0] &&
                                coords[k][1] === texCoords[z][1]) {
                            ind = z;
                            break;
                        }
                    }
                }
                if (ind !== -1) indices.push (ind);
                else {
                    indices.push (vertices.length);
                    vertices.push (verts[k]);
                    normals.push (norms[k]);
                    texCoords.push (coords[k]);
                }
            }
        }
    }
    indices = new Uint16Array(indices);
    
    World.width = width;
    World.height = height;
    World.slices = slices;
    World.texture = texture;

    World.vertices = vertices;
    World.normals = normals;
    World.texCoords = texCoords;
    World.indices = indices;
}