import * as THREE from 'three';
import { ParticleSystem } from './particles';

export interface PlayerBullet {
  mesh: THREE.Group;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: number;
  light?: THREE.PointLight;
  life: number;
  damage: number;
}

export interface EnemyBullet {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  damage: number;
  color: number;
}

export class ProjectileManager {
  public playerBullets: PlayerBullet[] = [];
  public enemyBullets: EnemyBullet[] = [];

  private scene: THREE.Scene;
  private minuteTexture: THREE.Texture;

  // Reusable materials & geometries
  private minutePlaneGeo: THREE.PlaneGeometry;
  private minuteMaterial: THREE.MeshBasicMaterial;
  private minuteGlowMaterial: THREE.MeshBasicMaterial;
  private enemySphereGeo: THREE.SphereGeometry;

  constructor(scene: THREE.Scene, textureLoader: THREE.TextureLoader) {
    this.scene = scene;

    // Load minute.png texture
    this.minuteTexture = textureLoader.load('/assets/aistudio/minute_06a99cad.png');
    this.minuteTexture.colorSpace = THREE.SRGBColorSpace;

    // Player bullet geometry & materials
    this.minutePlaneGeo = new THREE.PlaneGeometry(0.8, 3.2);

    this.minuteMaterial = new THREE.MeshBasicMaterial({
      map: this.minuteTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.minuteGlowMaterial = new THREE.MeshBasicMaterial({
      map: this.minuteTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      opacity: 0.9,
      depthWrite: false,
    });

    this.enemySphereGeo = new THREE.SphereGeometry(0.5, 12, 12);
  }

  /**
   * Spawn 3D-accelerator boosted plasma projectile (minute.png)
   */
  public spawnPlayerBullet(origin: THREE.Vector3, dir: THREE.Vector3 = new THREE.Vector3(0, 1, 0)) {
    const group = new THREE.Group();
    group.position.copy(origin);

    // Cross-billboard (two perpendicular planes) for full 3D volumetric presence
    const plane1 = new THREE.Mesh(this.minutePlaneGeo, this.minuteMaterial);
    const plane2 = new THREE.Mesh(this.minutePlaneGeo, this.minuteMaterial);
    plane2.rotation.y = Math.PI / 2;

    group.add(plane1);
    group.add(plane2);

    // Add 3D accelerator energy ring at base of bolt
    const ringGeo = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x33ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.6;
    group.add(ring);

    // Dynamic point light for top 3 bullets to avoid WebGL light limit
    let light: THREE.PointLight | undefined = undefined;
    if (this.playerBullets.length < 3) {
      light = new THREE.PointLight(0x00ff66, 2.5, 9);
      group.add(light);
    }

    this.scene.add(group);

    const initialSpeed = 36;
    const bulletVel = dir.clone().normalize().multiplyScalar(initialSpeed);

    this.playerBullets.push({
      mesh: group,
      position: group.position,
      velocity: bulletVel,
      acceleration: 45, // 3D accelerator kicks in!
      light,
      life: 1.8,
      damage: 1,
    });
  }

  /**
   * Spawn enemy plasma torpedo / ion orb
   */
  public spawnEnemyBullet(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number = 18,
    color: number = 0xff3355,
    damage: number = 20
  ) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(this.enemySphereGeo, mat);
    mesh.position.copy(origin);

    // Outer glow aura
    const outerGeo = new THREE.SphereGeometry(0.85, 10, 10);
    const outerMat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const aura = new THREE.Mesh(outerGeo, outerMat);
    mesh.add(aura);

    this.scene.add(mesh);

    this.enemyBullets.push({
      mesh,
      position: mesh.position,
      velocity: direction.clone().normalize().multiplyScalar(speed),
      life: 3.5,
      damage,
      color,
    });
  }

  public update(delta: number, particles: ParticleSystem) {
    const greenColor = new THREE.Color(0.2, 1.0, 0.4);

    // 1. Update Player Bullets
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const b = this.playerBullets[i];
      b.life -= delta;

      // 3D Accelerator: boost speed forward
      const currentSpeed = b.velocity.length();
      const newSpeed = Math.min(80, currentSpeed + b.acceleration * delta);
      b.velocity.setLength(newSpeed);

      b.position.addScaledVector(b.velocity, delta);

      // Emit accelerator plasma particles behind the bullet
      if (Math.random() < 0.75) {
        const emitPos = b.position.clone().add(new THREE.Vector3(0, -1.2, 0));
        particles.emit(
          emitPos,
          new THREE.Vector3(0, -8, 0),
          greenColor,
          0.45,
          0.18,
          1,
          0.1
        );
      }

      // Rotate accelerator ring
      if (b.mesh.children[2]) {
        b.mesh.children[2].rotation.z += delta * 12;
      }

      // Check bounds or lifetime
      if (b.life <= 0 || b.position.y > 28 || Math.abs(b.position.x) > 28) {
        this.scene.remove(b.mesh);
        this.playerBullets.splice(i, 1);
      }
    }

    // 2. Update Enemy Bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const eb = this.enemyBullets[i];
      eb.life -= delta;
      eb.position.addScaledVector(eb.velocity, delta);

      // Spin bullet aura
      eb.mesh.rotation.x += delta * 5;
      eb.mesh.rotation.y += delta * 7;

      // Emit trail
      if (Math.random() < 0.6) {
        particles.emit(
          eb.position,
          eb.velocity.clone().multiplyScalar(-0.15),
          new THREE.Color(eb.color),
          0.38,
          0.2,
          1,
          0.15
        );
      }

      // Check bounds or lifetime
      if (eb.life <= 0 || eb.position.y < -22 || Math.abs(eb.position.x) > 28) {
        this.scene.remove(eb.mesh);
        this.enemyBullets.splice(i, 1);
      }
    }
  }

  public clearAll() {
    for (const b of this.playerBullets) {
      this.scene.remove(b.mesh);
    }
    this.playerBullets = [];

    for (const eb of this.enemyBullets) {
      this.scene.remove(eb.mesh);
    }
    this.enemyBullets = [];
  }
}
