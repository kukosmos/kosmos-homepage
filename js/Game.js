var camera, scene, renderer;
var mesh;
var frustumSize = 1000;

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('canvas').appendChild(warning);
}

function init() {
    // Setup
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialis: true });
    renderer.setClearColor(0x000000);

    // Make and setup a camera.
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(120, aspect, 1, 1000);
    camera.position.y = 500;
    // Make a scene
    scene = new THREE.Scene();

    //Make light
    var Ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    Ambientlight.position.set(0, 0, 0);
    scene.add(Ambientlight);
 
    var PointLight = new THREE.PointLight(0xffffff, 0.5);
    PointLight.position.set(0, 0, 0);
    scene.add(PointLight);

    var geometry = new THREE.PlaneGeometry( 500, 500 );
    var material = new THREE.MeshBasicMaterial( { color: 0x1f1f1f , side: THREE.DoubleSide } );
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 500, -300);
    scene.add(mesh);    

    var girdTable = new THREE.GridHelper(500, 10, 0xffffff );
    girdTable.rotation.x = -Math.PI / 2;
    girdTable.position.set(0, 500, -300);
    scene.add( girdTable );
   
    var gridFloor = new THREE.GridHelper(2000, 40, 0xffffff);
    scene.add( gridFloor );
}

function resize() {
    var width = renderer.domElement.clientWidth;
	var height = renderer.domElement.clientHeight;
	if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
}

function animate() {
    resize();

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.01;
    //mesh.rotation.z += 0.01;
    //gridHelper.rotation.z += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}