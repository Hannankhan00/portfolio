/* eslint-disable react/no-unknown-property */
'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

// Asset URLs — served from public/ in Next.js
const CARD_GLB_URL = '/assets/card.glb';
const LANYARD_PNG_URL = '/assets/lanyard.png';

// Preload so the GLB is cached before Band mounts — prevents Suspense remounting
// the physics world mid-simulation.
useGLTF.preload(CARD_GLB_URL);

extend({ MeshLineGeometry, MeshLineMaterial });

// 1×1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 0.7,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        {/*
         * Suspense INSIDE Canvas keeps the physics world alive while assets load.
         * Without this, useGLTF suspending causes Physics to unmount/remount,
         * which resets body positions and sends the card falling off-screen.
         */}
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
            />
          </Physics>
        </Suspense>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
}: BandProps) {
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const card = useRef<any>(null!);

  // Allocate these once outside useFrame to avoid GC pressure
  const vec = useRef(new THREE.Vector3());
  const ang = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB_URL) as any;
  const texture = useTexture(lanyardImage || LANYARD_PNG_URL);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: HTMLImageElement, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      ctx.save();

      // Draw white background for the whole face to act as a border
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rx, ry, rw, rh);

      // Define padding for the white border (now much thinner: 1.5% of width)
      const border = rw * 0.06;

      const innerRx = rx + border;
      const innerRy = ry + border;
      const innerRw = rw - border * 2;
      const innerRh = rh - border * 2;

      // The UV mapping slightly stretches the image horizontally. 
      // We apply a correction factor to un-stretch it.
      const widthCorrection = 0.9;

      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick((innerRw * widthCorrection) / img.width, innerRh / img.height);

      const dw = img.width * scale;
      const dh = img.height * scale;

      // Center the image
      const dx = innerRx + (innerRw - dw) / 2;
      const dy = innerRy + (innerRh - dh) / 2;

      ctx.beginPath();
      const borderRadius = innerRw * 0.05; // Adjust this value to change roundness
      ctx.roundRect(innerRx, innerRy, innerRw, innerRh, borderRadius);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;

    if (frontImage && frontTex.image) drawFitted(frontTex.image as HTMLImageElement, FRONT_UV_RECT);
    if (backImage && backTex.image) {
      drawFitted(backTex.image as HTMLImageElement, BACK_UV_RECT);
    } else {
      // Draw white card back with QR code
      const bx = BACK_UV_RECT.x * W;
      const by = BACK_UV_RECT.y * H;
      const bw = BACK_UV_RECT.w * W;
      const bh = BACK_UV_RECT.h * H;

      ctx.save();
      // White Background
      ctx.fillStyle = '#ffffff'; 
      ctx.fillRect(bx, by, bw, bh);

      // Punchy line below QR
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.font = `bold ${bw * 0.08}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText("HANNAN KHAN", bx + bw / 2, by + bh * 0.75);

      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = `${bw * 0.045}px sans-serif`;
      ctx.fillText("Full Stack Developer", bx + bw / 2, by + bh * 0.82);

      ctx.restore();

      // Load QR code asynchronously and draw
      const qrImg = new window.Image();
      qrImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABeElEQVRoge2YMbKDMAxE9ScFJUfIUTgaORpH4QiUFAyKvLZMyAAxfMpVkcHyS7OgtSyRX9FqCqy0q2aR5/jn2ZlAMdBjp1JpQFUhbUCHdE3gBBBS9mMrewh5+48BWBG4AjQ6iX+mBP4DxPK3vVcofwLngVz+wyNSUeoNfyBwCPjhE4FmTFKnIHAfsA47rsRfz2YQ2AWi1DAJ6A1xrZmKwg8EigG0ny+IWk/ZaQVANAkCZUDrKltMlg8fbe5IG50JFANhJ0mtSf3Q4Hf1ROAUkO5F6h0pPmEAGvsoAncBbdwOjuAPEv0BDawQKAb6KskZHWFMKZGHuoEQKAd62EJq/iG1ZAMhUAyoB6725rvPvBq+T38Cu8ASS+ekLvU6CBwCreuMIwkHVB6SLO0BgTuAHoqnGalf7T/fBYFS4GtGuoqBwBUA/lDlJjXPngmcBVD+drXXPnnvxmCfwAHg5Z9HoFAYZrAxjiawC3ilJ0D1Y/i0NW0mcBX4FW/GCFC785MjoQAAAABJRU5ErkJggg==";
      qrImg.onload = () => {
        const qrSize = bw * 0.5;
        const qrX = bx + (bw - qrSize) / 2;
        const qrY = by + bh * 0.2;
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        composite.needsUpdate = true;
      };
    }

    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.current.copy(vec.current).sub(state.camera.position).normalize();
      vec.current.add(dir.current.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.current.x - (dragged as THREE.Vector3).x,
        y: vec.current.y - (dragged as THREE.Vector3).y,
        z: vec.current.z - (dragged as THREE.Vector3).z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as any).setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.current.copy(card.current.angvel());
      rot.current.copy(card.current.rotation());
      card.current.setAngvel({
        x: ang.current.x,
        y: ang.current.y - rot.current.y * 0.25,
        z: ang.current.z,
      });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/*
       * Bodies start in a PRE-SETTLED hanging position (vertical column below
       * the fixed anchor at world-y=4). This prevents the instability caused
       * by starting horizontal with gravity=-40: joints would break and the
       * card would shoot off to -∞ before the constraint solver could catch it.
       *
       * Group is offset to x=3 so the anchor sits in the right portion of the
       * full-width canvas (≈75% from left for a standard 16:9 viewport).
       *
       * Layout (world-space y, x=3):
       *   fixed  → y = 4      (group origin)
       *   j1     → y = 3      (1 unit below fixed,  rope-joint dist = 1 ✓)
       *   j2     → y = 2      (1 unit below j1,     rope-joint dist = 1 ✓)
       *   j3     → y = 1      (1 unit below j2,     rope-joint dist = 1 ✓)
       *   card   → y = -0.5   (spherical joint: card-local anchor [0,1.5,0]
       *                         = world y -0.5+1.5 = 1.0 = j3 ✓)
       */}
      <group position={[3, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -4.5, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e: any) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.current.copy(card.current.translation()))
              )
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error: meshline custom element */}
        <meshLineGeometry />
        {/* @ts-expect-error: meshline custom element */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
