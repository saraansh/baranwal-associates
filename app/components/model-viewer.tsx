import { useEffect, useRef, useState } from "react";

/**
 * Minimal three.js glTF viewer: auto-framed model, orbit controls, studio
 * lighting. Loads three lazily so it never lands in the main bundle.
 */
export function ModelViewer({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [THREE, { GLTFLoader }, { OrbitControls }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/controls/OrbitControls.js"),
      ]);
      if (disposed) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight || 480;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 5000);
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const sun = new THREE.DirectionalLight(0xfff3e0, 2.2);
      sun.position.set(5, 10, 7);
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xe0ecff, 0.8);
      fill.position.set(-6, 4, -8);
      scene.add(fill);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      try {
        const gltf = await new GLTFLoader().loadAsync(url);
        if (disposed) return;
        const model = gltf.scene;
        scene.add(model);

        // Frame the model.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const radius = Math.max(size.x, size.y, size.z) || 1;
        camera.position.set(
          center.x + radius * 1.2,
          center.y + radius * 0.8,
          center.z + radius * 1.2,
        );
        controls.target.copy(center);
        controls.update();
      } catch (e) {
        if (!disposed) setError("Could not load the 3D model.");
        console.error(e);
      }

      let frame = 0;
      const animate = () => {
        frame = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [url]);

  return (
    <div ref={mountRef} className={className ?? "h-[480px] w-full"}>
      {error && (
        <p className="flex h-full items-center justify-center text-sm text-muted">
          {error}
        </p>
      )}
    </div>
  );
}
