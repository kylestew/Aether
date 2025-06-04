import * as THREE from 'three'

// Create a renderer that will draw to our canvas
let renderer = null
let scene = null
let camera = null
let controls = null
let knot = null

export const simple3DLayer = {
    async init() {
        renderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            alpha: true,
            antialias: true,
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.0

        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000) // White background

        // Camera will be set up in render() to match aspect
        camera = null
        controls = null
        knot = null
    },

    render(ctx, { resolution, t, totalTime }) {
        const { width, height } = resolution
        const aspect = width / height
        const frustumSize = 5.5

        // Set up orthographic camera and controls if not already
        if (!camera) {
            camera = new THREE.OrthographicCamera(
                (-frustumSize * aspect) / 2,
                (frustumSize * aspect) / 2,
                frustumSize / 2,
                -frustumSize / 2,
                0.01,
                500
            )
            camera.position.set(0, 0, 10)
            camera.lookAt(0, 0, 0)

            // Lighting: strong directional + subtle ambient
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
            scene.add(ambientLight)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 8.0)
            directionalLight.position.set(5, 10, -5)
            scene.add(directionalLight)

            // Orange torus knot
            const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 3)
            const material = new THREE.MeshStandardMaterial({ color: 'white' })
            knot = new THREE.Mesh(geometry, material)
            scene.add(knot)
        }

        // Update camera aspect/frustum if needed
        camera.left = (-frustumSize * aspect) / 2
        camera.right = (frustumSize * aspect) / 2
        camera.top = frustumSize / 2
        camera.bottom = -frustumSize / 2
        camera.updateProjectionMatrix()

        // Animate knot (single Y rotation over totalTime)
        if (knot) {
            knot.rotation.set(0, (t / totalTime) * Math.PI * 2, 0)
        }

        // controls.update()
        renderer.setSize(width, height)
        renderer.render(scene, camera)
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(renderer.domElement, 0, 0, width, height)
    },
}
