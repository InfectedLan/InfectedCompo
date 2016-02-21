var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
var timer = new THREE.Clock(true);

var renderer = new THREE.WebGLRenderer();
$(document).ready(function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("#canvasHolder").append(renderer.domElement);
});
$(window).resize(function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
});

var material = new THREE.MeshPhongMaterial( {
/*    color: 0xffffff,
    specular: 0x222222,*/
    shininess: 10,
    map: THREE.ImageUtils.loadTexture( "images/shitty_ashfalt.png" ),
    /*specularMap: THREE.ImageUtils.loadTexture( "obj/leeperrysmith/Map-SPEC.jpg" ),*/
    normalMap: THREE.ImageUtils.loadTexture( "images/NormalMap.png" ),
    normalScale: new THREE.Vector2( 0.1, 0.1 ),
    textureScale: new THREE.Vector2(0.2, 0.2)
} );
//var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var geometry = new THREE.CubeGeometry( 600, 600, 1);
var plane = new THREE.Mesh(geometry, material);
plane.position.z = 60;
//plane.position.x = 300;
plane.position.y = -50;
plane.rotation.x = Math.PI/2;
scene.add(plane);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(0, 10, -30);
scene.add(dirLight);
/*
//Particles
var particleCount = 1800;
var particles = new THREE.Geometry();
var pMaterial = new THREE.ParticleBasicMaterial({
  color: 0xFFFFFF,
  size: 100,
  map: THREE.ImageUtils.loadTexture(
    "images/smoke.png"
  ),
    blending: THREE.AdditiveBlending,
    depthWrite: false, depthTest: false,
  transparent: true
});
// now create the individual particles
for (var p = 0; p < particleCount; p++) {

    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * 2000 - 1000,
	pY = Math.random() * 500 - 250,
	pZ = Math.random() * (-100) - 400,
	particle = new THREE.Vector3(pX, pY, pZ);

    particle.velocity = new THREE.Vector3(10+Math.random()*5, 0, 0);

    // add it to the geometry
    particles.vertices.push(particle);
}
camera.position.z = 0;
// create the particle system
var particleSystem = new THREE.ParticleSystem(
    particles,
    pMaterial);

// add it to the scene
scene.add(particleSystem);
scene.add(new THREE.AxisHelper(10));
*/

camera.position.y = -5;
camera.rotation.x = (Math.PI/180)*-10;

var emitter, particleGroup;

function initParticleSystem() {
    particleGroup = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture('images/smoke.png'),
        },
        blending: THREE.AdditiveBlending,
        fog: true
    });
    emitter = new SPE.Emitter({
        particleCount: 1200,
        maxAge: {
            value: 10,
	    spread: 5
        },
        position: {
            value: new THREE.Vector3( 0, -60, -100),
            spread: new THREE.Vector3( 800, 110, -200 )
        },
        velocity: {
            value: new THREE.Vector3( -5, 0, 0 ),
	    spread: new THREE.Vector3(-10, 0, 0)
	  
        },
        wiggle: {
            spread: 20
        },
        size: {
            value: 200,
            spread: 100
        },
        opacity: {
            value: [ 0, 0.1, 0 ]
        },
        color: {
            value: new THREE.Color( 1, 0.7, 0.5 ),
            spread: new THREE.Color( 0.1, 0.2, 0.2 )
        },
        angle: {
            value: [ 0, Math.PI * 0.125 ]
        }
    });
    particleGroup.addEmitter( emitter );
    scene.add( particleGroup.mesh );
}
initParticleSystem();
particleGroup.tick(5);

var vsOverlay, fsOverlay;
function initOverlayShader() {
    var mOverlay;

    var vUniforms = {resolution: {type: "v2", value: new THREE.Vector2()}};
    vUniforms.resolution.value.x = window.innerWidth;
    vUniforms.resolution.value.y = window.innerHeight;

    console.log("Fragment shader: " + fsOverlay);
    console.log("Vertex shader: " + vsOverlay);
    mOverlay = new THREE.ShaderMaterial({uniforms: vUniforms, vertexShader: vsOverlay, fragmentShader: fsOverlay});
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), mOverlay));
}

var downloaded = 0, downloadTarget=2;
function initDownloads() {
    $.get('scripts/overlay.fs', function(dataFs) {
	fsOverlay = dataFs;
	downloaded++;
	if(downloaded==downloadTarget) {
	    downloadingComplete();
	}
    });

    $.get('scripts/overlay.vs', function(dataVs) {
	vsOverlay = dataVs;
	downloaded++;
	if(downloaded==downloadTarget) {
	    downloadingComplete();
	}
    });
}
initDownloads();

function downloadingComplete() {
    initOverlayShader();
    setInterval( function () {
	requestAnimationFrame(render);
    }, 1000 / 30 );
}

//Rendering
function render() {
    particleGroup.tick(timer.getDelta());
    
    renderer.render( scene, camera );
}

