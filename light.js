var posLightAttenuation = [1.0, 0.01, 0.0001];
var spotLightAttenuation = [1.0, 0.01, 0.0001];

var spotLightCutoff = 10.0;

var lightAmbient = [0.0, 0.0, 0.0, 1.0];
var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
var lightSpecular = [1.0, 1.0, 1.0, 1.0];

var materialAmbient = [1.0, 1.0, 1.0, 1.0];
var materialDiffuse = [1.0, 1.0, 1.0, 1.0];
var materialSpecular = [1.0, 1.0, 1.0, 1.0];

var materialShininess = 100.0;

var posLightAttLoc;
var spotLightAttLoc;

var spotLightCutoffLoc;

var ambProdLoc;
var diffProdLoc;
var specProdLoc;
var shinLoc;

function configureLight(gl, program) {

    posLightAttLoc = gl.getUniformLocation(program, "posAtt");
    spotLightAttLoc = gl.getUniformLocation(program, "spotAtt");

    spotLightCutoffLoc = gl.getUniformLocation(program, "spotCutoff");

    ambProdLoc = gl.getUniformLocation(program, "ambientProduct");
    diffProdLoc = gl.getUniformLocation(program, "diffuseProduct");
    specProdLoc = gl.getUniformLocation(program, "specularProduct");
    shinLoc = gl.getUniformLocation(program, "shininess");

    gl.uniform3fv(posLightAttLoc, posLightAttenuation);
    gl.uniform3fv(spotLightAttLoc, spotLightAttenuation);
    gl.uniform1f(spotLightCutoffLoc, spotLightCutoff);

    gl.uniform4fv(ambProdLoc, mult(lightAmbient, materialAmbient));
    gl.uniform4fv(diffProdLoc, mult(lightDiffuse, materialDiffuse));
    gl.uniform4fv(specProdLoc, mult(lightSpecular, materialSpecular));
    gl.uniform1f(shinLoc, materialShininess);
}
