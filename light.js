var posAttenuation = [1.0, 0.001, 0.0001];
var spotAttenuation = [1.0, 0.001, 0.0001];

var spotCutoff = 10.0;

var lightAmbient = [0.0, 0.0, 0.0, 1.0];
var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
var lightSpecular = [1.0, 1.0, 1.0, 1.0];

var materialAmbient = [1.0, 1.0, 1.0, 1.0];
var materialDiffuse = [1.0, 1.0, 1.0, 1.0];
var materialSpecular = [1.0, 1.0, 1.0, 1.0];

var materialShininess = 100.0;

var posAttLoc;
var spotAttLoc;

var spotCutoffLoc;

var ambProdLoc;
var diffProdLoc;
var specProdLoc;
var shinLoc;

function configureLight(gl, program) {

    posLightAttLoc = gl.getUniformLocation(program, "posAtt");
    spotLightAttLoc = gl.getUniformLocation(program, "spotAtt");

    spotCutoffLoc = gl.getUniformLocation(program, "spotCutoffAngle");

    ambProdLoc = gl.getUniformLocation(program, "ambientProduct");
    diffProdLoc = gl.getUniformLocation(program, "diffuseProduct");
    specProdLoc = gl.getUniformLocation(program, "specularProduct");
    shinLoc = gl.getUniformLocation(program, "shininess");

    gl.uniform3fv(posLightAttLoc, posAttenuation);
    gl.uniform3fv(spotLightAttLoc, spotAttenuation);
    gl.uniform1f(spotCutoffLoc, spotCutoff);

    gl.uniform4fv(ambProdLoc, mult(lightAmbient, materialAmbient));
    gl.uniform4fv(diffProdLoc, mult(lightDiffuse, materialDiffuse));
    gl.uniform4fv(specProdLoc, mult(lightSpecular, materialSpecular));
    gl.uniform1f(shinLoc, materialShininess);
}
