import * as THREE from 'three';
import { ParticleSystem } from './particles';
import { ProjectileManager } from './projectiles';
import { sound } from './audio';

export interface EnemyConfig {
  level: number;
  name: string;
  maxHealth: number;
  speed: number;
  fireCooldown: number;
  shotType: 'single' | 'double' | 'spread' | 'burst';
  shotSpeed: number;
  hullColor: number;
  accentColor: number;
  glowColor: number;
  scale: number;
}

export class EnemyShip {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public config!: EnemyConfig;

  public health: number = 5;
  public maxHealth: number = 5;
  public isAlive: boolean = false;
  public isDying: boolean = false;
  public deathTimer: number = 0;

  // Turrets that aim at player
  private turrets: THREE.Mesh[] = [];
  private hullMeshes: THREE.Mesh[] = [];
  private engineMeshes: THREE.Mesh[] = [];
  private hitFlashTimer: number = 0;

  // Movement AI state
  private moveTimer: number = 0;
  private targetPosition: THREE.Vector3 = new THREE.Vector3(0, 6, 0);
  private fireTimer: number = 0;
  private burstCounter: number = 0;
  private burstTimer: number = 0;

  // Warp in entrance
  public isEntering: boolean = false;
  private entranceTimer: number = 0;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.position = this.group.position;
    this.group.visible = false;
    scene.add(this.group);
  }

  /**
   * Procedurally construct a 3D composite spaceship model with 8+ distinct parts
   */
  private buildShipModel(config: EnemyConfig) {
    // Clear old children
    while (this.group.children.length > 0) {
      const child = this.group.children[0] as THREE.Mesh;
      this.group.remove(child);
      if (child.geometry) child.geometry.dispose();
    }
    this.hullMeshes = [];
    this.turrets = [];
    this.engineMeshes = [];

    const hullMat = new THREE.MeshStandardMaterial({
      color: config.hullColor,
      roughness: 0.35,
      metalness: 0.85,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: config.accentColor,
      roughness: 0.25,
      metalness: 0.9,
    });

    const glowMat = new THREE.MeshStandardMaterial({
      color: config.glowColor,
      emissive: config.glowColor,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.1,
    });

    // 1. Primary silhouette: Central armored wedge hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 3.2); // nose pointing down
    hullShape.lineTo(2.4, -1.8); // right wing
    hullShape.lineTo(1.2, -2.6); // right engine bay
    hullShape.lineTo(-1.2, -2.6); // left engine bay
    hullShape.lineTo(-2.4, -1.8); // left wing
    hullShape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 1.2,
      bevelEnabled: true,
      bevelThickness: 0.35,
      bevelSize: 0.3,
      bevelSegments: 3,
    };

    const mainHullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    mainHullGeo.center();
    const mainHull = new THREE.Mesh(mainHullGeo, hullMat);
    // Face down towards player
    mainHull.rotation.z = Math.PI;
    this.group.add(mainHull);
    this.hullMeshes.push(mainHull);

    // 2. Secondary read: Dorsal Command Bridge / Spire
    const bridgeGeo = new THREE.BoxGeometry(1.0, 1.8, 1.2);
    const bridge = new THREE.Mesh(bridgeGeo, accentMat);
    bridge.position.set(0, -0.2, 0.9);
    this.group.add(bridge);
    this.hullMeshes.push(bridge);

    // Visor sensor slit (red/amber glow)
    const visorGeo = new THREE.BoxGeometry(0.8, 0.25, 0.3);
    const visor = new THREE.Mesh(visorGeo, glowMat);
    visor.position.set(0, -0.9, 1.4);
    this.group.add(visor);

    // 3. Heavy Port & Starboard Warp Nacelles / Cannons
    const nacelleGeo = new THREE.CylinderGeometry(0.35, 0.45, 3.8, 12);
    nacelleGeo.rotateX(Math.PI / 2);

    const leftNacelle = new THREE.Mesh(nacelleGeo, accentMat);
    leftNacelle.position.set(-2.2, 0.2, 0.1);
    this.group.add(leftNacelle);
    this.hullMeshes.push(leftNacelle);

    const rightNacelle = new THREE.Mesh(nacelleGeo, accentMat);
    rightNacelle.position.set(2.2, 0.2, 0.1);
    this.group.add(rightNacelle);
    this.hullMeshes.push(rightNacelle);

    // Plasma conduits on nacelles
    const conduitGeo = new THREE.TorusGeometry(0.48, 0.08, 8, 16);
    const leftConduit = new THREE.Mesh(conduitGeo, glowMat);
    leftConduit.position.set(-2.2, 0.2, 0.1);
    this.group.add(leftConduit);

    const rightConduit = new THREE.Mesh(conduitGeo, glowMat);
    rightConduit.position.set(2.2, 0.2, 0.1);
    this.group.add(rightConduit);

    // 4. Twin Rotatable Plasma Turrets
    const turretBaseGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.3, 12);
    turretBaseGeo.rotateX(Math.PI / 2);

    const leftTurret = new THREE.Mesh(turretBaseGeo, accentMat);
    leftTurret.position.set(-1.1, -1.2, 0.8);
    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const leftBarrel = new THREE.Mesh(barrelGeo, glowMat);
    leftBarrel.position.set(0, 0.5, 0);
    leftTurret.add(leftBarrel);
    this.group.add(leftTurret);
    this.turrets.push(leftTurret);

    const rightTurret = new THREE.Mesh(turretBaseGeo, accentMat);
    rightTurret.position.set(1.1, -1.2, 0.8);
    const rightBarrel = new THREE.Mesh(barrelGeo.clone(), glowMat);
    rightBarrel.position.set(0, 0.5, 0);
    rightTurret.add(rightBarrel);
    this.group.add(rightTurret);
    this.turrets.push(rightTurret);

    // 5. Twin Rear Ion Thruster Cones
    const engineGeo = new THREE.CylinderGeometry(0.45, 0.2, 0.8, 12);
    engineGeo.rotateX(Math.PI / 2);

    const leftEngine = new THREE.Mesh(engineGeo, glowMat);
    leftEngine.position.set(-0.9, 2.5, 0);
    this.group.add(leftEngine);
    this.engineMeshes.push(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeo, glowMat);
    rightEngine.position.set(0.9, 2.5, 0);
    this.group.add(rightEngine);
    this.engineMeshes.push(rightEngine);

    // Overall scale
    this.group.scale.set(config.scale, config.scale, config.scale);
  }

  /**
   * Spawn a new 3D enemy battleship scaled by current wave/level
   */
  public spawn(level: number, particles: ParticleSystem) {
    const config = this.getDifficultyConfig(level);
    this.config = config;
    this.buildShipModel(config);

    this.health = config.maxHealth;
    this.maxHealth = config.maxHealth;
    this.isAlive = true;
    this.isDying = false;
    this.deathTimer = 0;
    this.moveTimer = 0;
    this.fireTimer = 1.2; // brief grace period before opening fire
    this.burstCounter = 0;
    this.isEntering = true;
    this.entranceTimer = 1.0;

    // Start above screen and warp in
    this.position.set(0, 24, 0);
    this.targetPosition.set(0, 6, 0);
    this.group.visible = true;

    // Hyperspace entrance shockwave
    particles.emitShockwave(new THREE.Vector3(0, 6, 0), config.glowColor, 14);
  }

  private getDifficultyConfig(level: number): EnemyConfig {
    const names = [
      'KYBER-TIEDUSTELIJA (MK-I)',
      'HYÖKKÄYS-KORVETTI (MK-II)',
      'RASKAS TUHOAJA (MK-III)',
      'PIMEÄ RISTEILIJÄ (MK-IV)',
      'VALTAKUNNAN TAISTELULAIVA (MK-V)',
      'APOKALYPSI-DREADNOUGHT (MK-VI)',
      'IKUINEN VOID-LEVIATHAN (MK-Ω)',
    ];

    const colors = [
      { hull: 0x242e38, accent: 0x3d5a80, glow: 0xff3355 }, // Blue/Red
      { hull: 0x2b2d42, accent: 0xd90429, glow: 0xff5400 }, // Dark Slate/Crimson
      { hull: 0x1f2421, accent: 0x495867, glow: 0x9b5de5 }, // Gunmetal/Purple
      { hull: 0x1b1b1e, accent: 0xe63946, glow: 0x00f5d4 }, // Obsidian/Cyan
      { hull: 0x220901, accent: 0x941b0c, glow: 0xf77f00 }, // Magma Gold
      { hull: 0x140152, accent: 0x22007c, glow: 0xff007f }, // Neon Violet
      { hull: 0x03071e, accent: 0xd00000, glow: 0xff0054 }, // Ultimate Void
    ];

    const idx = Math.min(level - 1, names.length - 1);
    const theme = colors[idx % colors.length];

    // Difficulty scaling formula
    const hp = 4 + (level - 1) * 3;
    const spd = Math.min(18, 7 + level * 1.2);
    const fireInterval = Math.max(0.65, 2.2 - (level - 1) * 0.22);

    let shotType: 'single' | 'double' | 'spread' | 'burst' = 'single';
    if (level === 2) shotType = 'double';
    else if (level === 3) shotType = 'spread';
    else if (level >= 4) shotType = (level % 2 === 0) ? 'burst' : 'spread';

    return {
      level,
      name: names[idx] || `SOTALAIVA MK-${level}`,
      maxHealth: hp,
      speed: spd,
      fireCooldown: fireInterval,
      shotType,
      shotSpeed: 16 + level * 1.5,
      hullColor: theme.hull,
      accentColor: theme.accent,
      glowColor: theme.glow,
      scale: Math.min(1.4, 0.9 + level * 0.05),
    };
  }

  public takeDamage(amount: number, particles: ParticleSystem): boolean {
    if (!this.isAlive || this.isDying) return false;

    this.health = Math.max(0, this.health - amount);
    this.hitFlashTimer = 0.12;

    // Flash hull meshes white
    for (const mesh of this.hullMeshes) {
      if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).emissive) {
        (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff);
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
      }
    }

    // Spark particles
    particles.emit(
      this.position,
      new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8),
      new THREE.Color(1.0, 0.6, 0.1),
      0.65,
      0.35,
      6,
      0.6
    );

    if (this.health <= 0) {
      this.triggerDeath(particles);
      return true; // destroyed!
    }

    return false;
  }

  private triggerDeath(particles: ParticleSystem) {
    this.isDying = true;
    this.deathTimer = 1.4;

    // Big explosive audio
    sound.playEnemyExplosion();

    // Spawn massive shockwave ring
    particles.emitShockwave(this.position, this.config.glowColor, 22);

    // Initial fiery blast particles
    particles.emit(
      this.position,
      new THREE.Vector3(0, 0, 0),
      new THREE.Color(1.0, 0.3, 0.0),
      1.8,
      0.8,
      35,
      1.8
    );
  }

  public update(
    delta: number,
    playerPosition: THREE.Vector3,
    projectiles: ProjectileManager,
    particles: ParticleSystem
  ): boolean {
    if (!this.isAlive) return false;

    // 1. Dying explosion sequence
    if (this.isDying) {
      this.deathTimer -= delta;

      // Shatter and rotate pieces
      this.group.rotation.x += delta * 4;
      this.group.rotation.z += delta * 6;
      this.group.scale.multiplyScalar(Math.max(0.01, 1 - delta * 0.8));

      // Continuous explosion bursts
      if (Math.random() < 0.65) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3
        );
        particles.emit(
          this.position.clone().add(offset),
          offset.clone().multiplyScalar(4),
          new THREE.Color(1.0, Math.random() * 0.5 + 0.2, 0.0),
          1.2,
          0.5,
          8,
          0.8
        );
      }

      if (this.deathTimer <= 0) {
        this.isAlive = false;
        this.isDying = false;
        this.group.visible = false;
        return true; // Fully cleaned up!
      }
      return false;
    }

    // 2. Entrance warp glide
    if (this.isEntering) {
      this.entranceTimer -= delta;
      this.position.y = THREE.MathUtils.damp(this.position.y, this.targetPosition.y, 8, delta);
      if (this.entranceTimer <= 0) {
        this.isEntering = false;
      }
      return false;
    }

    // 3. Reset hit flash
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        for (const mesh of this.hullMeshes) {
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).emissive) {
            (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
          }
        }
      }
    }

    // 4. Movement AI (3D swooping strafes & tactical evasion)
    this.moveTimer -= delta;
    if (this.moveTimer <= 0) {
      this.moveTimer = 1.4 + Math.random() * 1.5;
      // Pick new target waypoint in the upper combat zone
      const targetX = (Math.random() - 0.5) * 22;
      const targetY = 3.5 + Math.random() * 4.5;
      const targetZ = (Math.random() - 0.5) * 3;
      this.targetPosition.set(targetX, targetY, targetZ);
    }

    // Move smoothly towards target
    this.position.x = THREE.MathUtils.damp(this.position.x, this.targetPosition.x, this.config.speed * 0.35, delta);
    this.position.y = THREE.MathUtils.damp(this.position.y, this.targetPosition.y, this.config.speed * 0.35, delta);
    this.position.z = THREE.MathUtils.damp(this.position.z, this.targetPosition.z, 2.5, delta);

    // Roll into movement
    const rollAngle = (this.position.x - this.targetPosition.x) * 0.08;
    this.group.rotation.z = THREE.MathUtils.damp(this.group.rotation.z, rollAngle, 6, delta);
    this.group.rotation.x = Math.sin(Date.now() * 0.003) * 0.15;

    // 5. Aim turrets towards player ship
    const playerLocal = playerPosition.clone().sub(this.position);
    const aimAngle = Math.atan2(playerLocal.x, -playerLocal.y);
    for (const turret of this.turrets) {
      turret.rotation.z = THREE.MathUtils.damp(turret.rotation.z, aimAngle, 8, delta);
    }

    // 6. Thruster trail
    const thrustColor = new THREE.Color(this.config.glowColor);
    for (const engine of this.engineMeshes) {
      const engineWorld = engine.getWorldPosition(new THREE.Vector3());
      particles.emit(
        engineWorld,
        new THREE.Vector3(0, 10, 0),
        thrustColor,
        0.75,
        0.3,
        1,
        0.15
      );
    }

    // 7. Weapon firing patterns
    this.fireTimer -= delta;
    if (this.fireTimer <= 0) {
      this.executeFirePattern(playerPosition, projectiles);
      this.fireTimer = this.config.fireCooldown;
    }

    // Sub-burst handler for burst firing mode
    if (this.burstCounter > 0) {
      this.burstTimer -= delta;
      if (this.burstTimer <= 0) {
        this.burstCounter--;
        this.burstTimer = 0.14;
        const dir = playerPosition.clone().sub(this.position).normalize();
        projectiles.spawnEnemyBullet(
          this.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.5, -1.8, 0)),
          dir,
          this.config.shotSpeed * 1.1,
          this.config.glowColor,
          15
        );
        sound.playEnemyShot();
      }
    }

    return false;
  }

  private executeFirePattern(playerPosition: THREE.Vector3, projectiles: ProjectileManager) {
    const aimDir = playerPosition.clone().sub(this.position).normalize();
    const spawnOrigin = this.position.clone().add(new THREE.Vector3(0, -2, 0));

    sound.playEnemyShot();

    switch (this.config.shotType) {
      case 'single':
        projectiles.spawnEnemyBullet(spawnOrigin, aimDir, this.config.shotSpeed, this.config.glowColor, 18);
        break;

      case 'double':
        projectiles.spawnEnemyBullet(
          this.position.clone().add(new THREE.Vector3(-1.8, -1.5, 0)),
          aimDir,
          this.config.shotSpeed,
          this.config.glowColor,
          16
        );
        projectiles.spawnEnemyBullet(
          this.position.clone().add(new THREE.Vector3(1.8, -1.5, 0)),
          aimDir,
          this.config.shotSpeed,
          this.config.glowColor,
          16
        );
        break;

      case 'spread': {
        const spreadAngles = [-0.25, 0, 0.25];
        for (const angle of spreadAngles) {
          const dir = aimDir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
          projectiles.spawnEnemyBullet(spawnOrigin, dir, this.config.shotSpeed * 0.95, this.config.glowColor, 15);
        }
        break;
      }

      case 'burst':
        projectiles.spawnEnemyBullet(spawnOrigin, aimDir, this.config.shotSpeed, this.config.glowColor, 15);
        this.burstCounter = 2; // will fire 2 more in quick succession
        this.burstTimer = 0.14;
        break;
    }
  }
}
