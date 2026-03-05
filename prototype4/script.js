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
camera.position.set(0, 12, -20)

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

/*****
* MESHES *
******/

// Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, color) =>
{
    // Create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color)
    })

    // Create cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    // Position cube
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = height - 13

    // randomize cube rotation
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI

    // Add cube to scene
    scene.add(cube)
}

//drawCube(0, 'red')
//drawCube(1, 'yellow')
//drawCube(2, 'green')
//drawCube(3, 'blue')

/****
 * UI
 *****/

// UI
const ui = new dat.GUI()

/***************
 * TEXT ANALYSIS
 ***************/

// source
const sourceText = "This morning, the sun was out so I went for a walk. I noticed some clouds, and as I came home, it started raining. When it was time for class, it was still raining so I put on a coat. But once I arrived at school, the sun had come back out, so I left the coat in my car. Leaving class, it was raining again! Looks like I should brought the coat..."





// variables
let parsedText, tokenizedText

// Parse and tokenize sourceText
const tokenizeSourceText = () =>
{
    // strip periods and downcase sourceText
    parsedText = sourceText.replaceAll(".", "").toLowerCase()
    
    // tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// Find searchTerm in tokenizedText
const findSearchTermInTokenizedText = (term, color) =>
{
    // for loop to go thru tokenizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        // If tokenizedText[i] matches search term, we draw a cube
        if(tokenizedText[i] === term){
            // convert i into height (value between 0 - 20)
            const height = (100 / tokenizedText.length) * i * 0.2

            // call drawCube function 100 times using converted height value
            for(let a = 0; a < 100; a++)
            {
                drawCube(height, color)
            }
        }
    }
}

tokenizeSourceText()
findSearchTermInTokenizedText("sun", "yellow")
findSearchTermInTokenizedText("raining", "blue")
findSearchTermInTokenizedText("clouds", "white")

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

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()


