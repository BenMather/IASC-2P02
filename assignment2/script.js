import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/* *************
*****SETUP */
// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}



// Resizing
window.addEventListener('resize', () => 
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight
    
    // Update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/************
 * SCENE
 *********/

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, -22)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)

/************
 * LIGHTS**
 ***********/

// Directional light

const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

// Ambient light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

/*****
* MESHES *
******/

// Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, params) =>
{
    // Create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    })

    // Create cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    // Position cube
    cube.position.x = (Math.random() - 0.5) * params.diameter
    cube.position.z = (Math.random() - 0.5) * params.diameter
    cube.position.y = height - 13

    // Scale cube
    cube.scale.x = params.scale
    cube.scale.z = params.scale
    cube.scale.y = params.scale
    


    // Group 2 spheres
    if (params.isSphere) {
    const sphereGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    });
    const sphere = new THREE.Mesh(sphereGeometry, material);

    // position & scale from cube code
    sphere.position.x = (Math.random() - 0.5) * params.diameter;
    sphere.position.z = (Math.random() - 0.5) * params.diameter;
    sphere.position.y = height - 13;

    sphere.scale.x = params.scale
    sphere.scale.z = params.scale
    sphere.scale.y = params.scale

    // Add to group
    params.group.add(sphere);

    return; // exit function early so we don’t also add a cube
}

    
    // randomize cube rotation
    if(params.randomized){
        cube.rotation.x = Math.random() * 2 * Math.PI
        cube.rotation.z = Math.random() * 2 * Math.PI
        cube.rotation.y = Math.random() * 2 * Math.PI
    }

    // Add cube to group
    params.group.add(cube)
}

/****
 * UI
 *****/

// UI
const ui = new dat.GUI()

let preset = {}

// Groups
const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)

const uiObj = {
    sourceText: "",
    saveSourceText() {
        saveSourceText()
    },
    term1: {
        term: 'witch',
        color: '#4c0061',
        diameter: 15,
        dynamicCubes: false,
        group: group1,
        isSphere: false,
        nCubes: 50,
        randomized: true,
        scale: 1
    },
    term2: {
        term: 'wizard',
        color: '#00ff5e',
        diameter: 5,
        dynamicCubes: false,
        group: group2,
        isSphere: true,
        nCubes: 50,
        randomized: true,
        scale: 1.7
    },
    term3: {
        term: 'home',
        color: '',
        diameter: 15,
        dynamicCubes: true,
        group: group3,
        isSphere: true,
        nCubes: 10,
        randomized: true,
        scale: 1.3

    },

    saveTerms() {
        saveTerms()
    },

    rotateCamera: false

}

// UI Functions
const saveSourceText = () =>
{
    // UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()
    cameraFolder.hide()

    // Text analysis
    tokenizeSourceText(uiObj.sourceText)
    //console.log(uiObj.sourceText)

}


const saveTerms = () =>
{
    // UI
    preset = ui.save
    visualizeFolder.hide()
    cameraFolder.show()


    // text analysis
    findSearchTermInTokenizedText(uiObj.term1)
    findSearchTermInTokenizedText(uiObj.term2)
    findSearchTermInTokenizedText(uiObj.term3)
}

// Text folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

// Terms, visualize + camera folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")

termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .add(group1, 'visible')
    .name("Term 1 Visibility")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .add(group2, 'visible')
    .name("Term 2 Visibility")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .add(group3, 'visible')
    .name("Term 3 Visibility")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

cameraFolder
    .add(uiObj, 'rotateCamera')
    .name("Turntable")


// Terms and Visualize folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()

/***************
 * TEXT ANALYSIS
 ***************/

// variables
let parsedText, tokenizedText

// Parse and tokenize sourceText
const tokenizeSourceText = (sourceText) =>
{
    // strip periods and downcase sourceText
    parsedText = sourceText.replaceAll(".", "").toLowerCase()
    
    // tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// Find searchTerm in tokenizedText
const findSearchTermInTokenizedText = (params) =>
{
    for (let i = 0; i < tokenizedText.length; i++) {
    if (tokenizedText[i] === params.term) {

        const normalizedHeight = i / (tokenizedText.length - 1);

        const height = normalizedHeight * 20;

        // Dynamic cube amounts / more cubes at top
        let nCubes = params.nCubes;
        if (params.dynamicCubes) {
            nCubes = Math.ceil(params.nCubes * (1 + 3 * normalizedHeight));
        }

        for (let a = 0; a < nCubes; a++) {
            drawCube(height, params);
        }
    }
}
}

/**********
** ANIMATION LOOP
**********/

const clock = new THREE.Clock()

const animation = () =>
{
    
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Update OrbitControls
    controls.update()
    controls.enableDamping = true

    // Rotate Camera
    if(uiObj.rotateCamera){
        camera.position.x = Math.sin(elapsedTime * 0.1) * 20
        camera.position.z = Math.cos(elapsedTime * 0.1) * 20
        camera.position.y = 5
        camera.lookAt(0, 0, 0)        
    }

    // Choppy rotation for group 1

    const points = 4
    group1.rotation.y = Math.floor(elapsedTime * points) / points 

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()


