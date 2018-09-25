// JavaScript source code
var cvs = document.getElementById('glCanvas');

//캔버스 크기 설정
cvs.width = '500';
cvs.height = '400';

//WebGL 컨텍스트 취득
var gl = cvs.getContext('webgl');

//색상 버퍼를 소거하고 빈 화면을 만든다. (배경색을 검은색으로 설정)
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//삼각형의 정점 데이터 생성
var triangleData = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
];

//GPU에 삼각형의 정점 데이터를 업로드 하기위한 버퍼 생성
var triangleBuffer = gl.createBuffer();

//버퍼를 GPU에 바인딩
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

//버퍼에 데이터를 입력
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData), gl.STATIC_DRAW);
triangleBuffer.itemSize = 3;
triangleBuffer.numItem = 3;

//vertxtShader 생성
var vertexShader = gl.createShader(gl.VERTEX_SHADER);

//fragmentShader 생성
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

//Vertex Shader Source 생성
var vertexShaderStr = "attribute vec3 aVertexPosition;" +

    "void main(void) {" +

    " gl_Position = vec4(aVertexPosition, 1.0);" +

    "}";

//Fragment Shader Source 생성
var fragmentShaderStr = "void main(void) {" +

    " gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +

    "}";

//Vertex Shader에 소스 설정
gl.shaderSource(vertexShader, vertexShaderStr);

//Vertex Shader 컴파일
gl.compileShader(vertexShader);

//Fragment Shader에 소스 설정
gl.shaderSource(fragmentShader, fragmentShaderStr);
//Fragment Shader 컴파일
gl.compileShader(fragmentShader);

//Program 생성
var program = gl.createProgram();

//program을 연결하고 WebGL이 이 프로그램을 사용하게 한다.
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");

//배열 데이터를 활성화한다.
gl.enableVertexAttribArray(program.aVertexPosition);

//Buffer에 저장해둔 아이템 사이즈와 아이템 갯수를 GPU에게 알려준다
gl.vertexAttribPointer(program.aVertexPosition, triangleBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItem);