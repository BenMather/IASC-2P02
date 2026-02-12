import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/* setup */
// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/************
 * SCENE
 *********/

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, -5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)


/*****
* MESHES *
******/

// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(testSphere)

// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * 0.5

scene.add(plane)

/****
 * UI
 *****/

// UI
const ui = new dat.GUI()

// UI Object
const uiObject = {
    speed: 1,
    distance: 1
}

// plane UI
const planeFolder = ui.addFolder('Plane')

planeFolder
    .add(planeMaterial, 'wireframe')
    .name("Toggle Wireframe")

// testSphere UI
const sphereFolder = ui.addFolder('Sphere')

sphereFolder
    .add(uiObject, 'speed')
    .min(0.1)
    .max(50)
    .step(0.1)
    .name('Speed')

sphereFolder
    .add(uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Distance')

sphereFolder
    .add(testSphere.scale, 'x')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('scale x')

/**********
** ANIMATION LOOP
**********/

const clock = new THREE.Clock()

const animation = () =>
{
    
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate Sphere
    testSphere.position.y = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance

    // Update OrbitControls
    controls.update()
    controls.enableDamping = true

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()


