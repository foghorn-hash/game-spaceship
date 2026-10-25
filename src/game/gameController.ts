import * as THREE from 'three';
import { SpaceScene } from './scene';
import { PlayerShip } from './playerShip';
import { EnemyShip } from './enemyShip';
import { ProjectileManager } from './projectiles';
import { ParticleSystem } from './particles';
import { sound } from './audio';
import { GameStats, InputState } from './types';

export class GameController {
  public scene: SpaceScene;
  public player: PlayerShip;
  public enemy: EnemyShip;
  public projectiles: ProjectileManager;
  public particles: ParticleSystem;

  public stats: GameStats = {
    score: 0,
    highScore: 0,
    level: 1,
    enemiesDestroyed: 0,
    playerHealth: 100,
    playerMaxHealth: 100,
    playerShield: 100,
    playerMaxShield: 100,
    enemyHealth: 5,
    enemyMaxHealth: 5,
    enemyName: 'KYBER-TIEDUSTELIJA (MK-I)',
    isPaused: false,
    isGameOver: false,
    gameStarted: false,
    waveClearNotice: null,
  };

  public input: InputState = {
    moveX: 0,
    moveY: 0,
    isShooting: false,
    isBoosting: false,
  };

  private playerShotCooldown: number = 0;
  private readonly playerFireRate: number = 0.17; // ~5.8 shots/sec

  private enemySpawnDelay: number = 0;
  private waveNoticeTimer: number = 0;

  private onStatsUpdate?: (stats: GameStats) => void;

  private clock = new THREE.Clock();
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  constructor(container: HTMLDivElement, onStatsUpdate?: (stats: GameStats) => void) {
    this.onStatsUpdate = onStatsUpdate;

    // Load saved highscore from localStorage
    try {
      const saved = localStorage.getItem('plasmavoid_highscore');
      if (saved) this.stats.highScore = parseInt(saved, 10) || 0;
    } catch {
      // ignore
    }

    const textureLoader = new THREE.TextureLoader();

    this.scene = new SpaceScene(container);
    this.particles = new ParticleSystem(this.scene.scene);
    this.projectiles = new ProjectileManager(this.scene.scene, textureLoader);
    this.player = new PlayerShip(this.scene.scene, textureLoader);
    this.enemy = new EnemyShip(this.scene.scene);

    // Bind event listeners for keyboard & window resize
    this.initInputListeners();

    // Start render loop
    this.startLoop();
  }

