import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { usePortfolio } from '@/contexts/PortfolioContext';

export interface ThreeSceneProps {
  className?: string;
  variant?: 'hero' | 'project' | 'minimal';
  interactive?: boolean;
  model?: string;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  variant = 'hero',
  interactive = true,
  model
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const meshRef = useRef<THREE.Mesh>();
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const { data, isPremium } = usePortfolio();

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create geometry based on variant and theme
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    const getThemeColors = () => {
      switch (data.theme) {
        case 'modern':
          return { primary: 0x00d4aa, secondary: 0xff6b6b };
        case 'minimal':
          return { primary: 0x333333, secondary: 0x888888 };
        case 'showcase':
          return { primary: 0xff6b6b, secondary: 0x4ecdc4 };
        case 'interactive-3d':
          return { primary: 0x8b5cf6, secondary: 0xf59e0b };
        default:
          return { primary: 0x00d4aa, secondary: 0xff6b6b };
      }
    };

    const colors = getThemeColors();

    switch (variant) {
      case 'hero':
        if (data.theme === 'interactive-3d' && isPremium) {
          // Complex 3D shape for premium interactive theme
          geometry = new THREE.IcosahedronGeometry(1.5, 1);
          material = new THREE.MeshPhongMaterial({
            color: colors.primary,
            shininess: 100,
            transparent: true,
            opacity: 0.8
          });
        } else {
          // Simple geometric shape for other themes
          geometry = new THREE.BoxGeometry(2, 2, 2);
          material = new THREE.MeshPhongMaterial({
            color: colors.primary,
            transparent: true,
            opacity: 0.9
          });
        }
        break;
      case 'project':
        geometry = new THREE.SphereGeometry(1, 32, 16);
        material = new THREE.MeshPhongMaterial({
          color: colors.secondary,
          wireframe: !isPremium
        });
        break;
      case 'minimal':
        geometry = new THREE.TetrahedronGeometry(1.5);
        material = new THREE.MeshBasicMaterial({
          color: colors.primary,
          wireframe: true
        });
        break;
      default:
        geometry = new THREE.BoxGeometry();
        material = new THREE.MeshPhongMaterial({ color: colors.primary });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Mouse interaction for premium users
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive || !isPremium) return;
      
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        // Basic rotation
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.01;

        // Interactive rotation for premium users
        if (interactive && isPremium) {
          meshRef.current.rotation.x += mouseY * 0.01;
          meshRef.current.rotation.y += mouseX * 0.01;
        }

        // Theme-specific animations
        if (data.theme === 'interactive-3d' && isPremium) {
          meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        }
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      geometry.dispose();
      if (material instanceof THREE.Material) {
        material.dispose();
      }
    };
  }, [data.theme, variant, interactive, isPremium]);

  return (
    <div 
      ref={mountRef} 
      className={`relative w-full h-full ${className}`}
      style={{ minHeight: '200px' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/10 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {!isPremium && variant === 'hero' && (
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground">
          Premium: Advanced 3D
        </div>
      )}
    </div>
  );
};