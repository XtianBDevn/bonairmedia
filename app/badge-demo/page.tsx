'use client';

import { useEffect } from 'react';

export default function BadgeDemo() {
  const techStack = [
    { name: 'Next.js', icon: 'fab fa-react', color: '#000000' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
    { name: 'WordPress', icon: 'fab fa-wordpress', color: '#21759B' },
    { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
    { name: 'Node.js', icon: 'fab fa-node', color: '#339933' },
    { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572B6' },
    { name: 'PHP', icon: 'fab fa-php', color: '#777BB4' },
  ];

  useEffect(() => {
    const checkGSAP = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).gsap) {
        clearInterval(checkGSAP);
        initAllAnimations();
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  const initAllAnimations = () => {
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. MAGNETIC HOVER EFFECT
    const magneticBadges = gsap.utils.toArray('.magnetic-badge');
    magneticBadges.forEach((badge: any) => {
      badge.addEventListener('mouseenter', () => {
        gsap.to(badge, {
          scale: 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      });

      badge.addEventListener('mousemove', (e: any) => {
        const rect = badge.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(badge, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      badge.addEventListener('mouseleave', () => {
        gsap.to(badge, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });

    // 2. WAVE ENTRANCE
    gsap.from('.wave-badge', {
      scale: 0,
      opacity: 0,
      y: 100,
      rotation: 360,
      stagger: {
        each: 0.08,
        from: 'start',
        ease: 'power2.inOut'
      },
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#wave-section',
        start: 'top 70%'
      }
    });

    gsap.to('.wave-badge', {
      y: -20,
      stagger: {
        each: 0.1,
        from: 'start',
        repeat: -1,
        yoyo: true
      },
      duration: 1.5,
      ease: 'sine.inOut',
      delay: 1
    });

    // 3. 3D FLIP CARDS
    gsap.set('.flip-badge', {
      transformPerspective: 1000,
      transformStyle: 'preserve-3d'
    });

    gsap.from('.flip-badge', {
      rotationY: -180,
      opacity: 0,
      scale: 0.5,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#flip-section',
        start: 'top 70%'
      }
    });

    const flipBadges = gsap.utils.toArray('.flip-badge');
    flipBadges.forEach((badge: any) => {
      badge.addEventListener('mouseenter', () => {
        gsap.to(badge, {
          rotationY: '+=360',
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });

    // 4. ORBIT ANIMATION
    const orbitBadges = gsap.utils.toArray('.orbit-badge');
    const radius = 30;

    orbitBadges.forEach((badge: any, index: number) => {
      const angle = (index / orbitBadges.length) * Math.PI * 2;
      const duration = 8 + Math.random() * 4;

      gsap.to(badge, {
        x: `+=${Math.cos(angle) * radius}`,
        y: `+=${Math.sin(angle) * radius}`,
        repeat: -1,
        yoyo: true,
        duration: duration,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: '#orbit-section',
          start: 'top 70%'
        }
      });

      gsap.to(badge, {
        rotation: 360,
        repeat: -1,
        duration: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: '#orbit-section',
          start: 'top 70%'
        }
      });
    });

    // 5. GLITCH/MATRIX EFFECT
    const glitchTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#glitch-section',
        start: 'top 70%'
      }
    });

    glitchTimeline
      .from('.glitch-badge', {
        opacity: 0,
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200),
        scale: () => gsap.utils.random(0, 2),
        rotation: () => gsap.utils.random(-180, 180),
        stagger: 0.05,
        duration: 0.4,
        ease: 'power4.out'
      })
      .to('.glitch-badge', {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });

    const glitchBadges = gsap.utils.toArray('.glitch-badge');
    glitchBadges.forEach((badge: any) => {
      badge.addEventListener('mouseenter', () => {
        const tl = gsap.timeline();
        tl.to(badge, { x: -5, duration: 0.05 })
          .to(badge, { x: 5, duration: 0.05 })
          .to(badge, { x: -3, duration: 0.05 })
          .to(badge, { x: 0, duration: 0.05 })
          .to(badge, { scale: 1.15, duration: 0.2 }, 0);
      });

      badge.addEventListener('mouseleave', () => {
        gsap.to(badge, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
      });
    });

    // 6. PARTICLE BURST
    const burstTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#burst-section',
        start: 'top 70%'
      }
    });

    burstTimeline
      .from('.burst-badge', {
        scale: 0,
        opacity: 0,
        x: () => gsap.utils.random(-300, 300),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-720, 720),
        duration: 1.2,
        ease: 'power4.out'
      })
      .to('.burst-badge', {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });

    // 7. BREATHING/PULSE EFFECT
    const breathingBadges = gsap.utils.toArray('.breathing-badge');

    breathingBadges.forEach((badge: any, index: number) => {
      gsap.from(badge, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '#breathing-section',
          start: 'top 70%'
        }
      });

      gsap.to(badge, {
        scale: 1.1,
        duration: 1.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });

      gsap.to(badge, {
        filter: 'brightness(1.3) drop-shadow(0 0 20px currentColor)',
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });
    });
  };

  const renderBadge = (tech: any, className: string) => (
    <div key={tech.name} className={className} style={{ transformOrigin: 'center' }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer"
          style={{
            borderColor: `${tech.color}40`,
            background: `radial-gradient(circle, ${tech.color}15, transparent)`,
            boxShadow: `0 8px 32px ${tech.color}20`
          }}
        >
          <i className={`${tech.icon} text-3xl`} style={{ color: tech.color }}></i>
        </div>
        <span className="text-sm font-semibold text-stone-300">{tech.name}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="grain-overlay"></div>

      {/* Header */}
      <header className="py-12 text-center border-b border-stone-800">
        <h1 className="bebas text-6xl mb-4">
          GSAP Badge <span className="text-gradient">Animation Demos</span>
        </h1>
        <p className="text-stone-400">Scroll down to see each animation style in action</p>
      </header>

      {/* 1. Magnetic Hover Effect */}
      <section id="magnetic-section" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">1. Magnetic Hover Effect</h2>
            <p className="text-stone-400">Badges follow your cursor like magnets</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'magnetic-badge'))}
          </div>
        </div>
      </section>

      {/* 2. Wave Entrance */}
      <section id="wave-section" className="py-24 px-6 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">2. Wave Entrance</h2>
            <p className="text-stone-400">Cascading wave effect with continuous motion</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'wave-badge'))}
          </div>
        </div>
      </section>

      {/* 3. 3D Flip Cards */}
      <section id="flip-section" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">3. 3D Flip Cards</h2>
            <p className="text-stone-400">Hover to see 3D flip animation</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'flip-badge'))}
          </div>
        </div>
      </section>

      {/* 4. Orbit Animation */}
      <section id="orbit-section" className="py-24 px-6 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">4. Orbit Animation</h2>
            <p className="text-stone-400">Badges orbit in circular motion</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'orbit-badge'))}
          </div>
        </div>
      </section>

      {/* 5. Glitch/Matrix Effect */}
      <section id="glitch-section" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">5. Glitch/Matrix Effect</h2>
            <p className="text-stone-400">Digital glitch entrance with hover effect</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'glitch-badge'))}
          </div>
        </div>
      </section>

      {/* 6. Particle Burst */}
      <section id="burst-section" className="py-24 px-6 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">6. Particle Burst</h2>
            <p className="text-stone-400">Explodes from center then snaps into place</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'burst-badge'))}
          </div>
        </div>
      </section>

      {/* 7. Breathing/Pulse Effect */}
      <section id="breathing-section" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bebas text-4xl mb-2">7. Breathing/Pulse Effect</h2>
            <p className="text-stone-400">Organic breathing with subtle glow pulse</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {techStack.map((tech) => renderBadge(tech, 'breathing-badge'))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-stone-800">
        <p className="text-stone-500">
          <a href="/" className="text-amber-500 hover:text-amber-400">← Back to Main Site</a>
        </p>
      </footer>
    </div>
  );
}
