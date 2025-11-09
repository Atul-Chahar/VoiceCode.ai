import React, { useEffect } from 'react';

export default function Hero3D() {
  useEffect(() => {
      // Safely load the Spline viewer script if it's not already present in the document
      // This ensures the custom element actually renders even if the user forgot to add it to index.html
      if (!document.querySelector('script[src*="spline-viewer"]')) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js';
          document.head.appendChild(script);
      }
  }, []);

  return (
    <section className="w-full h-screen bg-[#050A14] relative overflow-hidden">
        {/* @ts-ignore */}
        <spline-viewer 
            url="https://prod.spline.design/48vU59q6bf2bQerU/scene.splinecode"
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    </section>
  );
}