buildShader = function (c, code) {
  var c, cw, ch, mx, my, gl, run, eCheck;
  var program;
  var startTime;
  var time = 0;
  var tempTime = 0;
  var fps = 1000 / 30;
  var uniLocation = [];

  var vertexShaderText = document.getElementById('vertex').text;
  var fragmentShaderText = code;

  cw = window.innerWidth;
  ch = window.innerHeight;
  c.width = cw;
  c.height = ch;
  c.addEventListener('mousemove', mouseMove, true);

  gl = c.getContext("webgl") || c.getContext("experimental-webgl");

  var vertexShader = createShader(vertexShaderText, "vertex");

  var fragmentShader = createShader(fragmentShaderText, "fragment");

  program = createProgram(vertexShader, fragmentShader);
  uniLocation[0] = gl.getUniformLocation(program, "u_time");
  uniLocation[1] = gl.getUniformLocation(program, "u_mouse");
  uniLocation[2] = gl.getUniformLocation(program, "u_resolution");

  var position = [
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ];
  var index = [
    0, 2, 1,
    1, 2, 3
  ];

  var vPosition = createVbo(position);
  var vIndex = createIbo(index);
  var vAttLocation = gl.getAttribLocation(program, "position");

  gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
  gl.enableVertexAttribArray(vAttLocation);
  gl.vertexAttribPointer(vAttLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  mx = 0.5;
  my = 0.5;
  startTime = +new Date();

//   function render() {
//     time = +new Date();
//     if (time-startTime>fps) {
//       gl.clear(gl.COLOR_BUFFER_BIT);

//       gl.uniform1f(uniLocation[0], time);
//       gl.uniform2fv(uniLocation[1], [mx, my]);
//       gl.uniform2fv(uniLocation[2], [cw, ch]);

//       gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
//       gl.flush();
//       startTime = time;
//     }
//     window.requestAnimationFrame(render);
//   }
//   window.requestAnimationFrame(render);

  render();

  function render() {
    time = (new Date().getTime() - startTime) * 0.001;

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uniLocation[0], time);
    gl.uniform2fv(uniLocation[1], [mx, my]);
    gl.uniform2fv(uniLocation[2], [cw, ch]);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    setTimeout(render, fps);
  }

  function createProgram(vs, fs) {
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      return null;
    }
  }

  function createShader(text, type) {
    var shader;

    switch (type) {
      case "vertex":
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
      case "fragment":
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
    }

    gl.shaderSource(shader, text);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      //alert(gl.getShaderInfoLog(shader));
      console.log(gl.getShaderInfoLog(shader));
    }
  }

  function createVbo(data) {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
  }

  function createIbo(data) {
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  function mouseMove(e) {
      mx = e.offsetX / cw;
      my = e.offsetY / ch;
  }

//   window.addEventListener("resize", function(e){
//       cw = window.innerWidth;
//       ch = window.innerHeight;

//       c.width = cw;
//       c.height = ch;
//   });
};
