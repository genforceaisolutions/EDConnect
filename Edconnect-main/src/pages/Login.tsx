import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import * as THREE from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderMaterial } from 'three';

// Custom shader for particles
const particleVertexShader = `
  uniform float uTime;
  varying vec3 vPosition;
  
  void main() {
    vPosition = position;
    vec3 pos = position;
    pos.y += sin(pos.x * 0.5 + uTime) * 0.5;
    pos.x += cos(pos.z * 0.5 + uTime) * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;
  
  // Vibrant gradient colors
  vec3 colorA = vec3(0.91, 0.27, 0.55); // Pink/Magenta
  vec3 colorB = vec3(0.27, 0.91, 0.62); // Turquoise
  vec3 colorC = vec3(0.91, 0.57, 0.13); // Orange/Gold
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Dynamic triple gradient based on position and time
    float t = vPosition.y * 0.5 + 0.5;
    vec3 color1 = mix(colorA, colorB, t);
    vec3 color2 = mix(colorB, colorC, t);
    vec3 finalColor = mix(color1, color2, sin(uTime) * 0.5 + 0.5);
    
    // Shimmer effect
    finalColor += vec3(0.1) * sin(uTime * 2.0 + vPosition.x * 10.0);
    
    gl_FragColor = vec4(finalColor, 1.0 - dist * 1.5);
  }
`;

class ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;

  constructor() {
    this.position = new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      50 + Math.random() * 20,
      (Math.random() - 0.5) * 100
    );
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      -2 - Math.random() * 2,
      (Math.random() - 0.5) * 0.5
    );
    this.lifetime = 0;
    this.maxLifetime = 2 + Math.random() * 1;
  }

  update(deltaTime: number): boolean {
    this.lifetime += deltaTime;
    this.position.add(this.velocity);
    return this.lifetime < this.maxLifetime;
  }

  reset() {
    this.position.set(
      (Math.random() - 0.5) * 100,
      50 + Math.random() * 20,
      (Math.random() - 0.5) * 100
    );
    this.lifetime = 0;
    this.maxLifetime = 2 + Math.random() * 1;
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Particle setup
    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      scales[i] = Math.random() * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );

    const particleMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x4488ff) }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Post processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,
      0.5,
      0.7
    );
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // Mouse interaction for background movement
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Shooting stars setup
    const shootingStarCount = 20;
    const shootingStars: ShootingStar[] = [];
    const shootingStarGeometry = new THREE.BufferGeometry();
    const shootingStarPositions = new Float32Array(shootingStarCount * 3);
    const shootingStarMaterial = new THREE.PointsMaterial({
      size: 0.3,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < shootingStarCount; i++) {
      shootingStars.push(new ShootingStar());
    }
    const shootingStarPoints = new THREE.Points(
      shootingStarGeometry,
      shootingStarMaterial
    );
    scene.add(shootingStarPoints);

    let time = 0;
    const animate = () => {
      time += 0.001;
      requestAnimationFrame(animate);

      particleMaterial.uniforms.uTime.value = time;
      camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.05;
      camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.05;

      // Update particle positions
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        positions[i3 + 1] = y + Math.sin(time * 2 + x) * 0.01;
        positions[i3] = x + Math.cos(time * 2 + z) * 0.01;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Update shooting stars
      for (let i = 0; i < shootingStarCount; i++) {
        const star = shootingStars[i];
        const alive = star.update(0.016);
        if (!alive) {
          star.reset();
        }
        const i3 = i * 3;
        shootingStarPositions[i3] = star.position.x;
        shootingStarPositions[i3 + 1] = star.position.y;
        shootingStarPositions[i3 + 2] = star.position.z;
      }
      shootingStarGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(shootingStarPositions, 3)
      );
      shootingStarGeometry.attributes.position.needsUpdate = true;

      // Trail effect for shooting stars
      const trail = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -2, 0)
        ]),
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.1,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending
        })
      );
      shootingStars.forEach((star) => {
        const trailClone = trail.clone();
        trailClone.position.copy(star.position);
        scene.add(trailClone);
        setTimeout(() => {
          scene.remove(trailClone);
          trailClone.geometry.dispose();
          (trailClone.material as THREE.Material).dispose();
        }, 100);
      });

      composer.render();
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      particleGeometry.dispose();
      particleMaterial.dispose();
      scene.clear();
      renderer.dispose();
      composer.dispose();
      shootingStarGeometry.dispose();
      shootingStarMaterial.dispose();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        toast({ title: "Success", description: "Logged in successfully" });
        if (profile?.role === "admin") navigate("/admin/dashboard");
        else if (profile?.role === "teacher") navigate("/teacher/dashboard");
        else navigate("/student/dashboard");
      } else {
        await signup(email, password, role);
        await supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", (await supabase.auth.getUser()).data.user?.id);
        toast({ title: "Success", description: "Signed up successfully" });
        navigate(`/${role}/dashboard`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || `Failed to ${isLogin ? "login" : "sign up"}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-blue-900/40" />
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/img/background.jpg')" }}
      />
      {/* Second Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-indigo-800/30"></div>
      
      {/* Login Form Container */}
      <div className="relative max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl form-container">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Sign in to continue" : "Sign up to get started"}
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="student"
              onClick={() => setRole("student")}
              className="p-2 rounded-lg transition hover:bg-blue-400"
            >
              Student
            </TabsTrigger>
            <TabsTrigger
              value="teacher"
              onClick={() => setRole("teacher")}
              className="p-2 rounded-lg transition hover:bg-blue-400"
            >
              Teacher
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              onClick={() => setRole("admin")}
              className="p-2 rounded-lg transition hover:bg-blue-400"
            >
              Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {isLogin ? "Sign in" : "Sign up"}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
