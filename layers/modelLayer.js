import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Create a renderer that will draw to our canvas
let renderer = null
let scene = null
let camera = null
let controls = null
let model = null

export const renderModelLayer = {
    async init() {
        // Create renderer
        renderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            alpha: true, // Allow transparency
            antialias: true,
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.outputColorSpace = THREE.SRGBColorSpace // Better color reproduction
        renderer.toneMapping = THREE.ACESFilmicToneMapping // Better lighting
        renderer.toneMappingExposure = 1.2

        // Create scene
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x111111) // Dark gray background

        // Create camera
        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000) // Narrower FOV for statue
        camera.position.set(0, 1, 3) // Position camera to look at statue

        // Add orbit controls
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.minDistance = 2
        controls.maxDistance = 10
        controls.maxPolarAngle = Math.PI * 0.9 // Prevent going below the statue
        controls.target.set(0, 1, 0) // Look at center of statue

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        scene.add(ambientLight)

        // Add directional lights for better statue definition
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.8)
        frontLight.position.set(0, 2, 2)
        scene.add(frontLight)

        const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
        backLight.position.set(0, 2, -2)
        scene.add(backLight)

        // Add subtle rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2)
        rimLight.position.set(2, 1, 0)
        scene.add(rimLight)

        // Load model
        const loader = new GLTFLoader()
        try {
            const gltf = await loader.loadAsync('/assets/models/venus_de_milo_statuestexturingchallenge_smk.glb')
            model = gltf.scene

            // Center and scale model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())

            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 2 / maxDim
            model.scale.multiplyScalar(scale)

            // Position model slightly above ground
            model.position.y = -center.y * scale + 0.1

            // Enable shadows if the model has them
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true
                    node.receiveShadow = true
                }
            })

            scene.add(model)
        } catch (error) {
            console.error('Error loading model:', error)
            // Add a default cube if model fails to load
            const geometry = new THREE.BoxGeometry()
            const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
            model = new THREE.Mesh(geometry, material)
            scene.add(model)
        }
    },

    render(ctx, { resolution, t, totalTime }) {
        const { width, height } = resolution

        // Update renderer size
        renderer.setSize(width, height)

        // Update camera aspect ratio
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        // Update controls
        controls.update()

        // Rotate model once over the total duration
        if (model) {
            model.rotation.y = (t / totalTime) * Math.PI * 2 // One full rotation (2π radians)
        }

        // Render the scene
        renderer.render(scene, camera)

        // Draw the WebGL canvas to our layer's canvas
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(renderer.domElement, 0, 0, width, height)
    },
}
