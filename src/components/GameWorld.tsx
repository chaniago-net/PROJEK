import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Environment, Float, Text, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Buildings, BUILDINGS_DATA } from '../types/game';

interface GameWorldProps {
  buildings: Buildings;
  onSelectBuilding?: (id: string) => void;
}

// Simple NPC Component
const Citizen: React.FC<{ startPos: [number, number, number] }> = ({ startPos }) => {
  const meshRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const targetRef = useRef(new THREE.Vector3(
    startPos[0] + (Math.random() - 0.5) * 10,
    0.2,
    startPos[2] + (Math.random() - 0.5) * 10
  ));
  const skinColor = useMemo(() => ["#f5d5c0", "#e0ac69", "#8d5524", "#c68642"][Math.floor(Math.random() * 4)], []);
  const robeColor = useMemo(() => ["#ffffff", "#f5f5f5", "#e0e0e0", "#f9fbe7", "#e8eaf6"][Math.floor(Math.random() * 5)], []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Move towards target
    const current = meshRef.current.position;
    const direction = targetRef.current.clone().sub(current).normalize().multiplyScalar(0.02);
    current.add(direction);

    // Look at target
    meshRef.current.lookAt(targetRef.current.x, meshRef.current.position.y, targetRef.current.z);

    // If close to target, pick a new one
    if (current.distanceTo(targetRef.current) < 0.1) {
      targetRef.current.set(
        (Math.random() - 0.5) * 20,
        0.2,
        (Math.random() - 0.5) * 20
      );
    }

    // Walking animation
    const time = state.clock.elapsedTime * 8;
    const bounce = Math.sin(time) * 0.05;
    meshRef.current.position.y = 0.2 + bounce;

    // Swing arms and legs
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time) * 0.5;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(time) * 0.5;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(time) * 0.5;
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(time) * 0.5;
  });

  return (
    <group ref={meshRef} position={startPos}>
      {/* Body / Robe */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
        <meshStandardMaterial color={robeColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Eyes */}
      {[[-0.04, 0.92, 0.1], [0.04, 0.92, 0.1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
      ))}

      {/* Kufi / Kopiah */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.18, 0.6, 0]} rotation={[0, 0, 0.1]}>
        <group position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.03, 0.3, 4, 8]} />
          <meshStandardMaterial color={robeColor} />
        </group>
      </mesh>
      <mesh ref={rightArmRef} position={[0.18, 0.6, 0]} rotation={[0, 0, -0.1]}>
        <group position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.03, 0.3, 4, 8]} />
          <meshStandardMaterial color={robeColor} />
        </group>
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.07, 0.2, 0]}>
        <group position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
          <meshStandardMaterial color={robeColor} />
        </group>
      </mesh>
      <mesh ref={rightLegRef} position={[0.07, 0.2, 0]}>
        <group position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
          <meshStandardMaterial color={robeColor} />
        </group>
      </mesh>
    </group>
  );
};

// Simple Palm Tree Component
const PalmTree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 2, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <mesh position={[0.4, 1.8, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.8, 0.02, 0.2]} />
            <meshStandardMaterial color="#2e7d32" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Flower Component
const Flower: React.FC<{ position: [number, number, number], color: string }> = ({ position, color }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 5]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

// Fence Component
const Fence: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.05, 0.05]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2, 0.05, 0.05]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.05]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
      ))}
    </group>
  );
};

// Street Lamp Component
const StreetLamp: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fff176" emissive="#fff176" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.3, 0.2, 16]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
    </group>
  );
};

// Mountain Component
const Mountain: React.FC<{ position: [number, number, number], scale: [number, number, number], color: string }> = ({ position, scale, color }) => {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
};

// Simple Bridge Component
const Bridge: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[4, 0.3, 3]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.2, 0.6, 3]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
      ))}
    </group>
  );
};

// Filler House Component
const DecorHouse: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#efebe9" />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.8, 0.5, 4]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
    </group>
  );
};

