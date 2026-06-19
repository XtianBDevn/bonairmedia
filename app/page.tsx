'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const SERVICES = [
  { title: 'AI-First SEO', desc: 'Rank on Google, ChatGPT, and Perplexity. We optimise for every surface your customers search.', icon: 'fas fa-brain', accent: 'amber' },
  { title: 'Custom Web Design', desc: 'Stunning, responsive sites tailored to Richmond businesses — built to convert.', icon: 'fas fa-laptop-code', accent: 'pink' },
  { title: 'GBP Management', desc: 'Google Business Profile strategy that puts you on the map — literally.', icon: 'fas fa-map-marker-alt', accent: 'cyan' },
  { title: 'E-Commerce', desc: 'Powerful online stores that turn browsers into buyers, 24/7.', icon: 'fas fa-store', accent: 'purple' },
  { title: 'Mobile Apps', desc: 'Native & cross-platform apps under Bon Air Apps — from idea to App Store.', icon: 'fas fa-mobile-alt', accent: 'green' },
  { title: 'Analytics & Growth', desc: 'Data-driven dashboards and growth playbooks to scale what works.', icon: 'fas fa-chart-line', accent: 'amber' },
];

const TESTIMONIALS = [
  { quote: "BAM! transformed our online presence. Sales increased 200% in the first quarter!", name: "Sarah Mitchell", company: "Carytown Boutique", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", accent: 'amber' },
  { quote: "Professional, creative, and truly understand small business needs. Highly recommend!", name: "Marcus Thompson", company: "RVA Auto Repair", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", accent: 'pink' },
  { quote: "Our website finally reflects the warmth of our cafe. Bookings have doubled!", name: "Jennifer Walsh", company: "The Fan District Cafe", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", accent: 'cyan' },
];

const TECH = [
  { name: 'Next.js', icon: 'fab fa-react', color: '#000000' },
  { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
  { name: 'WordPress', icon: 'fab fa-wordpress', color: '#21759B' },
  { name: 'TypeScript', icon: 'fab fa-js', color: '#3178C6' },
  { name: 'Node.js', icon: 'fab fa-node', color: '#339933' },
  { name: '.NET / C#', icon: 'fas fa-code', color: '#512BD4' },
  { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
  { name: 'AI / ML', icon: 'fas fa-robot', color: '#06b6d4' },
  { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031' },
  { name: 'SQL Server', icon: 'fas fa-database', color: '#CC2927' },
];

const ACCENT_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  amber:  { border: 'border-amber-500/50',  bg: 'from-amber-500/20 to-orange-600/20',  text: 'text-amber-500',  glow: 'bg-amber-500/30' },
  pink:   { border: 'border-pink-500/50',   bg: 'from-pink-500/20 to-red-600/20',      text: 'text-pink-500',   glow: 'bg-pink-500/30' },
  cyan:   { border: 'border-cyan-500/50',   bg: 'from-cyan-500/20 to-blue-600/20',     text: 'text-cyan-500',   glow: 'bg-cyan-500/30' },
  purple: { border: 'border-purple-500/50', bg: 'from-purple-500/20 to-violet-600/20', text: 'text-purple-500', glow: 'bg-purple-500/30' },
  green:  { border: 'border-green-500/50',  bg: 'from-green-500/20 to-emerald-600/20', text: 'text-green-500',  glow: 'bg-green-500/30' },
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ─── Three.js ─── */
  const setupThreeJS = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [[1,0.6,0],[0.9,0.3,0.5],[0,0.8,0.8],[0.6,0.3,0.9],[0.3,0.9,0.5]];
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random()-0.5)*15; pos[i+1] = (Math.random()-0.5)*15; pos[i+2] = (Math.random()-0.5)*15;
      const c = palette[Math.floor(Math.random()*palette.length)];
      col[i]=c[0]; col[i+1]=c[1]; col[i+2]=c[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    camera.position.z = 5;

    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => { mx=(e.clientX/window.innerWidth)*2-1; my=-(e.clientY/window.innerHeight)*2+1; };
    document.addEventListener('mousemove', onMove);
    const animate = () => { requestAnimationFrame(animate); mesh.rotation.x+=0.0005+my*0.0005; mesh.rotation.y+=0.001+mx*0.0005; renderer.render(scene,camera); };
    animate();
    const onResize = () => { camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); };
    window.addEventListener('resize', onResize);
  }, []);

  /* ─── GSAP animations ─── */
  const initAnimations = useCallback(() => {
    const gsap = (window as any).gsap;
    const ST = (window as any).ScrollTrigger;
    const TP = (window as any).TextPlugin;
    if (!gsap || !ST || !TP) return;
    gsap.registerPlugin(ST, TP);

    // Hero
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('#heroBadge', { opacity:1, duration:0.8, delay:0.3 })
      .to('#badgeText', { duration:1.5, text:'Proudly Serving Richmond, Virginia', ease:'none' }, '-=0.5')
      .to('#heroLine1', { duration:1, text:'YOUR LOCAL', ease:'none' }, '-=1')
      .to('#heroLine2', { duration:1, text:'WEB DESIGN', ease:'none' }, '-=0.6')
      .to('#heroLine3', { duration:1, text:'POWERHOUSE', ease:'none' }, '-=0.6')
      .to('#heroText', { opacity:1, duration:0.5 }, '-=0.3')
      .to('#heroText', { duration:2, text:'From Short Pump to Shockoe Bottom, we build websites that make Richmond businesses shine. Local expertise. Global standards.', ease:'none' }, '-=0.3')
      .to('#heroButtons', { opacity:1, y:0, duration:0.8 }, '-=1.5')
      .to('#scrollIndicator', { opacity:1, duration:0.8 }, '-=0.5');

    // Bertrim hero entrance
    gsap.from('#bertrimHero .bertrim-float', { scale:0.5, opacity:0, duration:2.5, ease:'elastic.out(1,0.4)', delay:0.5 });
    gsap.to('#bertrimHero', { yPercent:-15, scale:1.08, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }});

    // Blobs
    gsap.to('.color-blob', { x:'random(-80,80)', y:'random(-80,80)', duration:'random(12,20)', repeat:-1, yoyo:true, ease:'sine.inOut', stagger:{ each:2, from:'random' }});

    // Navbar scroll
    ST.create({ start:'top -100', end:99999, toggleClass:{ className:'bg-stone-950/95 backdrop-blur-md !py-4', targets:'#navbar' }});

    // Stats
    ST.create({ trigger:'.stat-item', start:'top 80%', onEnter:() => {
      gsap.to('#stat1', { duration:2, text:'150+', ease:'none' });
      gsap.to('#stat2', { duration:2, text:'98%', ease:'none', delay:0.2 });
      gsap.to('#stat3', { duration:2, text:'10+', ease:'none', delay:0.4 });
    }, once:true });

    // Services
    gsap.to('#servicesLabel', { opacity:1, scrollTrigger:{ trigger:'#services', start:'top 80%' }, duration:0.8 });
    gsap.to('#servicesTitle', { opacity:1, scrollTrigger:{ trigger:'#services', start:'top 75%' }, duration:0.8 });
    gsap.from('.glass-card', { y:60, opacity:0, duration:0.7, stagger:0.12, ease:'power3.out', scrollTrigger:{ trigger:'#services', start:'top 60%' }});

    // About
    gsap.from('.about-item', { x:-50, opacity:0, duration:0.8, stagger:0.2, ease:'power3.out', scrollTrigger:{ trigger:'#about', start:'top 60%' }});

    // CTA bee
    gsap.from('#ctaBee', { scale:0.8, opacity:0, duration:1.2, ease:'elastic.out(1,0.5)', scrollTrigger:{ trigger:'#cta', start:'top 70%' }});
    gsap.from('#ctaContent', { y:40, opacity:0, duration:0.8, ease:'power3.out', scrollTrigger:{ trigger:'#cta', start:'top 65%' }});

    // Tech badges
    const badges = gsap.utils.toArray('.tech-badge');
    badges.forEach((b: any, i: number) => {
      gsap.fromTo(b, { opacity:0, scale:0, rotation:-180, y:100 }, {
        opacity:1, scale:1, rotation:0, y:0, duration:0.8, ease:'elastic.out(1,0.5)',
        scrollTrigger:{ trigger:'#techstack', start:'top 70%', toggleActions:'play none none reverse' },
        delay: i*0.1,
        onComplete: () => {
          gsap.to(b, { y:-15, duration:2+Math.random()*2, ease:'sine.inOut', repeat:-1, yoyo:true, delay:Math.random()*2 });
        }
      });
    });

    // Testimonials
    gsap.from('.testimonial-card', { y:100, opacity:0, rotateX:-15, duration:1, stagger:0.2, ease:'power3.out', scrollTrigger:{ trigger:'#testimonials', start:'top 70%' }});

    // Contact
    gsap.to('#contactTitle', { duration:1.5, text:'READY TO MAKE YOUR MARK?', ease:'none', scrollTrigger:{ trigger:'#contact', start:'top 80%' }});
    gsap.to('#contactDesc', { duration:1.5, text:"Let's create something extraordinary together. Book a free consultation today.", ease:'none', scrollTrigger:{ trigger:'#contact', start:'top 75%' }});
    const cTL = gsap.timeline({ scrollTrigger:{ trigger:'#contact', start:'top 60%' }});
    cTL.to('#contactForm', { opacity:1, y:0, duration:0.8, ease:'power3.out' })
       .from('.form-group', { y:30, opacity:0, duration:0.5, stagger:0.1, ease:'power2.out' }, '-=0.4');

    // Section tracking for mobile footer
    const sections = ['hero','services','about','cta','testimonials','contact'];
    sections.forEach(id => {
      ST.create({ trigger:`#${id}`, start:'top center', end:'bottom center', onEnter:() => setActiveSection(id), onEnterBack:() => setActiveSection(id) });
    });
  }, []);

  /* ─── Lifecycle ─── */
  useEffect(() => {
    const check = setInterval(() => { if ((window as any).gsap) { clearInterval(check); initAnimations(); } }, 100);
    if (canvasRef.current) setupThreeJS();
    return () => clearInterval(check);
  }, [initAnimations, setupThreeJS]);

  /* ─── Panel toggle ─── */
  const togglePanel = () => {
    setIsPanelOpen(prev => { document.body.style.overflow = !prev ? 'hidden' : ''; return !prev; });
  };
  const closePanel = () => { setIsPanelOpen(false); document.body.style.overflow = ''; };

  /* ─── Nav click ─── */
  const nav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); closePanel();
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
  };

  /* ─── Form ─── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormStatus('sending');
    setTimeout(() => { setFormStatus('success'); setTimeout(() => setFormStatus(''), 3000); }, 1000);
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="grain-overlay" />

      {/* ──────────────────── NAVBAR ──────────────────── */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-[55] transition-all duration-500 py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" onClick={e => nav(e,'#hero')} className="flex items-center gap-3 z-[60] relative group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-stone-700 group-hover:border-amber-500/50 transition-colors">
              <Image src="/logo-bw.webp" alt="Bon Air Media" fill className="object-cover" sizes="44px" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="flex items-baseline gap-0">
                <span className="logo-text-bon text-base tracking-wider">BON&nbsp;</span>
                <span className="logo-text-ai text-base tracking-wider">AI</span>
                <span className="logo-text-r text-base tracking-wider">R</span>
              </span>
              <span className="logo-text-media text-[0.6rem] mt-0.5">MEDIA</span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {['services','about','testimonials','contact'].map(s => (
              <a key={s} href={`#${s}`} onClick={e => nav(e,`#${s}`)} className="text-stone-300 hover:text-amber-500 transition-colors duration-300 text-sm uppercase tracking-widest rajdhani font-semibold">{s}</a>
            ))}
          </div>

          <button onClick={togglePanel} className={`hamburger z-[60] ${isPanelOpen ? 'active' : ''}`} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ──────────────────── SIDE PANEL MENU ──────────────────── */}
      <div className={`panel-backdrop ${isPanelOpen ? 'active' : ''}`} onClick={closePanel} />
      <div className={`side-panel ${isPanelOpen ? 'active' : ''}`}>
        {/* Decorative blobs */}
        <div className="colorful-bg opacity-20">
          <div className="color-blob blob-1" />
          <div className="color-blob blob-5" style={{ top:'60%', right:'-10%' }} />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 lg:px-32">
          {/* Logo in panel */}
          <div className="panel-item mb-12">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/30">
                <Image src="/logo-bw.webp" alt="Bon Air Media" fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="flex items-baseline gap-0">
                  <span className="logo-text-bon text-2xl tracking-wider">BON&nbsp;</span>
                  <span className="logo-text-ai text-2xl tracking-wider">AI</span>
                  <span className="logo-text-r text-2xl tracking-wider">R</span>
                </span>
                <span className="logo-text-media text-xs mt-1">MEDIA</span>
              </div>
            </div>
          </div>

          {/* Menu links */}
          <nav className="space-y-2">
            {[
              { href:'#hero', label:'Home', color:'text-amber-500' },
              { href:'#services', label:'Services', color:'text-pink-500' },
              { href:'#about', label:'About', color:'text-cyan-500' },
              { href:'#cta', label:'Work With Us', color:'text-green-500' },
              { href:'#testimonials', label:'Testimonials', color:'text-purple-500' },
              { href:'#contact', label:'Contact', color:'text-amber-500' },
            ].map((item, i) => (
              <a key={i} href={item.href} onClick={e => nav(e, item.href)}
                className={`panel-item block orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-stone-100 hover:${item.color} transition-colors duration-300 py-2`}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social links in panel */}
          <div className="panel-item flex gap-5 mt-12">
            {[
              { icon: 'fab fa-github', from: 'from-stone-700/30', hover: 'hover:bg-stone-600', text: 'text-stone-300' },
              { icon: 'fab fa-linkedin-in', from: 'from-blue-500/20', hover: 'hover:bg-blue-600', text: 'text-blue-400' },
              { icon: 'fab fa-instagram', from: 'from-pink-500/20', hover: 'hover:bg-pink-600', text: 'text-pink-400' },
              { icon: 'fab fa-youtube', from: 'from-red-500/20', hover: 'hover:bg-red-600', text: 'text-red-400' },
            ].map((s, i) => (
              <a key={i} href="#" className={`social-3d w-14 h-14 rounded-xl bg-gradient-to-br ${s.from} to-transparent flex items-center justify-center ${s.text} ${s.hover} hover:text-white transition-colors`}>
                <i className={`${s.icon} text-xl`} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────── HERO ──────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="colorful-bg">
          <div className="color-blob blob-1" /><div className="color-blob blob-2" /><div className="color-blob blob-3" /><div className="color-blob blob-4" /><div className="color-blob blob-5" />
        </div>
        <div className="absolute inset-0 bg-stone-950/60 z-[1]" />
        <canvas ref={canvasRef} id="threejsCanvas" className="z-[2]" />

        {/* Astronaut Bertrim — floating mascot */}
        <div id="heroBg" className="parallax-bg absolute inset-0 z-[3]">
          <div id="starsLayer" className="absolute inset-0 opacity-60">
            <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full" style={{top:'8%',left:'12%'}} />
            <div className="absolute w-2 h-2 bg-pink-400 rounded-full" style={{top:'15%',left:'78%'}} />
            <div className="absolute w-1 h-1 bg-cyan-400 rounded-full" style={{top:'5%',left:'35%'}} />
            <div className="absolute w-2.5 h-2.5 bg-purple-500 rounded-full opacity-60" style={{top:'12%',left:'65%'}} />
            <div className="absolute w-1.5 h-1.5 bg-green-400 rounded-full" style={{top:'20%',left:'92%'}} />
          </div>
          <div id="bertrimHero" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px] opacity-25 bertrim-float">
              <Image src="/bertrim.webp" alt="Bertrim — Bon Air Media Mascot" fill className="object-contain drop-shadow-[0_0_60px_rgba(245,158,11,0.3)]" sizes="560px" priority />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950 z-[4]" />
        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-amber-500/30 rounded-full animate-float z-[4]" />
        <div className="absolute bottom-1/3 right-16 w-24 h-24 border-2 border-pink-500/30 rotate-45 animate-float z-[4]" style={{animationDelay:'2s'}} />

        <div className="relative z-[10] max-w-6xl mx-auto px-6 text-center">
          <div id="heroBadge" className="mb-6 opacity-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm backdrop-blur-sm">
              <i className="fas fa-map-marker-alt" />
              <span id="badgeText" />
            </span>
          </div>
          <h1 className="orbitron text-5xl md:text-7xl lg:text-8xl leading-none mb-6 font-bold">
            <div className="overflow-hidden"><span id="heroLine1" className="inline-block text-stone-100" /></div>
            <div className="overflow-hidden"><span id="heroLine2" className="inline-block text-gradient" /></div>
            <div className="overflow-hidden"><span id="heroLine3" className="inline-block text-stone-100" /></div>
          </h1>
          <p id="heroText" className="text-xl md:text-2xl text-stone-400 max-w-2xl mx-auto mb-10 font-light opacity-0" />
          <div id="heroButtons" className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0">
            <a href="#contact" onClick={e => nav(e,'#contact')} className="glow-btn group px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-stone-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 text-lg flex items-center gap-3">
              <span>Let&apos;s Build Something Amazing</span>
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="#services" onClick={e => nav(e,'#services')} className="px-8 py-4 border-2 border-stone-600 text-stone-300 font-medium rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all duration-300 text-lg flex items-center gap-3 backdrop-blur-sm rajdhani">
              <i className="fas fa-play-circle" /><span>See Our Work</span>
            </a>
          </div>
        </div>
        <div id="scrollIndicator" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-stone-500 opacity-0">
          <span className="text-xs uppercase tracking-widest rajdhani font-semibold">Scroll</span>
          <div className="w-6 h-10 border-2 border-stone-600 rounded-full flex justify-center pt-2"><div className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" /></div>
        </div>
      </section>

      {/* ──────────────────── STATS ──────────────────── */}
      <section className="relative py-8 bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item text-white"><div className="orbitron text-3xl md:text-4xl font-bold" id="stat1">0+</div><div className="text-sm uppercase tracking-wide opacity-80 rajdhani font-semibold">Websites Launched</div></div>
            <div className="stat-item text-white"><div className="orbitron text-3xl md:text-4xl font-bold" id="stat2">0%</div><div className="text-sm uppercase tracking-wide opacity-80 rajdhani font-semibold">Client Satisfaction</div></div>
            <div className="stat-item text-white"><div className="orbitron text-3xl md:text-4xl font-bold" id="stat3">0+</div><div className="text-sm uppercase tracking-wide opacity-80 rajdhani font-semibold">Years in RVA</div></div>
            <div className="stat-item text-white"><div className="orbitron text-3xl md:text-4xl font-bold">24/7</div><div className="text-sm uppercase tracking-wide opacity-80 rajdhani font-semibold">Local Support</div></div>
          </div>
        </div>
      </section>

      {/* ──────────────────── SERVICES — Modern Card Grid ──────────────────── */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="colorful-bg opacity-20">
          <div className="color-blob blob-2" style={{top:'20%',left:'-15%'}} />
          <div className="color-blob blob-4" style={{bottom:'10%',right:'-15%'}} />
        </div>
        <div className="absolute inset-0 bg-stone-950/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span id="servicesLabel" className="text-amber-500 uppercase tracking-widest text-sm rajdhani font-bold opacity-0">What We Do</span>
            <h2 className="orbitron text-4xl md:text-6xl mt-4 mb-6 font-bold">
              <span id="servicesTitle" className="opacity-0">SERVICES THAT </span><span className="text-gradient">DELIVER</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">From concept to launch and beyond — everything Richmond businesses need to dominate online.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => {
              const a = ACCENT_COLORS[svc.accent];
              return (
                <div key={i} className="glass-card group p-8 cursor-pointer">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${a.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${svc.icon} text-2xl ${a.text}`} />
                    </div>
                    <h3 className={`orbitron text-lg font-semibold mb-3 group-hover:${a.text} transition-colors`}>{svc.title}</h3>
                    <p className="text-stone-400 leading-relaxed">{svc.desc}</p>
                    {/* Hover arrow */}
                    <div className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`text-sm font-semibold ${a.text} rajdhani tracking-wider`}>LEARN MORE</span>
                      <i className={`fas fa-arrow-right text-xs ${a.text} group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── ABOUT ──────────────────── */}
      <section id="about" className="relative py-32 overflow-hidden">
        <div className="colorful-bg opacity-15">
          <div className="color-blob blob-1" style={{top:'20%',right:'5%'}} />
          <div className="color-blob blob-3" style={{bottom:'10%',left:'0%'}} />
        </div>
        <div className="absolute inset-0 bg-stone-950/85" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-amber-500 uppercase tracking-widest text-sm rajdhani font-bold">Why BAM!</span>
              <h2 className="orbitron text-4xl md:text-5xl mt-4 mb-8 font-bold">
                RICHMOND&apos;S TRUSTED<br /><span className="text-gradient">WEB PARTNER</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon:'fas fa-map-pin', title:'Locally Rooted', desc:'Based right here in Bon Air, we understand the Richmond market.', accent:'amber' },
                  { icon:'fas fa-handshake', title:'Personal Service', desc:'Work directly with our team — no outsourcing, no runarounds.', accent:'pink' },
                  { icon:'fas fa-rocket', title:'Results Driven', desc:'Every site we build converts visitors into customers.', accent:'cyan' },
                  { icon:'fas fa-heart', title:'Community Focused', desc:"We're invested in Richmond's success because it's our home too.", accent:'purple' },
                ].map((item, i) => {
                  const a = ACCENT_COLORS[item.accent];
                  return (
                    <div key={i} className="about-item flex gap-4 group">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${a.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <i className={`${item.icon} ${a.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 orbitron text-sm">{item.title}</h3>
                        <p className="text-stone-400">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/30 via-pink-500/30 to-cyan-500/30 blur-3xl rounded-full" />
              <div className="relative bg-stone-900/80 rounded-2xl p-8 border border-stone-700 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
                  <div className="text-stone-500 text-sm font-mono">your-business.com</div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-gradient-to-r from-amber-500/40 to-pink-500/40 rounded" />
                  <div className="h-4 w-full bg-stone-800 rounded" />
                  <div className="h-4 w-5/6 bg-stone-800 rounded" />
                  <div className="h-32 w-full bg-gradient-to-br from-stone-800 to-stone-700 rounded-lg mt-6 flex items-center justify-center">
                    <i className="fas fa-image text-4xl text-stone-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="h-20 bg-gradient-to-br from-amber-500/20 to-stone-800 rounded-lg" />
                    <div className="h-20 bg-gradient-to-br from-pink-500/20 to-stone-800 rounded-lg" />
                    <div className="h-20 bg-gradient-to-br from-cyan-500/20 to-stone-800 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA — Original Bee ──────────────────── */}
      <section id="cta" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950" />
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-amber-500/10 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-pink-500/5 rounded-full animate-spin-slow" style={{animationDirection:'reverse',animationDuration:'30s'}} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Bee image */}
            <div id="ctaBee" className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-cyan-500/20 blur-3xl rounded-full scale-125" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border-2 border-amber-500/20 cta-bee-glow">
                <Image src="/bee-cta.webp" alt="Bon Air Media Bee" fill className="object-cover" sizes="320px" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-4 py-2 shadow-lg shadow-amber-500/30">
                <span className="orbitron text-sm font-bold text-stone-900">EST. 2021</span>
              </div>
            </div>

            {/* CTA content */}
            <div id="ctaContent" className="text-center lg:text-left">
              <span className="text-amber-500 uppercase tracking-widest text-sm rajdhani font-bold">Ready to grow?</span>
              <h2 className="orbitron text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 leading-tight">
                LET&apos;S BUILD YOUR<br /><span className="text-gradient">DIGITAL EMPIRE</span>
              </h2>
              <p className="text-stone-400 text-lg max-w-lg mb-8 leading-relaxed">
                From AI-powered SEO to custom web development, we give Richmond businesses the tools to compete globally. Your vision, our firepower.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#contact" onClick={e => nav(e,'#contact')} className="glow-btn px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-stone-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 text-lg rajdhani tracking-wider">
                  <span className="relative z-10">START YOUR PROJECT</span>
                </a>
                <a href="tel:8045551234" className="px-8 py-4 border-2 border-stone-600 text-stone-300 rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all duration-300 flex items-center gap-3 justify-center rajdhani font-semibold tracking-wider">
                  <i className="fas fa-phone" /><span>CALL NOW</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── TECH STACK ──────────────────── */}
      <section id="techstack" className="py-24 relative overflow-hidden">
        <div className="colorful-bg opacity-20">
          <div className="color-blob blob-2" style={{top:'20%',left:'60%'}} />
          <div className="color-blob blob-4" style={{bottom:'20%',right:'10%'}} />
        </div>
        <div className="absolute inset-0 bg-stone-950/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 uppercase tracking-widest text-sm rajdhani font-bold">Technology Stack</span>
            <h2 className="orbitron text-4xl md:text-6xl mt-4 font-bold">
              BUILT WITH <span className="text-gradient">CUTTING-EDGE</span> TOOLS
            </h2>
            <p className="text-stone-400 mt-4">Modern technologies for modern businesses</p>
          </div>
          <div id="techBadges" className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
            {TECH.map((t, i) => (
              <div key={i} className="tech-badge opacity-0" style={{transformOrigin:'center'}}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 cursor-pointer shadow-2xl"
                    style={{ borderColor:`${t.color}40`, background:`radial-gradient(circle,${t.color}15,transparent)`, boxShadow:`0 8px 32px ${t.color}20` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=t.color; e.currentTarget.style.boxShadow=`0 12px 40px ${t.color}60`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=`${t.color}40`; e.currentTarget.style.boxShadow=`0 8px 32px ${t.color}20`; }}>
                    <i className={`${t.icon} text-4xl`} style={{color:t.color}} />
                  </div>
                  <span className="text-sm font-semibold text-stone-300 rajdhani tracking-wider">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── TESTIMONIALS ──────────────────── */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="colorful-bg opacity-25"><div className="color-blob blob-5" style={{top:'30%',left:'40%'}} /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 uppercase tracking-widest text-sm rajdhani font-bold">Testimonials</span>
            <h2 className="orbitron text-4xl md:text-6xl mt-4 font-bold">WHAT <span className="text-gradient">RICHMOND</span> SAYS</h2>
            <p className="text-stone-400 mt-4">Real results from real Richmond businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {TESTIMONIALS.map((t, i) => {
              const a = ACCENT_COLORS[t.accent];
              return (
                <div key={i} className={`testimonial-card glass-card p-8`}>
                  <div className="relative mb-8">
                    <div className="absolute -left-4 -top-6 text-7xl text-amber-500/20 font-serif">&quot;</div>
                    <p className="testimonial-quote text-stone-300 text-lg leading-relaxed relative z-10">{t.quote}</p>
                  </div>
                  <div className="flex gap-1 mb-6">{[...Array(5)].map((_,j) => <i key={j} className={`fas fa-star ${a.text} text-sm`} />)}</div>
                  <div className="flex items-center gap-4 pt-6 border-t border-stone-700/50">
                    <div className="relative">
                      <div className={`absolute inset-0 ${a.glow} blur-lg rounded-full opacity-50`} />
                      <img src={t.image} alt={t.name} className={`relative w-16 h-16 rounded-full object-cover border-2 ${a.border}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{t.name}</div>
                      <div className="text-stone-500">{t.company}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── CONTACT ──────────────────── */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="colorful-bg">
          <div className="color-blob blob-1" style={{opacity:0.3}} /><div className="color-blob blob-2" style={{opacity:0.25}} /><div className="color-blob blob-3" style={{opacity:0.3}} />
        </div>
        <div className="absolute inset-0 bg-stone-950/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 uppercase tracking-widest text-sm rajdhani font-bold">Get In Touch</span>
            <h2 className="orbitron text-4xl md:text-6xl mt-4 mb-6 font-bold"><span id="contactTitle" /></h2>
            <p id="contactDesc" className="text-xl text-stone-400 max-w-2xl mx-auto" />
          </div>

          <div id="contactForm" className="opacity-0 transform translate-y-10 glass-card p-8 md:p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="block text-stone-300 text-sm rajdhani font-semibold tracking-wider mb-2">NAME *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none transition-colors" placeholder="John Smith" required />
                </div>
                <div className="form-group">
                  <label className="block text-stone-300 text-sm rajdhani font-semibold tracking-wider mb-2">EMAIL *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-pink-500 focus:outline-none transition-colors" placeholder="john@business.com" required />
                </div>
                <div className="form-group">
                  <label className="block text-stone-300 text-sm rajdhani font-semibold tracking-wider mb-2">PHONE</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-cyan-500 focus:outline-none transition-colors" placeholder="(804) 555-1234" />
                </div>
                <div className="form-group">
                  <label className="block text-stone-300 text-sm rajdhani font-semibold tracking-wider mb-2">COMPANY</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-violet-500 focus:outline-none transition-colors" placeholder="Your Company" />
                </div>
              </div>
              <div className="form-group">
                <label className="block text-stone-300 text-sm rajdhani font-semibold tracking-wider mb-2">MESSAGE *</label>
                <textarea className="w-full px-4 py-3 rounded-lg bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-purple-500 focus:outline-none transition-colors h-32 resize-none" placeholder="Tell us about your project..." required />
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-[1.02] text-lg orbitron tracking-wider" disabled={formStatus==='sending'}>
                {formStatus === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
              {formStatus === 'success' && <div className="text-center text-green-400 font-medium rajdhani tracking-wider">✓ Message sent successfully!</div>}
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon:'fas fa-map-marker-alt', title:'Visit Us', desc:'Bon Air, Richmond, VA', accent:'amber' },
              { icon:'fas fa-phone', title:'Call Us', desc:'(804) 555-BOOM', accent:'pink' },
              { icon:'fas fa-envelope', title:'Email Us', desc:'hello@bonairmedia.com', accent:'cyan' },
            ].map((c, i) => {
              const a = ACCENT_COLORS[c.accent];
              return (
                <div key={i} className="glass-card flex flex-col items-center text-center gap-4 p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${a.bg} flex items-center justify-center`}>
                    <i className={`${c.icon} text-2xl ${a.text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 orbitron text-sm">{c.title}</h3>
                    <p className="text-stone-400 text-sm">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="text-center mt-12">
            <h3 className="font-semibold text-lg mb-4 orbitron text-sm">Follow Us</h3>
            <div className="flex gap-4 justify-center">
              {[
                { icon:'fab fa-github', bg:'from-stone-700/20 to-stone-900/20', text:'text-stone-300', hover:'hover:bg-stone-700' },
                { icon:'fab fa-linkedin-in', bg:'from-blue-500/20 to-blue-700/20', text:'text-blue-400', hover:'hover:bg-blue-600' },
                { icon:'fab fa-instagram', bg:'from-pink-500/20 to-pink-700/20', text:'text-pink-400', hover:'hover:bg-pink-600' },
                { icon:'fab fa-facebook-f', bg:'from-blue-600/20 to-blue-800/20', text:'text-blue-500', hover:'hover:bg-blue-600' },
                { icon:'fab fa-youtube', bg:'from-red-500/20 to-red-700/20', text:'text-red-500', hover:'hover:bg-red-600' },
              ].map((s, i) => (
                <a key={i} href="#" className={`social-3d w-12 h-12 rounded-lg bg-gradient-to-br ${s.bg} flex items-center justify-center ${s.text} ${s.hover} hover:text-white transition-all`}>
                  <i className={`${s.icon} text-xl`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER (Desktop) ──────────────────── */}
      <footer className="py-12 bg-stone-950 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-700">
                <Image src="/logo-bw.webp" alt="Bon Air Media" fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="flex items-baseline gap-0">
                  <span className="logo-text-bon text-sm tracking-wider">BON&nbsp;</span>
                  <span className="logo-text-ai text-sm tracking-wider">AI</span>
                  <span className="logo-text-r text-sm tracking-wider">R</span>
                </span>
                <span className="logo-text-media text-[0.5rem]">MEDIA</span>
              </div>
            </div>
            <p className="text-stone-600 text-sm rajdhani">© 2025 Bon Air Media. All rights reserved.</p>
            <p className="text-stone-600 text-sm flex items-center gap-2 rajdhani">Made with <i className="fas fa-heart text-amber-500 animate-pulse" /> in Richmond, Virginia</p>
          </div>
        </div>
      </footer>

      {/* ──────────────────── MOBILE FOOTER BAR ──────────────────── */}
      <div className="mobile-footer-bar">
        <a href="#hero" onClick={e => nav(e,'#hero')} className={activeSection === 'hero' ? 'active' : ''}>
          <i className="fas fa-home footer-icon" /><span>Home</span>
        </a>
        <a href="#services" onClick={e => nav(e,'#services')} className={activeSection === 'services' ? 'active' : ''}>
          <i className="fas fa-th-large footer-icon" /><span>Services</span>
        </a>
        <a href="#about" onClick={e => nav(e,'#about')} className={activeSection === 'about' ? 'active' : ''}>
          <i className="fas fa-info-circle footer-icon" /><span>About</span>
        </a>
        <a href="#contact" onClick={e => nav(e,'#contact')} className={activeSection === 'contact' ? 'active' : ''}>
          <i className="fas fa-envelope footer-icon" /><span>Contact</span>
        </a>
        <button onClick={togglePanel} className={isPanelOpen ? 'active' : ''}>
          <i className={`fas ${isPanelOpen ? 'fa-times' : 'fa-bars'} footer-icon`} /><span>Menu</span>
        </button>
      </div>
    </>
  );
}
