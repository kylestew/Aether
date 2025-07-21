import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let renderer = null
let scene = null
let camera = null
let model = null

export const model3DLoader = {
    async init() {
        renderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            alpha: true,
            antialias: true,
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2

        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x111111)

        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
        camera.position.set(0, 1, 3)
        camera.lookAt(0, 1, 0)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1.0)
        light.position.set(2, 3, 4)
        scene.add(light)

        const loader = new GLTFLoader()
        try {
            const gltf = await loader.loadAsync('/assets/models/venus_de_milo_statuestexturingchallenge_smk.glb')
            model = gltf.scene

            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const scale = 2 / Math.max(size.x, size.y, size.z)

            model.scale.setScalar(scale)
            model.position.set(0, -center.y * scale + 0.1, 0)

            scene.add(model)
        } catch (err) {
            console.error('Failed to load model:', err)
            const geometry = new THREE.BoxGeometry()
            const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
            model = new THREE.Mesh(geometry, material)
            scene.add(model)
        }
    },

    render(ctx, { width, height, t, totalTime }) {
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        renderer.setSize(width, height)

        if (model) {
            model.rotation.y = (t / totalTime) * Math.PI * 2
        }

        renderer.render(scene, camera)

        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(renderer.domElement, 0, 0, width, height)
    },
}
