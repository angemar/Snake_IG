function Sea () {
    this.model = translate(0.0, -0.1, 0.0);
    this.modelNorm = normalMatrix(this.model, false);
    
    this.seaWave = 0;
    
    this.vertices = function () { return Sea.vertices; };
    this.normals = function () { return Sea.normals; };
    this.texCoords = function () { return Sea.texCoords; };
    this.indices = function () { return Sea.indices; };
    this.texture = function () { return Sea.texture; };
    
    this.move = function () {
        var seaCoords = Sea.texCoords;
        for(var i = 0; i < seaCoords.length; i++)
            seaCoords[i][1] += 0.005 * Math.sin(this.seaWave * Math.PI / 180.0);
        this.seaWave = (this.seaWave + 1) % 360;
    };
}

function configureSea (width, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var heightBottom = -height / 2.0, widthBottom = -width / 2.0;    
    var norm = vec4(0.0, 1.0, 0.0, 1.0);
    
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
    
    Sea.width = width;
    Sea.height = height;
    Sea.slices = slices;
    Sea.texture = texture;

    Sea.vertices = vertices;
    Sea.normals = normals;
    Sea.texCoords = texCoords;
    Sea.indices = indices;
}