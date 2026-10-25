import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export class SpaceScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public isSoftwareGl: boolean;

  // Starfield layers
  private nearStars: THREE.Points;
  private distantStars: THREE.Points;
  private asteroids: THREE.Mesh[] = [];

  // Camera Shake
  public cameraShake = {
    intensity: 0,
    decay: 6,
    offset: new THREE.Vector3(),
  };

  private baseCameraPos = new THREE.Vector3(0, -2, 28);
  private baseCameraLookAt = new THREE.Vector3(0, 3, 0);

  constructor(container: HTMLDivElement) {
    // 1. Detect software WebGL guard
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020208);
    this.scene.fog = new THREE.FogExp2(0x020208, 0.015);

    // 3. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.baseCameraLookAt);

    // 4. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 5. Studio Environment map for PBR reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Lighting rig
    // Key directional light (warm solar ray)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    keyLight.position.set(15, 25, 20);
    this.scene.add(keyLight);

    // Cool galactic hemisphere light
    const hemiLight = new THREE.HemisphereLight(0x4466aa, 0x110022, 1.2);
    this.scene.add(hemiLight);

    // Cyan/magenta cosmic ambient lights
    const rimLight = new THREE.PointLight(0x00f0ff, 1.5, 40);
    rimLight.position.set(-18, 5, 10);
    this.scene.add(rimLight);

    const magentaRim = new THREE.PointLight(0xff00aa, 1.5, 40);
    magentaRim.position.set(18, 5, 10);
    this.scene.add(magentaRim);

    // 7. Starfields
    this.nearStars = this.createStarfield(1200, 1.2, 0.9, 80, 200);
    this.distantStars = this.createStarfield(2500, 0.6, 0.6, 150, 400);
    this.scene.add(this.nearStars);
    this.scene.add(this.distantStars);

    // 8. Distant procedural floating asteroids
    this.initAsteroidField();

    // 9. Neon warp gate / arena boundary rings in deep backdrop
    this.initArenaGrid();
  }

  private createStarfield(
    count: number,
    size: number,
    opacity: number,
    minDist: number,
    maxDist: number
  ): THREE.Points {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 120;
      positions[idx + 1] = (Math.random() - 0.5) * 120;
      positions[idx + 2] = -minDist - Math.random() * (maxDist - minDist);

      // Star hues: bluish-white, white, or slight pink
      const r = 0.8 + Math.random() * 0.2;
      const g = 0.85 + Math.random() * 0.15;
      const b = 0.9 + Math.random() * 0.1;

      colors[idx] = r;
      colors[idx + 1] = g;
      colors[idx + 2] = b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Points(geo, mat);
  }

  private initAsteroidField() {
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x3d3d45,
      roughness: 0.85,
      metalness: 0.1,
    });

    for (let i = 0; i < 16; i++) {
      const geo = new THREE.DodecahedronGeometry(1.5 + Math.random() * 2.5, 1);
      const mesh = new THREE.Mesh(geo, asteroidMat);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        -15 - Math.random() * 45
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.scene.add(mesh);
      this.asteroids.push(mesh);
    }
  }

  private initArenaGrid() {
    // Holographic warp portal arch in deep space
    const torusGeo = new THREE.TorusGeometry(32, 0.4, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x113366,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(0, 10, -50);
    this.scene.add(torus);
  }

  public triggerScreenShake(amount = 0.8) {
    this.cameraShake.intensity = Math.min(2.5, this.cameraShake.intensity + amount);
  }

  public update(delta: number, playerX = 0, isBoosting = false) {
    // 1. Scroll starfields for continuous forward flight sensation
    const speedMult = isBoosting ? 2.5 : 1.0;

    const nearPos = this.nearStars.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < nearPos.length; i += 3) {
      nearPos[i] -= 18 * speedMult * delta;
      if (nearPos[i] < -60) nearPos[i] = 60;
    }
    this.nearStars.geometry.attributes.position.needsUpdate = true;

    const distPos = this.distantStars.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < distPos.length; i += 3) {
      distPos[i] -= 6 * speedMult * delta;
      if (distPos[i] < -60) distPos[i] = 60;
    }
    this.distantStars.geometry.attributes.position.needsUpdate = true;

    // 2. Slow rotation of background asteroids
    for (const ast of this.asteroids) {
      ast.rotation.x += delta * 0.15;
      ast.rotation.y += delta * 0.2;
    }

    // 3. Camera follow & dynamic screen shake
    if (this.cameraShake.intensity > 0.01) {
      this.cameraShake.intensity = Math.max(0, this.cameraShake.intensity - delta * this.cameraShake.decay);
      this.cameraShake.offset.set(
        (Math.random() - 0.5) * this.cameraShake.intensity,
        (Math.random() - 0.5) * this.cameraShake.intensity,
        (Math.random() - 0.5) * this.cameraShake.intensity * 0.5
      );
    } else {
      this.cameraShake.offset.set(0, 0, 0);
    }

    // Camera subtley pans with player X for cinematic perspective
    const targetCamX = playerX * 0.25;
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 4, delta) + this.cameraShake.offset.x;
    this.camera.position.y = this.baseCameraPos.y + this.cameraShake.offset.y;
    this.camera.position.z = (isBoosting ? this.baseCameraPos.z + 1.5 : this.baseCameraPos.z) + this.cameraShake.offset.z;

    this.camera.lookAt(
      targetCamX * 0.4 + this.baseCameraLookAt.x,
      this.baseCameraLookAt.y,
      this.baseCameraLookAt.z
    );
  }

  public handleResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.renderer.dispose();
  }
}
