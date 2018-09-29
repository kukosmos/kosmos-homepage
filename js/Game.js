var camera, scene, renderer;
var mesh;
var frustrumSize = 1000;

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('canvas').appendChild(warning);
}

function init() {

    // Setup
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas") });

    // Make and setup a camera.
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(frustrumSize * aspect / -2, frustrumSize * aspect / 2, frustrumSize * aspect / 2, frustrumSize * aspect / -2, 0, 1000);
    camera.position.z = 1;

    // Make a scene
    scene = new THREE.Scene();

}