const BuildingModel: React.FC<{
  type: string;
  level: number;
  position: [number, number, number];
  onSelect?: (type: string) => void;
}> = ({ type, level, position, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);

  const scale = (1 + Math.max(0, level - 1) * 0.05) * (hovered ? 1.05 : 1);

  const getBuildingUI = () => {
    if (level === 0) {
      return (
        <group>
          {/* Foundation Plate */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[2, 0.1, 2]} />
            <meshStandardMaterial color="#b0bec5" transparent opacity={0.4} />
          </mesh>
          {/* Corner Posts */}
          {[[-0.9, 0.4, -0.9], [0.9, 0.4, -0.9], [-0.9, 0.4, 0.9], [0.9, 0.4, 0.9]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} castShadow>
              <boxGeometry args={[0.05, 0.8, 0.05]} />
              <meshStandardMaterial color="#8d6e63" transparent opacity={0.5} />
            </mesh>
          ))}
          {/* Construction Sign */}
          <mesh position={[0, 0.3, 1.1]} rotation={[0, 0, 0]}>
             <boxGeometry args={[0.8, 0.4, 0.05]} />
             <meshStandardMaterial color="#fdd835" transparent opacity={0.8} />
          </mesh>
        </group>
      );
    }

    switch (type) {
      case 'masjid':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1.4, 0.8, 1.4]} />
              <meshStandardMaterial color="#2e7d32" />
            </mesh>
            {/* Arched Entrance */}
            <mesh position={[0, 0.4, 0.7]} castShadow>
              <boxGeometry args={[0.5, 0.6, 0.1]} />
              <meshStandardMaterial color="#1b5e20" />
            </mesh>
            {/* Top Base */}
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[1, 0.2, 1]} />
              <meshStandardMaterial color="#f5f2ed" />
            </mesh>
            {/* Main Dome */}
            <mesh position={[0, 1.1, 0]} castShadow>
              <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#c5a059" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Small corner minarets */}
            {[[-0.6, 0, -0.6], [0.6, 0, -0.6], [-0.6, 0, 0.6], [0.6, 0, 0.6]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.6, pos[2]]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 1.2, 8]} />
                <meshStandardMaterial color="#f5f2ed" />
              </mesh>
            ))}
          </group>
        );
      case 'masjidRaya':
        return (
          <group>
            {/* Multi-layered Base */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[2.5, 0.6, 2.5]} />
              <meshStandardMaterial color="#1b5e20" />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[1.8, 0.4, 1.8]} />
              <meshStandardMaterial color="#2e7d32" />
            </mesh>
            {/* Main Grand Dome */}
            <mesh position={[0, 1.3, 0]} castShadow>
              <sphereGeometry args={[0.9, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* 4 Minarets at corners */}
            {[[-1.5, 0, -1.5], [1.5, 0, -1.5], [-1.5, 0, 1.5], [1.5, 0, 1.5]].map((pos, i) => (
              <group key={i} position={[pos[0], 1.5, pos[2]]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.15, 0.2, 3, 16]} />
                  <meshStandardMaterial color="#f5f2ed" />
                </mesh>
                <mesh position={[0, 1.5, 0]} castShadow>
                  <sphereGeometry args={[0.18, 16, 8]} />
                  <meshStandardMaterial color="#d4af37" />
                </mesh>
              </group>
            ))}
          </group>
        );
      case 'madrasah':
        return (
          <group>
            {/* U-Shaped Courtyard Layout */}
            <mesh position={[-0.5, 0.5, 0]} castShadow>
              <boxGeometry args={[0.5, 1, 1.5]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
            <mesh position={[0.5, 0.5, 0]} castShadow>
              <boxGeometry args={[0.5, 1, 1.5]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
            <mesh position={[0, 0.5, -0.5]} castShadow>
              <boxGeometry args={[1.5, 1, 0.5]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
            {/* Slanted Roofs */}
            <mesh position={[-0.5, 1.1, 0]} rotation={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.6, 0.2, 1.7]} />
              <meshStandardMaterial color="#4e342e" />
            </mesh>
            <mesh position={[0.5, 1.1, 0]} castShadow>
              <boxGeometry args={[0.6, 0.2, 1.7]} />
              <meshStandardMaterial color="#4e342e" />
            </mesh>
            <mesh position={[0, 1.1, -0.5]} castShadow>
              <boxGeometry args={[1.7, 0.2, 0.6]} />
              <meshStandardMaterial color="#4e342e" />
            </mesh>
          </group>
        );
      case 'baitulMal':
        return (
          <group>
            {/* Stone Stronghouse */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.2, 1, 1]} />
              <meshStandardMaterial color="#78909c" />
            </mesh>
            <mesh position={[0, 1.1, 0]} castShadow>
              <boxGeometry args={[1.4, 0.2, 1.2]} />
              <meshStandardMaterial color="#455a64" />
            </mesh>
            {/* Pillars */}
            {[[-0.5, 0.5, 0.45], [0.5, 0.5, 0.45]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.5, pos[2]]}>
                <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
                <meshStandardMaterial color="#b0bec5" />
              </mesh>
            ))}
          </group>
        );
      case 'perpustakaan':
        return (
          <group>
            {/* Grand Archive - Circular/Hexagonal Base */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[1, 1.2, 1.4, 8]} />
              <meshStandardMaterial color="#afb42b" />
            </mesh>
            {/* Second Tier */}
            <mesh position={[0, 1.6, 0]} castShadow>
              <cylinderGeometry args={[0.8, 0.8, 0.6, 8]} />
              <meshStandardMaterial color="#c0ca33" />
            </mesh>
            {/* Top Dome */}
            <mesh position={[0, 2.0, 0]} castShadow>
              <sphereGeometry args={[0.7, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#827717" />
            </mesh>
          </group>
        );
      case 'rumahSakit':
        return (
          <group>
            {/* Modern Hospital Wings */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshStandardMaterial color="#eceff1" />
            </mesh>
            <mesh position={[-0.8, 0.4, 0]} castShadow>
              <boxGeometry args={[0.6, 0.8, 1]} />
              <meshStandardMaterial color="#f0f4f8" />
            </mesh>
            <mesh position={[0.8, 0.4, 0]} castShadow>
              <boxGeometry args={[0.6, 0.8, 1]} />
              <meshStandardMaterial color="#f0f4f8" />
            </mesh>
            {/* Medical Symbols on 3 sides */}
            {[ [0, 0.8, 0.61], [0.61, 0.8, 0], [-0.61, 0.8, 0] ].map((pos, i) => (
               <group key={i} position={[pos[0], pos[1], pos[2]]} rotation={[0, i === 0 ? 0 : Math.PI / 2, 0]}>
                  <mesh>
                    <boxGeometry args={[0.1, 0.4, 0.02]} />
                    <meshStandardMaterial color="#d32f2f" />
                  </mesh>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.1, 0.4, 0.02]} />
                    <meshStandardMaterial color="#d32f2f" />
                  </mesh>
               </group>
            ))}
          </group>
        );
      case 'pesantren':
        return (
          <group>
            {/* Tiered Indonesian/SE Asian Roof style */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1.5, 0.8, 1.5]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[1.7, 0.2, 1.7]} />
              <meshStandardMaterial color="#5d4037" />
            </mesh>
            {/* Tiered Pyramid Roof */}
            <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.2, 0.8, 4]} />
              <meshStandardMaterial color="#3e2723" />
            </mesh>
            <mesh position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[0.7, 0.6, 4]} />
              <meshStandardMaterial color="#212121" />
            </mesh>
          </group>
        );
      case 'menaraAdzan':
        return (
          <group>
            {/* Tiered Tower */}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[0.6, 2, 0.6]} />
              <meshStandardMaterial color="#f5f2ed" />
            </mesh>
            {/* Balcony */}
            <mesh position={[0, 2.1, 0]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.8]} />
              <meshStandardMaterial color="#5d4037" />
            </mesh>
            {/* Tower Upper */}
            <mesh position={[0, 3.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
              <meshStandardMaterial color="#f5f2ed" />
            </mesh>
            {/* Small Dome Top */}
            <mesh position={[0, 4.3, 0]} castShadow>
              <sphereGeometry args={[0.25, 16, 8]} />
              <meshStandardMaterial color="#d4af37" />
            </mesh>
          </group>
        );
      case 'pasarSyariah':
        return (
          <group>
            {/* Market Square Platform */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
              <boxGeometry args={[3, 0.2, 3]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
            {/* Multiple Stalls */}
            {[[-1, 0.5, -1], [1, 0.5, -1], [-1, 0.5, 1], [1, 0.5, 1]].map((pos, i) => (
              <group key={i} position={pos as [number, number, number]}>
                <mesh castShadow>
                  <boxGeometry args={[0.7, 0.8, 0.7]} />
                  <meshStandardMaterial color="#f5f2ed" />
                </mesh>
                <mesh position={[0, 0.45, 0]} castShadow>
                  <boxGeometry args={[0.9, 0.1, 0.9]} />
                  <meshStandardMaterial color={['#d32f2f', '#1976d2', '#388e3c', '#fbc02d'][i]} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case 'tamanKota':
        return (
          <group>
            {/* Lush Circular Garden */}
            <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
              <circleGeometry args={[2.5, 32]} />
              <meshStandardMaterial color="#4caf50" />
            </mesh>
            {/* Fountain in center */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
              <meshStandardMaterial color="#78909c" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
               <sphereGeometry args={[0.3, 16, 16]} />
               <meshStandardMaterial color="#03a9f4" transparent opacity={0.6} />
            </mesh>
            {/* Trees / Flowers */}
            {[[-1.2, 0, 0], [1.2, 0, 0], [0, 0, 1.2], [0, 0, -1.2], [1, 0, 1], [-1, 0, -1]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.4 + Math.random() * 0.2, pos[1]]} castShadow>
                <sphereGeometry args={[0.35 + Math.random() * 0.15, 8, 8]} />
                <meshStandardMaterial color={i % 2 === 0 ? "#1b5e20" : "#d32f2f"} />
              </mesh>
            ))}
          </group>
        );
      case 'gerbangKota':
        return (
          <group>
            {/* Large Defensive Archway */}
            <mesh position={[-1.6, 1.5, 0]} castShadow>
              <boxGeometry args={[0.8, 3, 1.2]} />
              <meshStandardMaterial color="#757575" />
            </mesh>
            <mesh position={[1.6, 1.5, 0]} castShadow>
              <boxGeometry args={[0.8, 3, 1.2]} />
              <meshStandardMaterial color="#757575" />
            </mesh>
            <mesh position={[0, 3.2, 0]} castShadow>
              <boxGeometry args={[4, 0.6, 1.4]} />
              <meshStandardMaterial color="#616161" />
            </mesh>
            {/* Battlements (Merlons) */}
            {[-1.5, -0.75, 0, 0.75, 1.5].map((x, i) => (
              <mesh key={i} position={[x, 3.7, 0]} castShadow>
                <boxGeometry args={[0.3, 0.4, 1.4]} />
                <meshStandardMaterial color="#424242" />
              </mesh>
            ))}
          </group>
        );
      case 'bentengPertahanan':
        return (
          <group>
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[3, 3, 3]} />
              <meshStandardMaterial color="#455a64" />
            </mesh>
            {[[-1.5, 3, -1.5], [1.5, 3, -1.5], [-1.5, 3, 1.5], [1.5, 3, 1.5]].map((pos, i) => (
              <mesh key={i} position={[pos[0], pos[1] + 0.5, pos[2]]} castShadow>
                <boxGeometry args={[0.8, 1, 0.8]} />
                <meshStandardMaterial color="#37474f" />
              </mesh>
            ))}
          </group>
        );
      case 'universitas':
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[3, 1, 2]} />
              <meshStandardMaterial color="#f5f2ed" />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[2, 1, 1.5]} />
              <meshStandardMaterial color="#f5f2ed" />
            </mesh>
            <mesh position={[0, 2.2, 0]} castShadow>
              <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#2e7d32" />
            </mesh>
            {/* Minarets */}
            {[[-1.2, 0, 0.8], [1.2, 0, 0.8]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 2, pos[1]]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 4, 12]} />
                <meshStandardMaterial color="#f5f2ed" />
              </mesh>
            ))}
          </group>
        );
      case 'observatorium':
        return (
          <group>
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.8, 1, 2, 16]} />
              <meshStandardMaterial color="#546e7a" />
            </mesh>
            <mesh position={[0, 2, 0]} castShadow>
              <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#cfd8dc" />
            </mesh>
            <mesh position={[0, 2.3, 0]} rotation={[0.4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
              <meshStandardMaterial color="#263238" />
            </mesh>
          </group>
        );
      case 'bazaarBesar':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} receiveShadow>
              <boxGeometry args={[4, 0.2, 4]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
            {/* Tents */}
            {[[-1, 0.5, -1], [1, 0.5, -1], [-1, 0.5, 1], [1, 0.5, 1], [0, 0.5, 0]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.6, pos[2]]} castShadow>
                <coneGeometry args={[0.8, 1, 4]} />
                <meshStandardMaterial color={['#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa'][i]} />
              </mesh>
            ))}
          </group>
        );
      case 'irigasiPertanian':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[5, 0.1, 3]} />
              <meshStandardMaterial color="#4caf50" />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.5, 0.05, 3]} />
              <meshStandardMaterial color="#03a9f4" />
            </mesh>
            {/* Rotating Wheels */}
            {[[-1.5, 0.5, 0], [1.5, 0.5, 0]].map((pos, i) => (
              <group key={i} position={pos as [number, number, number]}>
                <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.6, 0.6, 0.2, 12]} />
                  <meshStandardMaterial color="#5d4037" />
                </mesh>
              </group>
            ))}
          </group>
        );
      case 'klinikHerbal':
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.5, 1, 1.2]} />
              <meshStandardMaterial color="#f1f8e9" />
            </mesh>
            <mesh position={[0, 1.1, 0]} castShadow>
              <boxGeometry args={[1.7, 0.2, 1.4]} />
              <meshStandardMaterial color="#33691e" />
            </mesh>
            <mesh position={[0, 1.3, 0]} castShadow>
               <boxGeometry args={[0.1, 0.4, 0.4]} />
               <meshStandardMaterial color="#d32f2f" />
            </mesh>
          </group>
        );
      case 'wismaMusafir':
        return (
          <group>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[2, 1.6, 2]} />
              <meshStandardMaterial color="#efebe9" />
            </mesh>
            <mesh position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.7, 0.8, 4]} />
              <meshStandardMaterial color="#5d4037" />
            </mesh>
          </group>
        );
      case 'pusatSeni':
        return (
          <group>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[2.5, 1.2, 1.5]} />
              <meshStandardMaterial color="#fffde7" />
            </mesh>
            <mesh position={[0, 1.3, 0]} castShadow>
              <boxGeometry args={[1.5, 0.4, 0.8]} />
              <meshStandardMaterial color="#fdd835" />
            </mesh>
            {/* Arched Window detail */}
            {[[-0.8, 0.6, 0.76], [0.8, 0.6, 0.76]].map((pos, i) => (
              <mesh key={i} position={[pos[0], pos[1], pos[2]]} rotation={[Math.PI / 2, 0, 0]}>
                <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#8d6e63" />
              </mesh>
            ))}
          </group>
        );
      case 'lapanganPanahan':
        return (
          <group>
            {/* Sand Field */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[4, 0.1, 6]} />
              <meshStandardMaterial color="#d2b48c" />
            </mesh>
            {/* Targets */}
            {[-1, 1].map((x, i) => (
              <group key={i} position={[x, 0.6, -2]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                  <meshStandardMaterial color="white" />
                </mesh>
                <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
                  <meshStandardMaterial color="red" />
                </mesh>
              </group>
            ))}
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <Float 
      speed={hovered ? 4 : 1.5} 
      rotationIntensity={hovered ? 0.5 : 0.1} 
      floatIntensity={hovered ? 0.5 : 0.2} 
      position={position}
    >
      <group 
        ref={meshRef}
        scale={[scale, scale, scale]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(type);
        }}
      >
        {getBuildingUI()}
        <Text
          position={[0, 2.8 + level * 0.05, 0]}
          fontSize={hovered ? 0.35 : 0.25}
          color={hovered ? "#00c853" : "#1b5e20"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          {BUILDINGS_DATA[type]?.name || type}
        </Text>
        {hovered && (
          <Html position={[0, 2.5 + level * 0.1, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl border border-slate-200 pointer-events-none whitespace-nowrap min-w-[140px] flex flex-col gap-2">
              <div className="flex items-center justify-between gap-6">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                  {BUILDINGS_DATA[type]?.name}
                </p>
                <span className="text-[9px] bg-islamic-gold/10 text-islamic-gold px-1.5 py-0.5 rounded font-black">
                  LVL {level}
                </span>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex items-center justify-between gap-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Produksi</p>
                <p className="text-[10px] font-bold text-emerald-600">
                  +{BUILDINGS_DATA[type].production * level} {BUILDINGS_DATA[type].resource}/jam
                </p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

const Scene: React.FC<{ buildings: Buildings; onSelectBuilding: (id: string) => void }> = ({ buildings, onSelectBuilding }) => {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.05;
    if (sunRef.current) {
      sunRef.current.position.x = Math.cos(time) * 20;
      sunRef.current.position.y = Math.sin(time) * 20;
      sunRef.current.position.z = Math.sin(time) * 10;
    }
  });

  const citizens = useMemo(() => Array.from({ length: 25 }).map((_, i) => (
    <Citizen key={i} startPos={[(Math.random() - 0.5) * 25, 0.2, (Math.random() - 0.5) * 25]} />
  )), []);

  const decorativePalms = useMemo(() => {
    const items = [];
    // Tidy rows along the vertical road
    for (let z = -40; z <= 40; z += 5) {
      if (Math.abs(z) < 3) continue;
      items.push(<PalmTree key={`p-v1-${z}`} position={[2.8, 0, z]} />);
      items.push(<PalmTree key={`p-v2-${z}`} position={[-2.8, 0, z]} />);
      
      // Outer rows for more density in lush areas
      if (z > 5 && z < 25) {
        items.push(<PalmTree key={`p-v3-${z}`} position={[6, 0, z]} />);
        items.push(<PalmTree key={`p-v4-${z}`} position={[-6, 0, z]} />);
      }
    }
    // Tidy rows along the horizontal road
    for (let x = -40; x <= 40; x += 5) {
      if (Math.abs(x) < 3) continue;
      items.push(<PalmTree key={`p-h1-${x}`} position={[x, 0, 2.8]} />);
      items.push(<PalmTree key={`p-h2-${x}`} position={[x, 0, -2.8]} />);
    }
    return items;
  }, []);

  const mountains = useMemo(() => [
    { pos: [-40, 0, -50], scale: [20, 25, 20], col: "#d2b48c" },
    { pos: [40, 0, -50], scale: [25, 30, 25], col: "#c2a47c" },
    { pos: [0, 0, -60], scale: [30, 15, 30], col: "#e2c49c" },
    { pos: [-60, 0, -30], scale: [15, 20, 15], col: "#d2b48c" },
    { pos: [60, 0, -30], scale: [18, 22, 18], col: "#c2a47c" },
    { pos: [-20, 0, -45], scale: [12, 18, 12], col: "#b2946c" },
    { pos: [20, 0, -45], scale: [10, 15, 10], col: "#b2946c" },
  ].map((m, i) => (
    <Mountain key={`mtn-${i}`} position={m.pos as any} scale={m.scale as any} color={m.col} />
  )), []);

  const grassPatches = useMemo(() => {
    return [];
  }, []);

  const sandDunes = useMemo(() => {
    const dunes = [];
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      
      // Keep dunes away from city center (30 unit radius)
      if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;
      
      dunes.push(
        <mesh 
          key={`dune-${i}`} 
          position={[x, -0.1, z]} 
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <sphereGeometry args={[1 + Math.random() * 5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d2b48c" roughness={1} />
        </mesh>
      );
    }
    return dunes;
  }, []);

  const roads = useMemo(() => {
    const items = [];
    // Vertical Main Road
    items.push(
      <mesh key="rd-v-main" rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[3.5, 300]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
    );
    // Horizontal Main Road
    items.push(
      <mesh key="rd-h-main" rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[300, 3.5]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
    );

    // Branching Roads
    const branchPoints = [
      { x: 10, z: 0, w: 2.5, l: 30, rot: 0 },         // To East Economic Zone
      { x: -10, z: 0, w: 2.5, l: 30, rot: 0 },        // To West Education Zone
      { x: 0, z: 12, w: 30, l: 2.5, rot: 0 },         // South defense perimeter
      { x: -12, z: -10, w: 20, l: 2, rot: Math.PI / 4 }, // Diagonal branch
    ];

    branchPoints.forEach((p, i) => {
      items.push(
        <mesh 
          key={`br-${i}`} 
          rotation={[-Math.PI / 2, 0, p.rot]} 
          position={[p.x, 0.049, p.z]} 
          receiveShadow
        >
          <planeGeometry args={[p.w, p.l]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
      );
    });

    return items;
  }, []);

  const landscapes = useMemo(() => {
    return (
      <group>
        {sandDunes}
        {roads}
      </group>
    );
  }, [sandDunes, roads]);

  const fences = useMemo(() => {
    const items = [];
    const offset = 2.2; 
    
    // Main crossroad fences (Main Vertical & Horizontal Roads)
    for (let i = -30; i <= 30; i += 2) {
      // Create gaps at intersection and branch starts
      if (Math.abs(i) < 2.5 || (i > 8 && i < 12) || (i < -8 && i > -12)) continue;
      
      // Along vertical main road
      items.push(<Fence key={`f-v-l-${i}`} position={[offset, 0, i]} rotation={[0, Math.PI / 2, 0]} />);
      items.push(<Fence key={`f-v-r-${i}`} position={[-offset, 0, i]} rotation={[0, Math.PI / 2, 0]} />);
      // Along horizontal main road
      items.push(<Fence key={`f-h-t-${i}`} position={[i, 0, offset]} rotation={[0, 0, 0]} />);
      items.push(<Fence key={`f-h-b-${i}`} position={[i, 0, -offset]} rotation={[0, 0, 0]} />);
    }
    
    // East Branch Fences (Economic Zone)
    for (let i = 10; i < 25; i += 2) {
      items.push(<Fence key={`f-be-t-${i}`} position={[i, 0, 1.6]} rotation={[0, 0, 0]} />);
      items.push(<Fence key={`f-be-b-${i}`} position={[i, 0, -1.6]} rotation={[0, 0, 0]} />);
    }

    // West Branch Fences (Education Zone)
    for (let i = -10; i > -25; i -= 2) {
      items.push(<Fence key={`f-bw-t-${i}`} position={[i, 0, 1.6]} rotation={[0, 0, 0]} />);
      items.push(<Fence key={`f-bw-b-${i}`} position={[i, 0, -1.6]} rotation={[0, 0, 0]} />);
    }

    // South Branch Fences
    for (let i = -15; i <= 15; i += 2) {
      if (Math.abs(i) < 2) continue;
      items.push(<Fence key={`f-bs-t-${i}`} position={[i, 0, 13.5]} rotation={[0, 0, 0]} />);
      items.push(<Fence key={`f-bs-b-${i}`} position={[i, 0, 10.8]} rotation={[0, 0, 0]} />);
    }

    // Oasis River perimeter fences (partial)
    for (let z = -30; z <= 30; z += 2.5) {
      // Gaps at bridges
      if (Math.abs(z) < 2 || Math.abs(z - 20) < 2 || Math.abs(z + 20) < 2) continue;
      items.push(<Fence key={`f-o-l-${z}`} position={[19.5, 0, z]} rotation={[0, Math.PI / 2, 0]} />);
      items.push(<Fence key={`f-o-r-${z}`} position={[32.5, 0, z]} rotation={[0, Math.PI / 2, 0]} />);
    }

    return items;
  }, []);

  const streetLamps = useMemo(() => [
    [2, 0, 2], [-2, 0, 2], [2, 0, -2], [-2, 0, -2],
    [8, 0, 1.5], [-8, 0, 1.5], [1.5, 0, 8], [1.5, 0, -8]
  ].map((pos, i) => (
    <StreetLamp key={`lamp-${i}`} position={pos as [number, number, number]} />
  )), []);

  const flowerBeds = useMemo(() => {
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#ffeb3b", "#ff9800"];
    return Array.from({ length: 40 }).map((_, i) => (
      <Flower 
        key={`flower-${i}`} 
        position={[(Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30]} 
        color={colors[i % colors.length]} 
      />
    ));
  }, []);

  const decorHouses = useMemo(() => {
    const items = [];
    const quadrants = [
      { x: [5, 18], z: [-18, -5] },      // North East
      { x: [-18, -5], z: [-18, -5] },    // North West
      { x: [5, 18], z: [5, 18] },        // South East
      { x: [-18, -5], z: [5, 18] },      // South West
      { x: [-20, 20], z: [-28, -20] },   // Far North (near Fort)
      { x: [-25, -20], z: [-10, 10] },   // West Outskirts
    ];
    quadrants.forEach((q, qi) => {
      const houseCount = qi === 4 ? 8 : 5; // More houses in the far north
      for (let i = 0; i < houseCount; i++) {
        const x = q.x[0] + Math.random() * (q.x[1] - q.x[0]);
        const z = q.z[0] + Math.random() * (q.z[1] - q.z[0]);
        items.push(<DecorHouse key={`dh-${qi}-${i}`} position={[x, 0, z]} rotation={[0, Math.random() * Math.PI, 0]} />);
      }
    });
    return items;
  }, []);

  return (
    <>
      <Sky sunPosition={[10, 10, 10]} turbidity={0.1} rayleigh={2} inclination={0.6} azimuth={0.25} />
      <ambientLight intensity={0.8} />
      <directionalLight
        ref={sunRef}
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Ground Layers - Infinite Desert Sands */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Landscapes (Sands, Roads) */}
      {landscapes}

      {/* Blue Oasis River */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0.01, 0]} receiveShadow>
        <planeGeometry args={[12, 300]} />
        <meshStandardMaterial color="#0091ea" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0.005, 0]} receiveShadow>
        <planeGeometry args={[16, 300]} />
        <meshStandardMaterial color="#81c784" transparent opacity={0.3} />
      </mesh>
      
      {/* City Green Zone (Grass) - Removed large circle as it was distracting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#81c784" transparent opacity={0.05} />
      </mesh>

      {/* Bridges over Oasis River */}
      <Bridge position={[26, 0.051, 0]} rotation={[0, 0, 0]} />
      <Bridge position={[26, 0.051, 20]} rotation={[0, 0, 0]} />
      <Bridge position={[26, 0.051, -20]} rotation={[0, 0, 0]} />

      {/* Render Buildings */}
      <Suspense fallback={null}>
        {/* Northwest Quadrant: Education & Science (x < -4, z < -4) */}
        <BuildingModel type="madrasah" level={buildings.madrasah} position={[-6, 0, -6]} onSelect={onSelectBuilding} />
        <BuildingModel type="perpustakaan" level={buildings.perpustakaan} position={[-11, 0, -6]} onSelect={onSelectBuilding} />
        <BuildingModel type="universitas" level={buildings.universitas} position={[-17, 0, -8]} onSelect={onSelectBuilding} />
        <BuildingModel type="observatorium" level={buildings.observatorium} position={[-12, 0, -12]} onSelect={onSelectBuilding} />
        <BuildingModel type="pusatSeni" level={buildings.pusatSeni || 0} position={[-7, 0, -11]} onSelect={onSelectBuilding} />
        
        {/* Northeast Quadrant: Economic (x > 4, z < -4) */}
        <BuildingModel type="baitulMal" level={buildings.baitulMal} position={[6, 0, -6]} onSelect={onSelectBuilding} />
        <BuildingModel type="pasarSyariah" level={buildings.pasarSyariah} position={[12, 0, -6]} onSelect={onSelectBuilding} />
        <BuildingModel type="bazaarBesar" level={buildings.bazaarBesar} position={[18, 0, -8]} onSelect={onSelectBuilding} />
        <BuildingModel type="irigasiPertanian" level={buildings.irigasiPertanian} position={[15, 0, -16]} onSelect={onSelectBuilding} />
        
        {/* Southwest Quadrant: Religious & Spiritual (x < -4, z > 4) */}
        <BuildingModel type="masjid" level={buildings.masjid} position={[-6, 0, 6]} onSelect={onSelectBuilding} />
        <BuildingModel type="masjidRaya" level={buildings.masjidRaya} position={[-14, 0, 8]} onSelect={onSelectBuilding} />
        <BuildingModel type="menaraAdzan" level={buildings.menaraAdzan} position={[-6, 0, 11]} onSelect={onSelectBuilding} />
        <BuildingModel type="pesantren" level={buildings.pesantren} position={[-14, 0, 16]} onSelect={onSelectBuilding} />
        
        {/* Southeast Quadrant: Social & Health (x > 4, z > 4) */}
        <BuildingModel type="rumahSakit" level={buildings.rumahSakit} position={[12, 0, 8]} onSelect={onSelectBuilding} />
        <BuildingModel type="klinikHerbal" level={buildings.klinikHerbal} position={[8, 0, 15]} onSelect={onSelectBuilding} />
        <BuildingModel type="tamanKota" level={buildings.tamanKota} position={[6, 0, 6]} onSelect={onSelectBuilding} />
        <BuildingModel type="wismaMusafir" level={buildings.wismaMusafir} position={[14, 0, 14]} onSelect={onSelectBuilding} />
        <BuildingModel type="lapanganPanahan" level={buildings.lapanganPanahan || 0} position={[22, 0, 10]} onSelect={onSelectBuilding} />
        
        {/* Strategic Defense Positions */}
        <BuildingModel type="gerbangKota" level={buildings.gerbangKota} position={[0, 0, 30]} onSelect={onSelectBuilding} />
        <BuildingModel type="bentengPertahanan" level={buildings.bentengPertahanan} position={[0, 0, -35]} onSelect={onSelectBuilding} />
      </Suspense>

      {citizens}
      {decorativePalms}
      {fences}
      {streetLamps}
      {flowerBeds}
      {mountains}
      {grassPatches}
      {decorHouses}
    </>
  );
};

export const GameWorld: React.FC<GameWorldProps> = ({ buildings, onSelectBuilding }) => {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-400 to-orange-200 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-islamic-gold/20">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <div>
                <h4 className="text-islamic-green font-serif italic text-xl leading-none">Oase Peradaban</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Simulasi Dunia 3D Aktif</p>
             </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest">Gunakan Mouse untuk Putar & Zoom • Klik Bangunan</p>
        </div>
      </div>

      <Canvas 
        shadows 
        orthographic
        dpr={[1, 1.5]}
        camera={{ position: [100, 100, 100], zoom: 35, near: 0.1, far: 2000 }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
      >
        <Scene buildings={buildings} onSelectBuilding={onSelectBuilding || (() => {})} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          makeDefault 
          minPolarAngle={0.1} 
          maxPolarAngle={Math.PI / 2.5} 
          enableDamping
          dampingFactor={0.05}
          maxZoom={100}
          minZoom={10}
        />
        <ContactShadows 
          resolution={1024} 
          scale={50} 
          blur={2} 
          opacity={0.3} 
          far={15} 
          color="#3e2723" 
        />
      </Canvas>
    </div>
  );
};