  private initInputListeners() {
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp, { passive: false });
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('blur', this.handleBlur);
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0 && this.stats.gameStarted && !this.stats.isPaused && !this.stats.isGameOver) {
      this.input.isShooting = true;
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      this.input.isShooting = false;
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    // Always prevent spacebar and arrow keys from scrolling the webpage or iframe
    if (
      e.code === 'Space' ||
      e.key === ' ' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight'
    ) {
      e.preventDefault();
    }

    if (!this.stats.gameStarted || this.stats.isGameOver) return;

    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      this.togglePause();
      return;
    }

    if (this.stats.isPaused) return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.input.moveX = -1;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.input.moveX = 1;
    }

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      this.input.moveY = 1;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      this.input.moveY = -1;
    }

    if (e.code === 'Space' || e.key === ' ') {
      this.input.isShooting = true;
    }

    if (e.key === 'Shift') {
      this.input.isBoosting = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      this.input.isShooting = false;
    }

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      if (this.input.moveX < 0) this.input.moveX = 0;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      if (this.input.moveX > 0) this.input.moveX = 0;
    }

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      if (this.input.moveY > 0) this.input.moveY = 0;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      if (this.input.moveY < 0) this.input.moveY = 0;
    }

    if (e.key === 'Shift') {
      this.input.isBoosting = false;
    }
  };

  private handleBlur = () => {
    this.input.moveX = 0;
    this.input.moveY = 0;
    this.input.isShooting = false;
    this.input.isBoosting = false;
  };

  public startGame() {
    this.stats.gameStarted = true;
    this.stats.isGameOver = false;
    this.stats.isPaused = false;
    this.stats.score = 0;
    this.stats.level = 1;
    this.stats.enemiesDestroyed = 0;
    this.stats.waveClearNotice = null;

    this.player.reset(0, -6);
    this.projectiles.clearAll();

    // Start background battle music
    sound.startMusic();

    // Spawn first enemy
    this.enemy.spawn(this.stats.level, this.particles);
    this.updateStatsObject();
  }

  public restartGame() {
    this.startGame();
  }

  public togglePause() {
    this.stats.isPaused = !this.stats.isPaused;
    if (this.stats.isPaused) {
      sound.stopMusic();
    } else {
      sound.startMusic();
    }
    this.emitStats();
  }

  private startLoop() {
    const tick = () => {
      if (this.isDestroyed) return;

      const rawDt = this.clock.getDelta();
      const delta = Math.min(rawDt, 0.05); // clamp for 60fps simulation safety

      this.update(delta);
      this.scene.render();

      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  private update(delta: number) {
    if (!this.stats.gameStarted || this.stats.isPaused) {
      // Slowly idle space even when paused or on title
      this.scene.update(delta * 0.3, 0, false);
      return;
    }

    // 1. Update Player
    if (!this.stats.isGameOver) {
      this.player.update(
        delta,
        { x: this.input.moveX, y: this.input.moveY },
        this.input.isBoosting,
        this.particles
      );

      // Player Firing
      this.playerShotCooldown -= delta;
      if (this.input.isShooting && this.playerShotCooldown <= 0) {
        this.firePlayerPlasma();
        this.playerShotCooldown = this.playerFireRate;
      }
    }

    // 2. Update Enemy
    if (this.enemy.isAlive) {
      const enemyDied = this.enemy.update(
        delta,
        this.player.position,
        this.projectiles,
        this.particles
      );

      if (enemyDied) {
        this.onEnemyDefeated();
      }
    } else if (this.enemySpawnDelay > 0) {
      this.enemySpawnDelay -= delta;
      if (this.enemySpawnDelay <= 0 && !this.stats.isGameOver) {
        this.stats.level++;
        this.enemy.spawn(this.stats.level, this.particles);
        this.stats.waveClearNotice = null;
        this.updateStatsObject();
      }
    }

    // 3. Update Projectiles & Particles
    this.projectiles.update(delta, this.particles);
    this.particles.update(delta);

    // 4. Update Space Scene
    this.scene.update(delta, this.player.position.x, this.input.isBoosting);

    // 5. Collision Checks
    if (!this.stats.isGameOver) {
      this.checkCollisions();
    }

    // 6. Wave Clear Banner Timer
    if (this.waveNoticeTimer > 0) {
      this.waveNoticeTimer -= delta;
      if (this.waveNoticeTimer <= 0) {
        this.stats.waveClearNotice = null;
        this.emitStats();
      }
    }

    this.updateStatsObject();
  }

  private firePlayerPlasma() {
    const firePoint = this.player.getFirePoint();
    this.projectiles.spawnPlayerBullet(firePoint, new THREE.Vector3(0, 1, 0));
    sound.playPlayerPlasmaShot();
  }

  private checkCollisions() {
    // 1. Player Bullets vs Enemy Ship
    if (this.enemy.isAlive && !this.enemy.isDying && !this.enemy.isEntering) {
      const enemyBox = new THREE.Box3().setFromObject(this.enemy.group);
      // Slightly expand hit test for responsive feel
      enemyBox.expandByScalar(0.4);

      for (let i = this.projectiles.playerBullets.length - 1; i >= 0; i--) {
        const bullet = this.projectiles.playerBullets[i];
        if (enemyBox.containsPoint(bullet.position)) {
          // Impact hit!
          this.scene.triggerScreenShake(0.35);
          const wasKilled = this.enemy.takeDamage(bullet.damage, this.particles);

          // Remove bullet
          this.scene.scene.remove(bullet.mesh);
          this.projectiles.playerBullets.splice(i, 1);

          if (wasKilled) {
            // Already handled via takeDamage & death sequence
            break;
          }
        }
      }
    }

    // 2. Enemy Bullets vs Player Ship
    if (!this.player.isInvulnerable) {
      const playerPos = this.player.position;
      const hitRadius = 1.3;

      for (let i = this.projectiles.enemyBullets.length - 1; i >= 0; i--) {
        const eb = this.projectiles.enemyBullets[i];
        const distSq = playerPos.distanceToSquared(eb.position);
        if (distSq < hitRadius * hitRadius) {
          // Player hit!
          sound.playPlayerHit();
          this.scene.triggerScreenShake(0.7);
          this.player.takeDamage(eb.damage);

          // Particles at player impact
          this.particles.emit(
            playerPos,
            new THREE.Vector3(0, -4, 0),
            new THREE.Color(1.0, 0.2, 0.4),
            0.8,
            0.35,
            8,
            0.5
          );

          // Remove enemy bullet
          this.scene.scene.remove(eb.mesh);
          this.projectiles.enemyBullets.splice(i, 1);

          if (this.player.health <= 0) {
            this.handlePlayerDeath();
            break;
          }
        }
      }
    }
  }

  private onEnemyDefeated() {
    this.stats.enemiesDestroyed++;
    const pointsGained = 150 * this.stats.level + Math.floor(this.player.shield * 2);
    this.stats.score += pointsGained;

    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      try {
        localStorage.setItem('plasmavoid_highscore', this.stats.highScore.toString());
      } catch {
        // ignore
      }
    }

    sound.playLevelUp();
    this.scene.triggerScreenShake(1.2);

    this.stats.waveClearNotice = `VIHOLLINEN TUHOTTU! +${pointsGained} PISTETTÄ! TASO ${this.stats.level + 1} LÄHESTYY...`;
    this.waveNoticeTimer = 2.4;
    this.enemySpawnDelay = 1.8;

    this.emitStats();
  }

  private handlePlayerDeath() {
    this.stats.isGameOver = true;
    sound.playEnemyExplosion();
    sound.stopMusic();
    this.scene.triggerScreenShake(1.8);

    // Player explosion particles
    this.particles.emit(
      this.player.position,
      new THREE.Vector3(0, 0, 0),
      new THREE.Color(1.0, 0.1, 0.8),
      1.5,
      1.0,
      40,
      1.5
    );
    this.player.group.visible = false;
    this.emitStats();
  }

  private updateStatsObject() {
    this.stats.playerHealth = Math.round(this.player.health);
    this.stats.playerShield = Math.round(this.player.shield);
    this.stats.enemyHealth = this.enemy.health;
    this.stats.enemyMaxHealth = this.enemy.maxHealth;
    this.stats.enemyName = this.enemy.config?.name || 'SOTALAIVA';
    this.emitStats();
  }

  private emitStats() {
    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }
  }

  public resize(width: number, height: number) {
    this.scene.handleResize(width, height);
  }

  public dispose() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('blur', this.handleBlur);
    sound.stopMusic();
    this.particles.dispose();
    this.scene.dispose();
  }
}
