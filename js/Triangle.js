// JavaScript source code
var cvs = document.getElementById('glCanvas');

//ĵ���� ũ�� ����
cvs.width = '500';
cvs.height = '400';

//WebGL ���ؽ�Ʈ ���
var gl = cvs.getContext('webgl');

//���� ���۸� �Ұ��ϰ� �� ȭ���� �����. (������ ���������� ����)
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//�ﰢ���� ���� ������ ����
var triangleData = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
];

//GPU�� �ﰢ���� ���� �����͸� ���ε� �ϱ����� ���� ����
var triangleBuffer = gl.createBuffer();

//���۸� GPU�� ���ε�
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

//���ۿ� �����͸� �Է�
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData), gl.STATIC_DRAW);
triangleBuffer.itemSize = 3;
triangleBuffer.numItem = 3;

//vertxtShader ����
var vertexShader = gl.createShader(gl.VERTEX_SHADER);

//fragmentShader ����
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

//Vertex Shader Source ����
var vertexShaderStr = "attribute vec3 aVertexPosition;" +

    "void main(void) {" +

    " gl_Position = vec4(aVertexPosition, 1.0);" +

    "}";

//Fragment Shader Source ����
var fragmentShaderStr = "void main(void) {" +

    " gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +

    "}";

//Vertex Shader�� �ҽ� ����
gl.shaderSource(vertexShader, vertexShaderStr);

//Vertex Shader ������
gl.compileShader(vertexShader);

//Fragment Shader�� �ҽ� ����
gl.shaderSource(fragmentShader, fragmentShaderStr);
//Fragment Shader ������
gl.compileShader(fragmentShader);

//Program ����
var program = gl.createProgram();

//program�� �����ϰ� WebGL�� �� ���α׷��� ����ϰ� �Ѵ�.
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");

//�迭 �����͸� Ȱ��ȭ�Ѵ�.
gl.enableVertexAttribArray(program.aVertexPosition);

//Buffer�� �����ص� ������ ������� ������ ������ GPU���� �˷��ش�
gl.vertexAttribPointer(program.aVertexPosition, triangleBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItem);