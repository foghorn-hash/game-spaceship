import * as THREE from 'three';
import { ParticleSystem } from './particles';

export class PlayerShip {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3 = new THREE.Vector3();

  public health: number = 100;
  public maxHealth: number = 100;
  public shield: number = 100;
  public maxShield: number = 100;
  public shieldRegenRate: number = 8; // per second
  public shieldRegenDelay: number = 0;

  public isInvulnerable: boolean = false;
  private invulnerableTimer: number = 0;

  private spriteMesh!: THREE.Mesh;
  private shieldMesh!: THREE.Mesh;
  private thrusterPoints: THREE.Vector3[] = [];

  private targetRoll: number = 0;
  private targetPitch: number = 0;

  public bounds = {
    minX: -16,
    maxX: 16,
    minY: -9,
    maxY: 9,
  };

  private speed: number = 24;
  private boostMultiplier: number = 1.7;

  constructor(scene: THREE.Scene, textureLoader: THREE.TextureLoader) {
    this.group = new THREE.Group();
    this.position = this.group.position;
    this.position.set(0, -6, 0);

    // 1. Load user's 2D PNG player ship texture
    const texture = textureLoader.load('./assets/aistudio/ship_f10530f0.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    // Create 2D plane for the ship sprite with additive glow
    const planeGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.spriteMesh = new THREE.Mesh(planeGeo, planeMat);
    // Align so ship points upward (+Y)
    this.spriteMesh.rotation.x = -0.2; // slight tilt forward towards screen
    this.group.add(this.spriteMesh);

    // Add back glow sprite layer for intense neon plasma glow
    const glowMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(planeGeo.clone(), glowMat);
    glowMesh.scale.set(1.15, 1.15, 1.15);
    glowMesh.position.z = -0.05;
    this.group.add(glowMesh);

    // 2. 3D Energy Shield bubble (icosahedron/sphere wireframe + transparent shell)
    const shieldGeo = new THREE.SphereGeometry(2.1, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.group.add(this.shieldMesh);

    // 3. Thruster exhaust positions (left & right base of the triangle)
    this.thrusterPoints = [
      new THREE.Vector3(-0.8, -1.2, 0),
      new THREE.Vector3(0.8, -1.2, 0),
      new THREE.Vector3(0, -1.3, 0),
    ];

    scene.add(this.group);
  }

  public takeDamage(amount: number): boolean {
    if (this.isInvulnerable) return false;

    this.shieldRegenDelay = 3.0; // delay shield regeneration

    if (this.shield > 0) {
      if (this.shield >= amount) {
        this.shield -= amount;
        amount = 0;
      } else {
        amount -= this.shield;
        this.shield = 0;
      }
      // Flash shield
      (this.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
      (this.shieldMesh.material as THREE.MeshBasicMaterial).color.setHex(0x00f0ff);
    }

    if (amount > 0) {
      this.health = Math.max(0, this.health - amount);
      // Flash red
      (this.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0.9;
      (this.shieldMesh.material as THREE.MeshBasicMaterial).color.setHex(0xff0044);
    }

    this.isInvulnerable = true;
    this.invulnerableTimer = 0.4;
    return true;
  }

  public reset(x = 0, y = -6) {
    this.position.set(x, y, 0);
    this.velocity.set(0, 0, 0);
    this.health = this.maxHealth;
    this.shield = this.maxShield;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;
    this.group.visible = true;
  }

  public update(
    delta: number,
    moveInput: { x: number; y: number },
    isBoosting: boolean,
    particles: ParticleSystem
  ) {
    // Invulnerability timer flash
    if (this.isInvulnerable) {
      this.invulnerableTimer -= delta;
      this.spriteMesh.visible = Math.floor(Date.now() / 60) % 2 === 0;
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
        this.spriteMesh.visible = true;
      }
    }

    // Shield regeneration
    if (this.shieldRegenDelay > 0) {
      this.shieldRegenDelay -= delta;
    } else if (this.shield < this.maxShield && this.health > 0) {
      this.shield = Math.min(this.maxShield, this.shield + this.shieldRegenRate * delta);
    }

    // Fade shield mesh
    const shieldMat = this.shieldMesh.material as THREE.MeshBasicMaterial;
    if (shieldMat.opacity > 0) {
      shieldMat.opacity = Math.max(0, shieldMat.opacity - delta * 2.5);
    }

    // Calculate movement physics
    const currentSpeed = isBoosting ? this.speed * this.boostMultiplier : this.speed;
    const targetVelX = moveInput.x * currentSpeed;
    const targetVelY = moveInput.y * currentSpeed;

    // Smooth inertia
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, targetVelX, 14, delta);
    this.velocity.y = THREE.MathUtils.damp(this.velocity.y, targetVelY, 14, delta);

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    // Boundary constraints
    this.position.x = THREE.MathUtils.clamp(this.position.x, this.bounds.minX, this.bounds.maxX);
    this.position.y = THREE.MathUtils.clamp(this.position.y, this.bounds.minY, this.bounds.maxY);

    // Banking & tilt kinematics
    this.targetRoll = -this.velocity.x * 0.035; // roll into turn
    this.targetPitch = this.velocity.y * 0.02 - 0.2; // pitch up/down with elevation

    this.group.rotation.z = THREE.MathUtils.damp(this.group.rotation.z, this.targetRoll, 10, delta);
    this.group.rotation.x = THREE.MathUtils.damp(this.group.rotation.x, this.targetPitch, 10, delta);

    // Particle thrusters
    const magentaColor = new THREE.Color(1.0, 0.1, 0.7);
    const cyanColor = new THREE.Color(0.1, 0.9, 1.0);

    for (const offset of this.thrusterPoints) {
      const worldPos = offset.clone().applyMatrix4(this.group.matrixWorld);
      const thrustDir = new THREE.Vector3(0, -1, -0.3).applyQuaternion(this.group.quaternion);

      const thrustVel = thrustDir.multiplyScalar(isBoosting ? 18 : 10);
      particles.emit(
        worldPos,
        thrustVel,
        isBoosting ? cyanColor : magentaColor,
        isBoosting ? 0.9 : 0.6,
        0.25,
        isBoosting ? 2 : 1,
        0.15
      );
    }
  }

  public getFirePoint(): THREE.Vector3 {
    // Nose of triangle ship
    return new THREE.Vector3(0, 1.4, 0).applyMatrix4(this.group.matrixWorld);
  }
}
