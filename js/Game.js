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
    camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize * aspect / 2, frustumSize * aspect / -2, 0, 1000);
    camera.position.z = 100;

    // Make a scene
    scene = new THREE.Scene();

     //Make light
     var Ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
     Ambientlight.position.z = 100;
     scene.add(Ambientlight);
 
     var PointLight = new THREE.PointLight(0xffffff, 0.5);
     PointLight.position.z = 100;
     scene.add(PointLight);

    var geometry = new THREE.BoxGeometry(100,100,100);
    var material = new THREE.MeshLambertMaterial({color: 0xff0000});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -100;
    scene.add(mesh);
    
    // Make a Barrier
    
   
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

    mesh.rotation.x += 0.05;
    mesh.rotation.y += 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}