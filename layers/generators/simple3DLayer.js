import * as THREE from 'three'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js'

let renderer = null
let scene = null
let camera = null
let mesh = null

export const simple3DLayer = {
    defaultParams: {
        backgroundColor: '#000000',
        meshColor: '#ffffff',

        // backgroundColor: 0xffffff,
        // meshColor: 0x0050ee,

        cameraPosition: [10, 10, 10],

        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,

        frustumSize: 5.0,
        // Geometry types: 'cube', 'sphere', 'torus', 'knot', 'mobius', 'tetrahedron', 'octahedron', 'dodecahedron', 'icosahedron'
        geometryType: 'cube',
    },

    async init() {
        renderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            alpha: true,
            antialias: false,
        })
        renderer.setPixelRatio(window.devicePixelRatio)

        renderer.outputColorSpace = THREE.LinearSRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.3333

        scene = new THREE.Scene()
        // Don't set a default background color here

        // Camera will be set up in render() to match aspect
        camera = null
        mesh = null
    },

    _makeGeometry(type) {
        let geometry

        switch (type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(1.3, 1.3, 1.3)
                break
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32)
                break
            case 'torus':
                geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100)
                break
            case 'knot':
                geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16)
                break
            case 'mobius':
                geometry = new ParametricGeometry(
                    (u, t, target) => {
                        u *= Math.PI * 2
                        t = t * 2 - 1
                        const a = 1 + 0.5 * t * Math.cos(u / 2)
                        target.set(Math.cos(u) * a, Math.sin(u) * a, 0.5 * t * Math.sin(u / 2))
                    },
                    100,
                    20
                )
                break

            // 🧱 Platonic Solids
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(1.3)
                break
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(1)
                break
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(1)
                break
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(1)
                break

            default:
                return
        }

        return geometry
    },

    render(
        ctx,
        {
            width,
            height,
            backgroundColor,
            meshColor,
            cameraPosition,
            frustumSize,
            geometryType,
            rotation,
            scale,
            position,
        }
    ) {
        const aspect = width / height

        // SETUP SCENE ONCE
        if (!camera) {
            camera = new THREE.OrthographicCamera(
                (-frustumSize * aspect) / 2,
                (frustumSize * aspect) / 2,
                frustumSize / 2,
                -frustumSize / 2,
                0.01,
                500
            )
            camera.position.set(...cameraPosition)
            camera.lookAt(0, 0, 0)

            // Lighting: strong directional + subtle ambient
            // Key light - main illumination from front-right
            const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
            keyLight.position.set(5, 3, 5)
            scene.add(keyLight)

            // Fill light - softer light from opposite side
            const fillLight = new THREE.DirectionalLight(0xffffff, 7.0)
            fillLight.position.set(-5, 0, 5)
            scene.add(fillLight)

            // Back light - rim lighting from behind
            const backLight = new THREE.DirectionalLight(0xffffff, 10.0)
            backLight.position.set(0, 5, -5)
            scene.add(backLight)

            // Subtle ambient light to fill shadows
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
            scene.add(ambientLight)

            const geom = this._makeGeometry(geometryType)

            const mat = new THREE.MeshStandardMaterial({
                color: meshColor,
                metalness: 0.6,
                roughness: 0.3,
                emissive: 0x111111,
                emissiveIntensity: 0.3,
            })

            mesh = new THREE.Mesh(geom, mat)
            scene.add(mesh)
        }

        mesh.position.set(...position)
        mesh.rotation.set(...rotation)
        mesh.scale.set(scale, scale, scale)

        // Set background based on backgroundColor parameter
        if (
            backgroundColor === 'transparent' ||
            backgroundColor === 'rgba(0,0,0,0)' ||
            backgroundColor === '#00000000'
        ) {
            scene.background = null
            renderer.setClearColor(0x000000, 0)
        } else {
            scene.background = new THREE.Color(backgroundColor)
            renderer.setClearColor(0x000000, 1)
        }

        renderer.setSize(width, height)
        renderer.render(scene, camera)

        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(renderer.domElement, 0, 0, width, height)
    },
}
