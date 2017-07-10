function configureButtons(document, gl, program) {
    var dirOnLoc = gl.getUniformLocation(program, "dirOn");
    var posOnLoc = gl.getUniformLocation(program, "posOn");
    var spotOnLoc = gl.getUniformLocation(program, "spotOn");
    var texOnLoc = gl.getUniformLocation(program, "texOn");

    document.getElementById("ButtonDir").onclick = function () {
        var flag = gl.getUniform(program, dirOnLoc);
        gl.uniform1f(dirOnLoc, !flag);
    };

    document.getElementById("ButtonPos").onclick = function () {
        var flag = gl.getUniform(program, posOnLoc);
        gl.uniform1f(posOnLoc, !flag);
    };

    document.getElementById("ButtonSpot").onclick = function () {
        var flag = gl.getUniform(program, spotOnLoc);
        gl.uniform1f(spotOnLoc, !flag);
    };

    document.getElementById("ButtonTex").onclick = function () {
        var flag = gl.getUniform(program, texOnLoc);
        gl.uniform1f(texOnLoc, !flag);
    };

    document.onkeydown = document.onkeyup = function (e) {
        e = e || window.event;
        if (Object.keys(keys).indexOf(e.keyCode.toString()) == -1) return;
        keys[e.keyCode] = e.type == 'keydown';
    };
    
    document.onkeypress = function(e){
        var code = e.charCode; 
        if(code === 109 || code === 110)
            objects["snake"][0].changeDir(code);
        if(code === 32)
            objects["snake"][0].aggiugni();
        
    };

    gl.uniform1f(dirOnLoc, 1.0);
    gl.uniform1f(posOnLoc, 1.0);
    gl.uniform1f(spotOnLoc, 1.0);

    gl.uniform1f(texOnLoc, 1.0);
}