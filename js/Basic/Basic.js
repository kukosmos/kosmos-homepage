var scene, camera, control;
var renderer, canvas;
var boardGroup;

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('canvas').appendChild(warning);
}

function init() {
    // Setup
    canvas = document.getElementById('myCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialis: true });
    renderer.setClearColor(0x87ceeb);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    
    // Make and setup a camera.
    var aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(75, aspect, 1, 2000);

    // Controls
    control = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 20, 50);
    control.update();
   

    // Make a scene
    scene = new THREE.Scene();

    // Make ambiend light
    var light1 = new THREE.AmbientLight(0xffffff, 1);
    light1.position.set(0, 10, 0);
    scene.add(light1);

    // Make point light
    var light2 = new THREE.PointLight(0xffffff, 1);
    light2.position.set(0, 20, -10);
    light2.castShadow = true;
    scene.add(light2);

    var pointLightHelper = new THREE.PointLightHelper( light2, 1 );
    scene.add( pointLightHelper );

    // Make 200 * 200 ground
    var groundGeometry = new THREE.BoxBufferGeometry(200, 0.1, 200);
    var groundMaterial = new THREE.MeshLambertMaterial( { color: 0xa0a0a0 } );
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = 0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Make a board with grid
    var boardGeometry = new THREE.BoxBufferGeometry(20, 20, 0.1);
    var boardMaterial = new THREE.MeshLambertMaterial( { color: 0xf0f0f0 } );
    var board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 10;
    board.receiveShadow = true;
    board.castShadow = true;

    var grid = new THREE.GridHelper(20, 10, 0xafafaf, 0xafafaf);
    grid.position.set(0, 10, 0.1);
    grid.rotation.x = Math.PI / 2;

    boardGroup = new THREE.Group();
    boardGroup.add(board);
    boardGroup.add(grid);
    boardGroup.position.y += 0.1;
    scene.add(boardGroup);
}

function resize() {
    var width = canvas.width;
	var height = canvas.height;
	if (canvas.width !== width || canvas.height !== height) {
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
}

function animate() {
    resize();

    boardGroup.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}