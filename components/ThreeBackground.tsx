import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Setup Scene ---
    const scene = new THREE.Scene();
    // Deep black fog for seamless blending
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Create Objects (The "Digital Nucleus") ---

    const atomGroup = new THREE.Group();

    // A. The Core (Dense Geometric Structure)
    const geometryCore = new THREE.IcosahedronGeometry(2, 1);
    const materialCore = new THREE.MeshBasicMaterial({ 
      color: 0x0ea5e9, // Brand Blue initially
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const coreMesh = new THREE.Mesh(geometryCore, materialCore);
    atomGroup.add(coreMesh);

    // B. The Inner Glow (Point Light representation)
    const geometryInner = new THREE.IcosahedronGeometry(1, 2);
    const materialInner = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    const innerPoints = new THREE.Points(geometryInner, materialInner);
    atomGroup.add(innerPoints);

    // C. The Electron Cloud (Floating Particles)
    const particlesCount = 1200;
    
    // FIX: Create two arrays. 
    // 1. initialPositions: The immutable "base" state of the particles.
    // 2. currentPositions: The array passed to Three.js that gets updated every frame.
    const initialPositions = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount; i++) {
      // Distribute in a sphere shell around the core
      const r = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      
      // FIX: Clamp value for acos to prevent NaN if random is exactly 0 or 1 due to float precision
      const u = 2 * Math.random() - 1;
      const phi = Math.acos(Math.max(-1, Math.min(1, u)));
      
      initialPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      initialPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      initialPositions[i*3+2] = r * Math.cos(phi);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    // Clone initial positions to create the buffer attribute
    const currentPositions = new Float32Array(initialPositions);
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x00f3ff, // Neon Cyan
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    atomGroup.add(particlesMesh);

    // D. Orbital Rings (Representing Fullstack/Cycles)
    const torusGeo = new THREE.TorusGeometry(5.5, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      transparent: true, 
      opacity: 0.3 
    });

    const ring1 = new THREE.Mesh(torusGeo, torusMat);
    const ring2 = new THREE.Mesh(torusGeo, torusMat);
    const ring3 = new THREE.Mesh(torusGeo, torusMat);

    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.y = -Math.PI / 3;

    atomGroup.add(ring1);
    atomGroup.add(ring2);
    atomGroup.add(ring3);

    scene.add(atomGroup);

    // --- 3. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // --- 4. Animation State & Physics ---
    
    let mouseX = 0;
    let mouseY = 0;
    
    let targetScroll = 0;
    let currentScroll = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.0005;
      mouseY = (event.clientY - windowHalfY) * 0.0005;
    };

    const onScroll = () => {
      targetScroll = window.scrollY;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('scroll', onScroll);

    // --- 5. The Loop ---
    
    const clock = new THREE.Clock();
    
    const colorStart = new THREE.Color(0x0ea5e9); // Blue
    const colorMid = new THREE.Color(0x8b5cf6);   // Purple
    const colorEnd = new THREE.Color(0xff0055);   // Hot Pink/Red

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth Scroll Math
      currentScroll += (targetScroll - currentScroll) * 0.05;

      const maxHeight = document.body.scrollHeight - window.innerHeight;
      
      // FIX: Safety check for division by zero or negative height
      let scrollPct = 0;
      if (maxHeight > 0) {
        scrollPct = Math.min(Math.max(currentScroll / maxHeight, 0), 1);
      }
      if (isNaN(scrollPct)) scrollPct = 0;

      // --- Dynamic Transformations ---

      // 1. Rotation
      const rotationSpeed = 0.1 + (scrollPct * 0.5); 
      atomGroup.rotation.y = elapsedTime * rotationSpeed;
      atomGroup.rotation.z = elapsedTime * (rotationSpeed * 0.5);
      
      atomGroup.rotation.x += (mouseY * 0.5 - atomGroup.rotation.x) * 0.05;
      atomGroup.rotation.y += (mouseX * 0.5 - atomGroup.rotation.y) * 0.05;

      // 2. Expansion
      let scale = 1;
      if (scrollPct < 0.5) {
         scale = 1 + scrollPct; 
      } else {
         scale = 1.5 + (scrollPct - 0.5); 
      }
      // FIX: Prevent NaN scale
      if (!isNaN(scale)) {
        atomGroup.scale.setScalar(scale);
      }

      // 3. Particle Excitement
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for(let i = 0; i < particlesCount; i++) {
         const i3 = i * 3;
         
         // FIX: Read from initialPositions (base state), write to positions (render state)
         // This prevents the feedback loop where errors accumulated over time.
         const originalY = initialPositions[i3+1]; 
         const baseNoise = initialPositions[i3];
         
         const wave = Math.sin(elapsedTime + baseNoise * 5) * (0.05 + scrollPct * 0.2);
         positions[i3+1] = originalY + wave;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // 4. Color Morphing
      let activeColor = new THREE.Color();
      if (scrollPct < 0.5) {
        activeColor.lerpColors(colorStart, colorMid, scrollPct * 2); 
      } else {
        activeColor.lerpColors(colorMid, colorEnd, (scrollPct - 0.5) * 2);
      }

      (coreMesh.material as THREE.MeshBasicMaterial).color = activeColor;
      (particlesMesh.material as THREE.PointsMaterial).color = activeColor;
      
      (ring1.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(elapsedTime) * 0.1;
      
      // 5. Camera Movement
      const targetCameraZ = 10 - (scrollPct * 7); 
      if (!isNaN(targetCameraZ)) {
        camera.position.z = targetCameraZ;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    tick();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Proper Three.js cleanup
      geometryCore.dispose();
      materialCore.dispose();
      geometryInner.dispose();
      materialInner.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ 
        // Fallback gradient if WebGL fails or loads slow
        background: 'radial-gradient(circle at center, #0f172a 0%, #000000 100%)',
      }}
    />
  );
};

export default ThreeBackground;