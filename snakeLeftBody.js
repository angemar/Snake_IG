function SnakeLeftBody (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.vertices = function () { return SnakeLeftBody.vertices; };
    this.normals = function () { return SnakeLeftBody.normals; };
    this.texCoords = function () { return SnakeLeftBody.texCoords; };
    this.indices = function () { return SnakeLeftBody.indices; };
    this.texture = function () { return SnakeLeftBody.texture; };
}

function configureSnakeLeftBody (radius, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    
    for (var i = 0; i < slices; i++) {
        var a1 = i * (Math.PI / 2) / slices;
        var nA1 = (i + 1) * (Math.PI / 2) / slices;
        
        for (var j = 0; j <= slices; j++) {
            var a2 = Math.PI - (j * Math.PI / slices);
            var nA2 = Math.PI - ((j + 1) * Math.PI / slices);
            
            var x1 = 0.5 -(0.5 - radius * Math.cos (a2)) * Math.cos (a1);
            var y1 = radius * Math.sin (a2);
            var z1 = -0.5 + (0.5 - radius * Math.cos (a2)) * Math.sin (a1);
            
            var x2 = 0.5 -(0.5 - radius * Math.cos (a2)) * Math.cos (nA1);
            var y2 = radius * Math.sin (a2);
            var z2 = -0.5 + (0.5 - radius * Math.cos (a2)) * Math.sin (nA1);
            
            var nX1 = 0.5 -(0.5 - radius * Math.cos (nA2)) * Math.cos (a1);
            var nY1 = radius * Math.sin (nA2);
            var nZ1 = -0.5 + (0.5 - radius * Math.cos (nA2)) * Math.sin (a1);
            
            var nX2 = 0.5 -(0.5 - radius * Math.cos (nA2)) * Math.cos (nA1);
            var nY2 = radius * Math.sin (nA2);
            var nZ2 = -0.5 + (0.5 - radius * Math.cos (nA2)) * Math.sin (nA1);
            
            var v1 = vec4 (x1, y1, z1, 1.0);
            var v2 = vec4 (x2, y2, z2, 1.0);
            
            var nV1 = vec4 (nX1, nY1, nZ1, 1.0);
            var nV2 = vec4 (nX2, nY2, nZ2, 1.0);
            
            var n1 = vec4 (cross (subtract (nV2, nV1), subtract (nV1, v1)));
            var n2 = n1;
            
            var c1 = vec2 (j / slices, -i / slices);
            var c2 = vec2 (j / slices, -(i + 1) / slices);
            
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
    
    SnakeLeftBody.radius = radius;
    SnakeLeftBody.slices = slices;
    SnakeLeftBody.texture = texture;

    SnakeLeftBody.vertices = vertices;
    SnakeLeftBody.normals = normals;
    SnakeLeftBody.texCoords = texCoords;
    SnakeLeftBody.indices = indices;
}