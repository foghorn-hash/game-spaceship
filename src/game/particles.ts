import * as THREE from 'three';

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  initialSize: number;
  life: number;
  maxLife: number;
  decay: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles = 600;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;

  // Expanding shockwave rings pool
  private shockwaves: { mesh: THREE.Mesh; scale: number; maxScale: number; alpha: number; speed: number }[] = [];
  private shockwaveGroup = new THREE.Group();

  constructor(scene: THREE.Scene) {
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.sizes = new Float32Array(this.maxParticles);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    // Circular particle texture created procedurally via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    this.material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
    scene.add(this.shockwaveGroup);
  }

  public emit(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    color: THREE.Color,
    size: number,
    life: number,
    count: number = 1,
    spread: number = 0.2
  ) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift(); // Evict oldest
      }

      const pVel = vel.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread
        )
      );

      this.particles.push({
        position: pos.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * spread * 0.5,
            (Math.random() - 0.5) * spread * 0.5,
            (Math.random() - 0.5) * spread * 0.5
          )
        ),
        velocity: pVel,
        color: color.clone(),
        size,
        initialSize: size,
        life,
        maxLife: life,
        decay: 1 / life,
      });
    }
  }

  /**
   * Exploding 3D shockwave ring (expanding torus or ring)
   */
  public emitShockwave(pos: THREE.Vector3, color: number, maxScale = 12) {
    const ringGeo = new THREE.RingGeometry(0.8, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(ringGeo, ringMat);
    mesh.position.copy(pos);
    mesh.rotation.x = Math.PI / 2;
    this.shockwaveGroup.add(mesh);

    this.shockwaves.push({
      mesh,
      scale: 0.2,
      maxScale,
      alpha: 1.0,
      speed: 18,
    });
  }

  public update(delta: number) {
    // Update points
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.position.addScaledVector(p.velocity, delta);
      // Soft drag
      p.velocity.multiplyScalar(Math.pow(0.96, delta * 60));
      // Fade out size
      const progress = p.life / p.maxLife;
      p.size = p.initialSize * progress;
    }

    // Write to buffer
    const count = this.particles.length;
    for (let i = 0; i < this.maxParticles; i++) {
      const idx3 = i * 3;
      if (i < count) {
        const p = this.particles[i];
        this.positions[idx3] = p.position.x;
        this.positions[idx3 + 1] = p.position.y;
        this.positions[idx3 + 2] = p.position.z;

        const progress = p.life / p.maxLife;
        this.colors[idx3] = p.color.r * progress;
        this.colors[idx3 + 1] = p.color.g * progress;
        this.colors[idx3 + 2] = p.color.b * progress;

        this.sizes[i] = p.size;
      } else {
        this.sizes[i] = 0;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.scale += sw.speed * delta;
      sw.alpha = Math.max(0, 1 - sw.scale / sw.maxScale);

      sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
      (sw.mesh.material as THREE.MeshBasicMaterial).opacity = sw.alpha * 0.8;

      if (sw.alpha <= 0.01 || sw.scale >= sw.maxScale) {
        this.shockwaveGroup.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        (sw.mesh.material as THREE.Material).dispose();
        this.shockwaves.splice(i, 1);
      }
    }
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.shockwaves.forEach(sw => {
      this.shockwaveGroup.remove(sw.mesh);
      sw.mesh.geometry.dispose();
      (sw.mesh.material as THREE.Material).dispose();
    });
    this.shockwaves = [];
  }
}
