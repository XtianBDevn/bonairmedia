'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const threejsCanvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const envelopeFlapRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "BAM! transformed our online presence. Sales increased 200% in the first quarter!",
      name: "Sarah Mitchell",
      company: "Carytown Boutique",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      color: "amber",
      backContent: "Working with BAM! was a game-changer. Their attention to detail and understanding of our brand resulted in a website that perfectly captures our boutique's essence. Traffic increased by 150% in just two months!"
    },
    {
      quote: "Professional, creative, and truly understand small business needs. Highly recommend!",
      name: "Marcus Thompson",
      company: "RVA Auto Repair",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      color: "pink",
      backContent: "The team at BAM! delivered beyond our expectations. They created a modern, user-friendly site that makes it easy for customers to book appointments online. Our digital presence has never been stronger!"
    },
    {
      quote: "Our website finally reflects the warmth of our cafe. Bookings have doubled!",
      name: "Jennifer Walsh",
      company: "The Fan District Cafe",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      color: "cyan",
      backContent: "BAM! captured the cozy, welcoming vibe of our cafe perfectly. The online reservation system they built has streamlined our operations and our customers love how easy it is to use. Couldn't be happier!"
    }
  ];

  useEffect(() => {
    // Check if GSAP is loaded
    const checkGSAP = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).gsap) {
        clearInterval(checkGSAP);
        initAnimations();
      }
    }, 100);

    // Three.js setup
    if (threejsCanvasRef.current) {
      setupThreeJS();
    }

    return () => clearInterval(checkGSAP);
  }, []);

  const initAnimations = () => {
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    const TextPlugin = (window as any).TextPlugin;

    if (!gsap || !ScrollTrigger || !TextPlugin) return;

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Hero Animations
    const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTL
      .to('#heroBadge', { opacity: 1, duration: 0.8, delay: 0.3 })
      .to('#badgeText', { duration: 1.5, text: 'Proudly Serving Richmond, Virginia', ease: 'none' }, '-=0.5')
      .to('#heroLine1', { duration: 1, text: 'YOUR LOCAL', ease: 'none' }, '-=1')
      .to('#heroLine2', { duration: 1, text: 'WEB DESIGN', ease: 'none' }, '-=0.6')
      .to('#heroLine3', { duration: 1, text: 'POWERHOUSE', ease: 'none' }, '-=0.6')
      .to('#heroText', { opacity: 1, duration: 0.5 }, '-=0.3')
      .to('#heroText', { duration: 2, text: 'From Short Pump to Shockoe Bottom, we build websites that make Richmond businesses shine. Local expertise. Global standards.', ease: 'none' }, '-=0.3')
      .to('#heroButtons', { opacity: 1, y: 0, duration: 0.8 }, '-=1.5')
      .to('#scrollIndicator', { opacity: 1, duration: 0.8 }, '-=0.5');

    // Water tower animations
    gsap.from('#waterTower svg', { y: 100, scale: 0.9, opacity: 0, duration: 2, ease: 'power3.out', delay: 0.2 });
    gsap.to('#waterTower svg', { rotation: 0.5, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center bottom' });

    gsap.to('#waterTower', {
      yPercent: -15, scale: 1.05, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Color blob animations
    gsap.to('.color-blob', {
      x: 'random(-80, 80)', y: 'random(-80, 80)',
      duration: 'random(12, 20)', repeat: -1, yoyo: true, ease: 'sine.inOut',
      stagger: { each: 2, from: 'random' }
    });

    // Navbar scroll
    ScrollTrigger.create({
      start: 'top -100', end: 99999,
      toggleClass: { className: 'bg-stone-950/95 backdrop-blur-md !py-4', targets: '#navbar' }
    });

    // Stats counter
    ScrollTrigger.create({
      trigger: '.stat-item',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('#stat1', { duration: 2, text: '150+', ease: 'none' });
        gsap.to('#stat2', { duration: 2, text: '98%', ease: 'none', delay: 0.2 });
        gsap.to('#stat3', { duration: 2, text: '10+', ease: 'none', delay: 0.4 });
      },
      once: true
    });

    // Services animations
    gsap.to('#servicesLabel', { opacity: 1, scrollTrigger: { trigger: '#services', start: 'top 80%' }, duration: 0.8 });
    gsap.to('#servicesTitle', { opacity: 1, scrollTrigger: { trigger: '#services', start: 'top 75%' }, duration: 0.8 });
    gsap.to('#servicesDesc', { opacity: 1, duration: 0.8, scrollTrigger: { trigger: '#services', start: 'top 70%' } });
    gsap.to('#servicesDesc', { duration: 2, text: 'From concept to launch and beyond, we provide everything Richmond businesses need to dominate online.', ease: 'none', scrollTrigger: { trigger: '#services', start: 'top 70%' } });

    gsap.from('.service-card', {
      y: 80, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '#services', start: 'top 60%' }
    });

    // About animations
    gsap.from('.about-item', {
      x: -50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 60%' }
    });

    // Testimonials
    gsap.from('.testimonial-card', {
      y: 100, opacity: 0, rotateX: -15, duration: 1, stagger: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#testimonials', start: 'top 70%' }
    });

    // Tech Stack animations
    const techBadges = gsap.utils.toArray('.tech-badge');
    techBadges.forEach((badge: any, index: number) => {
      gsap.fromTo(badge,
        { opacity: 0, scale: 0, rotation: -180, y: 100 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '#techstack',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1,
          onComplete: () => {
            // Continuous floating animation
            gsap.to(badge, {
              y: -15,
              duration: 2 + Math.random() * 2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: Math.random() * 2,
            });

            // Continuous subtle rotation
            gsap.to(badge, {
              rotation: 5,
              duration: 3 + Math.random() * 2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: Math.random() * 2,
            });

            // Pulse scale effect
            gsap.to(badge, {
              scale: 1.05,
              duration: 2.5 + Math.random() * 1.5,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: Math.random() * 2,
            });
          },
        }
      );
    });

    // Contact animations
    gsap.to('#contactTitle', { duration: 1.5, text: 'READY TO MAKE YOUR MARK?', ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 80%' } });
    gsap.to('#contactDesc', { duration: 1.5, text: "Let's create something extraordinary together. Book a free consultation today.", ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 75%' } });

    const contactTL = gsap.timeline({ scrollTrigger: { trigger: '#contact', start: 'top 60%' } });
    contactTL
      .to('#contactForm', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .from('.form-group', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
      .to('#contactInfo1', { opacity: 1, x: 0, duration: 0.6 }, '-=0.3')
      .to('#contactInfo2', { opacity: 1, x: 0, duration: 0.6 }, '-=0.4')
      .to('#contactInfo3', { opacity: 1, x: 0, duration: 0.6 }, '-=0.4')
      .to('#contactSocials', { opacity: 1, duration: 0.6 }, '-=0.3');
  };

  const setupThreeJS = () => {
    if (!threejsCanvasRef.current) return;

    const canvas = threejsCanvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const colors = [[1, 0.6, 0], [0.9, 0.3, 0.5], [0, 0.8, 0.8], [0.6, 0.3, 0.9], [0.3, 0.9, 0.5]];

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorsArray[i] = color[0];
      colorsArray[i + 1] = color[1];
      colorsArray[i + 2] = color[2];
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += mouseY * 0.0005;
      particlesMesh.rotation.y += mouseX * 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Flip card handler
  // Get color classes for testimonials
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { border: string; star: string; imageBorder: string; glow: string }> = {
      amber: {
        border: 'hover:border-amber-500/50',
        star: 'text-amber-500',
        imageBorder: 'border-amber-500/50',
        glow: 'bg-amber-500/30'
      },
      pink: {
        border: 'hover:border-pink-500/50',
        star: 'text-pink-500',
        imageBorder: 'border-pink-500/50',
        glow: 'bg-pink-500/30'
      },
      cyan: {
        border: 'hover:border-cyan-500/50',
        star: 'text-cyan-500',
        imageBorder: 'border-cyan-500/50',
        glow: 'bg-cyan-500/30'
      }
    };
    return colorMap[color] || colorMap.amber;
  };

  // Envelope animation for contact form
  const animateEnvelope = () => {
    const gsap = (window as any).gsap;
    if (!gsap) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setFormStatus('success');

        // Show success message
        if (successMessageRef.current) {
          gsap.fromTo(
            successMessageRef.current,
            { opacity: 0, scale: 0, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
          );
        }

        // Reset after 3 seconds
        setTimeout(() => {
          if (envelopeRef.current && formRef.current) {
            gsap.to([envelopeRef.current, successMessageRef.current], {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                setFormStatus('');
                if (formRef.current && envelopeRef.current) {
                  gsap.set(formRef.current, { clearProps: 'all' });
                  gsap.set(envelopeRef.current, { clearProps: 'all' });
                  if (envelopeFlapRef.current) {
                    gsap.set(envelopeFlapRef.current, { clearProps: 'all' });
                  }
                }
              },
            });
          }
        }, 3000);
      },
    });

    // Step 1: Shrink form
    tl.to(formRef.current, {
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    // Step 2: Transform into envelope shape
    tl.to(formRef.current, {
      borderRadius: '4px',
      duration: 0.3,
    });

    // Step 3: Show envelope
    if (envelopeRef.current) {
      tl.set(envelopeRef.current, { display: 'block' });
      tl.fromTo(
        envelopeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }

    // Step 4: Close envelope flap
    if (envelopeFlapRef.current) {
      tl.to(envelopeFlapRef.current, {
        rotationX: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }

    // Step 5: Shake slightly (sealing animation)
    tl.to(formRef.current, {
      x: -5,
      duration: 0.05,
      yoyo: true,
      repeat: 5,
    });

    // Step 6: Fly away!
    tl.to(formRef.current, {
      x: typeof window !== 'undefined' ? window.innerWidth + 200 : 2000,
      y: typeof window !== 'undefined' ? -window.innerHeight - 200 : -2000,
      rotation: 45,
      scale: 0.3,
      duration: 1.5,
      ease: 'power2.in',
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      animateEnvelope();
    }, 500);
  };

  return (
    <>
      <div className="grain-overlay"></div>

      {/* Navigation */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="nav-link flex items-center gap-3 z-[60] relative">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center transform -rotate-3 animate-pulse-glow">
                <span className="bebas text-2xl text-white font-bold">B</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                <i className="fas fa-bolt text-xs text-stone-900"></i>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="bebas text-2xl tracking-wide text-white">BON AIR MEDIA</span>
              <span className="ml-2 text-amber-500 bebas text-xl">(BAM!)</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="nav-link text-stone-300 hover:text-amber-500 transition-colors duration-300 text-sm uppercase tracking-widest">Services</a>
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="nav-link text-stone-300 hover:text-amber-500 transition-colors duration-300 text-sm uppercase tracking-widest">About</a>
            <a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')} className="nav-link text-stone-300 hover:text-amber-500 transition-colors duration-300 text-sm uppercase tracking-widest">Testimonials</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="nav-link text-stone-300 hover:text-amber-500 transition-colors duration-300 text-sm uppercase tracking-widest">Contact</a>
          </div>

          <button
            onClick={toggleMenu}
            className={`hamburger z-[60] ${isMenuOpen ? 'active' : ''}`}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div id="menuOverlay" className={`menu-overlay fixed inset-0 z-50 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 ${isMenuOpen ? 'active' : ''}`}>
        <div className="colorful-bg opacity-30">
          <div className="color-blob blob-1"></div>
          <div className="color-blob blob-2"></div>
        </div>
        <div className="h-full flex flex-col items-center justify-center relative z-10">
          <nav className="text-center">
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="menu-item menu-link block bebas text-5xl md:text-7xl text-stone-100 hover:text-amber-500 transition-colors mb-4">Home</a>
            <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="menu-item menu-link block bebas text-5xl md:text-7xl text-stone-100 hover:text-pink-500 transition-colors mb-4">Services</a>
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="menu-item menu-link block bebas text-5xl md:text-7xl text-stone-100 hover:text-cyan-500 transition-colors mb-4">About</a>
            <a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')} className="menu-item menu-link block bebas text-5xl md:text-7xl text-stone-100 hover:text-purple-500 transition-colors mb-4">Testimonials</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="menu-item menu-link block bebas text-5xl md:text-7xl text-stone-100 hover:text-green-500 transition-colors">Contact</a>
          </nav>
          <div className="menu-item flex gap-6 mt-12">
            <a href="#" className="social-3d w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-stone-900">
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a href="#" className="social-3d w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-600/20 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="social-3d w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-500 hover:bg-cyan-500 hover:text-white">
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
            <a href="#" className="social-3d w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:text-white">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="colorful-bg">
          <div className="color-blob blob-1"></div>
          <div className="color-blob blob-2"></div>
          <div className="color-blob blob-3"></div>
          <div className="color-blob blob-4"></div>
          <div className="color-blob blob-5"></div>
        </div>
        <div className="absolute inset-0 bg-stone-950/60 z-[1]"></div>

        <canvas ref={threejsCanvasRef} id="threejsCanvas" className="z-[2]"></canvas>

        {/* Water Tower */}
        <div id="heroBg" className="parallax-bg absolute inset-0 z-[3]">
          <div id="starsLayer" className="absolute inset-0 opacity-60">
            <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full" style={{top: '8%', left: '12%'}}></div>
            <div className="absolute w-2 h-2 bg-pink-400 rounded-full" style={{top: '15%', left: '78%'}}></div>
            <div className="absolute w-1 h-1 bg-cyan-400 rounded-full" style={{top: '5%', left: '35%'}}></div>
            <div className="absolute w-2.5 h-2.5 bg-purple-500 rounded-full opacity-60" style={{top: '12%', left: '65%'}}></div>
            <div className="absolute w-1.5 h-1.5 bg-green-400 rounded-full" style={{top: '20%', left: '92%'}}></div>
            <div className="absolute w-1 h-1 bg-blue-400 rounded-full" style={{top: '3%', left: '50%'}}></div>
            <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-40" style={{top: '18%', left: '8%'}}></div>
            <div className="absolute w-1.5 h-1.5 bg-red-400 rounded-full" style={{top: '25%', left: '42%'}}></div>
          </div>

          <div id="waterTower" className="absolute inset-0 flex items-end justify-center pb-0">
            <svg viewBox="0 0 600 900" className="w-full max-w-4xl h-auto opacity-20" preserveAspectRatio="xMidYMax meet" style={{transform: 'translateY(15%)'}}>
              <defs>
                <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#92400e'}} />
                  <stop offset="50%" style={{stopColor:'#f59e0b'}} />
                  <stop offset="100%" style={{stopColor:'#92400e'}} />
                </linearGradient>
                <linearGradient id="legGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#78350f'}} />
                  <stop offset="100%" style={{stopColor:'#d97706'}} />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M80 900 L165 420 L175 420 L95 900 Z" fill="url(#legGradient)" opacity="0.9"/>
              <path d="M520 900 L435 420 L425 420 L505 900 Z" fill="url(#legGradient)" opacity="0.9"/>
              <path d="M180 900 L230 440 L250 440 L205 900 Z" fill="url(#legGradient)"/>
              <path d="M420 900 L370 440 L350 440 L395 900 Z" fill="url(#legGradient)"/>
              <line x1="90" y1="800" x2="500" y2="650" stroke="#f59e0b" strokeWidth="4" opacity="0.7"/>
              <line x1="500" y1="800" x2="90" y2="650" stroke="#f59e0b" strokeWidth="4" opacity="0.7"/>
              <line x1="120" y1="620" x2="480" y2="500" stroke="#f59e0b" strokeWidth="4" opacity="0.75"/>
              <line x1="480" y1="620" x2="120" y2="500" stroke="#f59e0b" strokeWidth="4" opacity="0.75"/>
              <polygon points="130,400 470,400 450,415 150,415" fill="none" stroke="url(#tankGradient)" strokeWidth="4"/>
              <ellipse cx="300" cy="395" rx="145" ry="35" fill="none" stroke="url(#tankGradient)" strokeWidth="5" filter="url(#glow)"/>
              <path d="M155 395 C155 395 140 300 145 250 Q150 180 300 140 Q450 180 455 250 C460 300 445 395 445 395" fill="none" stroke="url(#tankGradient)" strokeWidth="5" filter="url(#glow)"/>
              <ellipse cx="300" cy="350" rx="135" ry="30" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.6"/>
              <path id="textPath" d="M175 320 Q300 280 425 320" fill="none"/>
              <text fontFamily="Bebas Neue, sans-serif" fontSize="42" fill="#f59e0b" letterSpacing="12" filter="url(#glow)">
                <textPath href="#textPath" startOffset="50%" textAnchor="middle">BON AIR</textPath>
              </text>
              <path d="M175 235 Q175 170 300 130 Q425 170 425 235" fill="none" stroke="url(#tankGradient)" strokeWidth="4" filter="url(#glow)"/>
              <ellipse cx="300" cy="140" rx="55" ry="18" fill="none" stroke="#f59e0b" strokeWidth="4"/>
              <line x1="300" y1="122" x2="300" y2="50" stroke="url(#tankGradient)" strokeWidth="5" strokeLinecap="round" filter="url(#glow)"/>
              <circle cx="300" cy="42" r="10" fill="none" stroke="#f59e0b" strokeWidth="3" filter="url(#glow)"/>
              <circle cx="300" cy="5" r="5" fill="#fbbf24" filter="url(#glow)"/>
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950 z-[4]"></div>

        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-amber-500/30 rounded-full animate-float z-[4]"></div>
        <div className="absolute bottom-1/3 right-16 w-24 h-24 border-2 border-pink-500/30 rotate-45 animate-float z-[4]" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-cyan-500/20 rounded-lg animate-float z-[4]" style={{animationDelay: '4s'}}></div>

        <div className="relative z-[10] max-w-6xl mx-auto px-6 text-center">
          <div id="heroBadge" className="mb-6 opacity-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm backdrop-blur-sm">
              <i className="fas fa-map-marker-alt"></i>
              <span id="badgeText"></span>
            </span>
          </div>

          <h1 className="bebas text-6xl md:text-8xl lg:text-9xl leading-none mb-6">
            <div className="overflow-hidden"><span id="heroLine1" className="inline-block text-stone-100"></span></div>
            <div className="overflow-hidden"><span id="heroLine2" className="inline-block text-gradient"></span></div>
            <div className="overflow-hidden"><span id="heroLine3" className="inline-block text-stone-100"></span></div>
          </h1>

          <p id="heroText" className="text-xl md:text-2xl text-stone-400 max-w-2xl mx-auto mb-10 font-light opacity-0"></p>

          <div id="heroButtons" className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0">
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="group px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-stone-900 font-bold rounded-lg hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 text-lg flex items-center gap-3">
              <span>Let&apos;s Build Something Amazing</span>
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </a>
            <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="px-8 py-4 border-2 border-stone-600 text-stone-300 font-medium rounded-lg hover:border-amber-500 hover:text-amber-500 transition-all duration-300 text-lg flex items-center gap-3 backdrop-blur-sm">
              <i className="fas fa-play-circle"></i>
              <span>See Our Work</span>
            </a>
          </div>
        </div>

        <div id="scrollIndicator" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-stone-500 opacity-0">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-stone-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-8 bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item text-white"><div className="bebas text-4xl md:text-5xl" id="stat1">0+</div><div className="text-sm uppercase tracking-wide opacity-80">Websites Launched</div></div>
            <div className="stat-item text-white"><div className="bebas text-4xl md:text-5xl" id="stat2">0%</div><div className="text-sm uppercase tracking-wide opacity-80">Client Satisfaction</div></div>
            <div className="stat-item text-white"><div className="bebas text-4xl md:text-5xl" id="stat3">0+</div><div className="text-sm uppercase tracking-wide opacity-80">Years in RVA</div></div>
            <div className="stat-item text-white"><div className="bebas text-4xl md:text-5xl">24/7</div><div className="text-sm uppercase tracking-wide opacity-80">Local Support</div></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="colorful-bg opacity-20">
          <div className="color-blob blob-2" style={{top: '20%', left: '-15%'}}></div>
          <div className="color-blob blob-4" style={{bottom: '10%', right: '-15%'}}></div>
        </div>
        <div className="absolute inset-0 bg-stone-950/90"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span id="servicesLabel" className="text-amber-500 uppercase tracking-widest text-sm font-medium opacity-0">What We Do</span>
            <h2 className="bebas text-5xl md:text-7xl mt-4 mb-6">
              <span id="servicesTitle" className="opacity-0">SERVICES THAT </span><span className="text-gradient">DELIVER</span>
            </h2>
            <p id="servicesDesc" className="text-stone-400 text-lg max-w-2xl mx-auto opacity-0"></p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="service-card group relative p-8 rounded-2xl border bg-stone-900/50 border-stone-800 hover:border-amber-500/50 backdrop-blur-sm cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-laptop-code text-2xl text-amber-500"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-500 transition-colors">Custom Web Design</h3>
                <p className="text-stone-400">Stunning, responsive websites tailored to your Richmond business.</p>
              </div>
            </div>

            <div className="service-card group relative p-8 rounded-2xl border bg-stone-900/50 border-stone-800 hover:border-pink-500/50 backdrop-blur-sm cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-store text-2xl text-pink-500"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-pink-500 transition-colors">E-Commerce Solutions</h3>
                <p className="text-stone-400">Powerful online stores that convert visitors into customers.</p>
              </div>
            </div>

            <div className="service-card group relative p-8 rounded-2xl border bg-stone-900/50 border-stone-800 hover:border-cyan-500/50 backdrop-blur-sm cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-search text-2xl text-cyan-500"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-500 transition-colors">Local SEO</h3>
                <p className="text-stone-400">Get found by Richmond customers searching for your services.</p>
              </div>
            </div>

            <div className="service-card group relative p-8 rounded-2xl border bg-stone-900/50 border-stone-800 hover:border-purple-500/50 backdrop-blur-sm cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-mobile-alt text-2xl text-purple-500"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-500 transition-colors">Mobile-First Design</h3>
                <p className="text-stone-400">Your site looks incredible on every device.</p>
              </div>
            </div>

            <div className="service-card group relative p-8 rounded-2xl border bg-stone-900/50 border-stone-800 hover:border-green-500/50 backdrop-blur-sm cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-chart-line text-2xl text-green-500"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-green-500 transition-colors">Analytics & Growth</h3>
                <p className="text-stone-400">Data-driven insights to fuel your business growth.</p>
              </div>
            </div>

            <div className="service-card group relative p-8 rounded-2xl border bg-stone-900/50 border-stone-800 hover:border-amber-500/50 backdrop-blur-sm cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-headset text-2xl text-amber-500"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-500 transition-colors">Ongoing Support</h3>
                <p className="text-stone-400">Count on responsive, local support whenever you need it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 overflow-hidden">
        <div className="colorful-bg opacity-15">
          <div className="color-blob blob-1" style={{top: '20%', right: '5%'}}></div>
          <div className="color-blob blob-3" style={{bottom: '10%', left: '0%'}}></div>
        </div>
        <div className="absolute inset-0 bg-stone-950/85"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-amber-500 uppercase tracking-widest text-sm font-medium">Why BAM!</span>
              <h2 className="bebas text-5xl md:text-6xl mt-4 mb-8">
                <span id="aboutTitle1">RICHMOND&apos;S TRUSTED</span><br />
                <span className="text-gradient">WEB PARTNER</span>
              </h2>

              <div className="space-y-6">
                <div className="about-item flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/30 transition-colors">
                    <i className="fas fa-map-pin text-amber-500"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Locally Rooted</h3>
                    <p className="text-stone-400">Based right here in Bon Air, we understand the Richmond market.</p>
                  </div>
                </div>

                <div className="about-item flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition-colors">
                    <i className="fas fa-handshake text-pink-500"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Personal Service</h3>
                    <p className="text-stone-400">Work directly with our team—no outsourcing, no runarounds.</p>
                  </div>
                </div>

                <div className="about-item flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/30 transition-colors">
                    <i className="fas fa-rocket text-cyan-500"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Results Driven</h3>
                    <p className="text-stone-400">Every site we build converts visitors into customers.</p>
                  </div>
                </div>

                <div className="about-item flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors">
                    <i className="fas fa-heart text-purple-500"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Community Focused</h3>
                    <p className="text-stone-400">We&apos;re invested in Richmond&apos;s success because it&apos;s our home too.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/30 via-pink-500/30 to-cyan-500/30 blur-3xl rounded-full"></div>
              <div className="relative bg-stone-900/80 rounded-2xl p-8 border border-stone-700 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-stone-500 text-sm font-mono">your-business.com</div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-gradient-to-r from-amber-500/40 to-pink-500/40 rounded"></div>
                  <div className="h-4 w-full bg-stone-800 rounded"></div>
                  <div className="h-4 w-5/6 bg-stone-800 rounded"></div>
                  <div className="h-32 w-full bg-gradient-to-br from-stone-800 to-stone-700 rounded-lg mt-6 flex items-center justify-center">
                    <i className="fas fa-image text-4xl text-stone-600"></i>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="h-20 bg-gradient-to-br from-amber-500/20 to-stone-800 rounded-lg"></div>
                    <div className="h-20 bg-gradient-to-br from-pink-500/20 to-stone-800 rounded-lg"></div>
                    <div className="h-20 bg-gradient-to-br from-cyan-500/20 to-stone-800 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="techstack" className="py-24 relative overflow-hidden">
        <div className="colorful-bg opacity-20">
          <div className="color-blob blob-2" style={{top: '20%', left: '60%'}}></div>
          <div className="color-blob blob-4" style={{bottom: '20%', right: '10%'}}></div>
        </div>
        <div className="absolute inset-0 bg-stone-950/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 uppercase tracking-widest text-sm font-medium">Technology Stack</span>
            <h2 className="bebas text-5xl md:text-7xl mt-4">
              BUILT WITH <span className="text-gradient">CUTTING-EDGE</span> TOOLS
            </h2>
            <p className="text-stone-400 mt-4">Modern technologies for modern businesses</p>
          </div>

          <div id="techBadges" className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Next.js', icon: 'fab fa-react', color: '#000000' },
              { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
              { name: 'WordPress', icon: 'fab fa-wordpress', color: '#21759B' },
              { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
              { name: 'Node.js', icon: 'fab fa-node', color: '#339933' },
              { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26' },
              { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572B6' },
              { name: 'PHP', icon: 'fab fa-php', color: '#777BB4' },
              { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
              { name: 'Database', icon: 'fas fa-database', color: '#4479A1' },
            ].map((tech, index) => (
              <div
                key={index}
                className="tech-badge opacity-0"
                style={{ transformOrigin: 'center' }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 cursor-pointer shadow-2xl"
                    style={{
                      borderColor: `${tech.color}40`,
                      background: `radial-gradient(circle, ${tech.color}15, transparent)`,
                      boxShadow: `0 8px 32px ${tech.color}20`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = tech.color;
                      e.currentTarget.style.boxShadow = `0 12px 40px ${tech.color}60`;
                      e.currentTarget.style.background = `radial-gradient(circle, ${tech.color}25, transparent)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${tech.color}40`;
                      e.currentTarget.style.boxShadow = `0 8px 32px ${tech.color}20`;
                      e.currentTarget.style.background = `radial-gradient(circle, ${tech.color}15, transparent)`;
                    }}
                  >
                    <i
                      className={`${tech.icon} text-4xl transition-transform duration-300`}
                      style={{ color: tech.color }}
                    ></i>
                  </div>
                  <span className="text-sm font-semibold text-stone-300">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="colorful-bg opacity-25">
          <div className="color-blob blob-5" style={{top: '30%', left: '40%'}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-950"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 uppercase tracking-widest text-sm font-medium">Testimonials</span>
            <h2 className="bebas text-5xl md:text-7xl mt-4">
              WHAT <span className="text-gradient">RICHMOND</span> SAYS
            </h2>
            <p className="text-stone-400 mt-4">Real results from real Richmond businesses</p>
          </div>

          {/* Floating Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const colors = getColorClasses(testimonial.color);
              return (
                <div
                  key={index}
                  className="testimonial-card bg-stone-900/70 backdrop-blur-xl border border-stone-700 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-500 shadow-2xl hover:shadow-amber-500/20"
                >
                  {/* Quote */}
                  <div className="relative mb-8">
                    <div className="absolute -left-4 -top-6 text-7xl text-amber-500/20 font-serif">&quot;</div>
                    <p className="testimonial-quote text-stone-300 text-lg leading-relaxed relative z-10">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${colors.star} text-sm`}></i>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-stone-700/50">
                    <div className="relative">
                      <div className={`absolute inset-0 ${colors.glow} blur-lg rounded-full opacity-50`}></div>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className={`relative w-16 h-16 rounded-full object-cover border-2 ${colors.imageBorder}`}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{testimonial.name}</div>
                      <div className="text-stone-500">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="colorful-bg">
          <div className="color-blob blob-1" style={{opacity: 0.3}}></div>
          <div className="color-blob blob-2" style={{opacity: 0.25}}></div>
          <div className="color-blob blob-3" style={{opacity: 0.3}}></div>
        </div>
        <div className="absolute inset-0 bg-stone-950/70"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 uppercase tracking-widest text-sm font-medium">Get In Touch</span>
            <h2 className="bebas text-5xl md:text-7xl mt-4 mb-6">
              <span id="contactTitle"></span>
            </h2>
            <p id="contactDesc" className="text-xl text-stone-400 max-w-2xl mx-auto"></p>
          </div>

          {/* Contact Form - Full Width */}
          <div className="envelope-container relative mb-16">
            <div
              ref={formRef}
              id="contactForm"
              className="contact-form-container opacity-0 transform translate-y-10"
            >
              <form className="space-y-8 relative z-10" onSubmit={handleFormSubmit} style={{ opacity: formStatus === 'sending' ? 0.5 : 1 }}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="form-group">
                  <div className="gradient-border">
                    <div className="relative">
                      <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 z-10"></i>
                      <input
                        type="text"
                        className="form-input w-full pl-12 pr-4 py-4 rounded-lg text-stone-100"
                        placeholder="John Smith"
                        required
                      />
                    </div>
                  </div>
                  <label className="block text-amber-500 text-xs mt-2 ml-2 uppercase tracking-widest font-medium">Your Name</label>
                </div>

                <div className="form-group">
                  <div className="gradient-border">
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 z-10"></i>
                      <input
                        type="email"
                        className="form-input w-full pl-12 pr-4 py-4 rounded-lg text-stone-100"
                        placeholder="john@business.com"
                        required
                      />
                    </div>
                  </div>
                  <label className="block text-pink-500 text-xs mt-2 ml-2 uppercase tracking-widest font-medium">Email Address</label>
                </div>

                <div className="form-group">
                  <div className="gradient-border">
                    <div className="relative">
                      <i className="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500 z-10"></i>
                      <input
                        type="tel"
                        className="form-input w-full pl-12 pr-4 py-4 rounded-lg text-stone-100"
                        placeholder="(804) 555-1234"
                      />
                    </div>
                  </div>
                  <label className="block text-cyan-500 text-xs mt-2 ml-2 uppercase tracking-widest font-medium">Phone Number</label>
                </div>

                <div className="form-group">
                  <div className="gradient-border">
                    <div className="relative">
                      <i className="fas fa-briefcase absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500 z-10"></i>
                      <input
                        type="text"
                        className="form-input w-full pl-12 pr-4 py-4 rounded-lg text-stone-100"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>
                  <label className="block text-violet-500 text-xs mt-2 ml-2 uppercase tracking-widest font-medium">Company Name</label>
                </div>
              </div>

              <div className="form-group">
                <div className="gradient-border">
                  <div className="relative">
                    <i className="fas fa-comment-dots absolute left-4 top-6 text-purple-500 z-10"></i>
                    <textarea
                      className="form-input w-full pl-12 pr-4 py-4 rounded-lg text-stone-100 h-40 resize-none"
                      placeholder="Tell us about your project..."
                      required
                    ></textarea>
                  </div>
                </div>
                <label className="block text-purple-500 text-xs mt-2 ml-2 uppercase tracking-widest font-medium">Your Message</label>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-1 text-lg flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <span className="relative z-10">Launch Your Project</span>
                <i className="fas fa-rocket relative z-10 group-hover:rotate-45 transition-transform duration-500"></i>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </form>

              {/* Envelope overlay */}
              <div ref={envelopeRef} className="envelope">
                {/* Envelope body */}
                <div className="envelope-body"></div>

                {/* Envelope flap */}
                <div ref={envelopeFlapRef} className="envelope-flap"></div>

                {/* Address lines */}
                <div className="envelope-address">
                  <div className="envelope-line" style={{ width: '150px' }}></div>
                  <div className="envelope-line" style={{ width: '120px' }}></div>
                  <div className="envelope-line" style={{ width: '100px' }}></div>
                </div>

                {/* Stamp */}
                <div className="envelope-stamp">✉️</div>
              </div>
            </div>

            {/* Success message */}
            <div
              ref={successMessageRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-0 pointer-events-none z-50"
            >
              <div className="text-6xl text-amber-500 mb-4">✓</div>
              <h3 className="text-3xl font-bold text-amber-500 mb-2">Message Sent!</h3>
              <p className="text-stone-400">Thanks for reaching out!</p>
            </div>
          </div>

          {/* Map & Contact Info - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Interactive Map */}
            <div id="contactMap" className="opacity-0 transform translate-y-10">
              <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden border-2 border-amber-500/20 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99642.09823097894!2d-77.58448253125!3d37.52399395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b111095799c9ed%3A0x9e1e8c8e8f6e8f6e!2sBon%20Air%2C%20VA!5e0!3m2!1sen!2sus!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-950/30 to-transparent"></div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-8">
              <div id="contactInfo1" className="flex items-start gap-4 opacity-0 transform translate-x-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-2xl text-amber-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Visit Us</h3>
                  <p className="text-stone-400">Bon Air, Richmond, VA<br />Right in the heart of RVA</p>
                </div>
              </div>

              <div id="contactInfo2" className="flex items-start gap-4 opacity-0 transform translate-x-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-600/20 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone text-2xl text-pink-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Call Us</h3>
                  <p className="text-stone-400">(804) 555-BOOM<br />Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div id="contactInfo3" className="flex items-start gap-4 opacity-0 transform translate-x-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-2xl text-cyan-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Email Us</h3>
                  <p className="text-stone-400">hello@bonairmedia.com<br />We respond within 24 hours</p>
                </div>
              </div>

              <div id="contactSocials" className="pt-8 opacity-0">
                <h3 className="font-semibold text-xl mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="social-3d w-12 h-12 rounded-xl bg-gradient-to-br from-stone-700/20 to-stone-900/20 flex items-center justify-center text-stone-300 hover:bg-stone-700 hover:text-white">
                    <i className="fab fa-github text-xl"></i>
                  </a>
                  <a href="#" className="social-3d w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                  <a href="#" className="social-3d w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-600 hover:text-white">
                    <i className="fab fa-discord text-xl"></i>
                  </a>
                  <a href="#" className="social-3d w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white">
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a href="#" className="social-3d w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white">
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-stone-950 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center transform -rotate-3">
                <span className="bebas text-xl text-white font-bold">B</span>
              </div>
              <span className="bebas text-xl tracking-wide">BON AIR MEDIA</span>
              <span className="text-amber-500 bebas">(BAM!)</span>
            </div>
            <p className="text-stone-600 text-sm">© 2025 Bon Air Media (BAM!). All rights reserved.</p>
            <p className="text-stone-600 text-sm flex items-center gap-2">Made with <i className="fas fa-heart text-amber-500 animate-pulse"></i> in Richmond, Virginia</p>
          </div>
        </div>
      </footer>
    </>
  );
}
