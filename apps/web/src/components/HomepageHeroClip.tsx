// This component is used to display the hero video on the homepage.
// It automatically handles autoplay, looping, and pausing based on user preferences and visibility. The video sources are provided in multiple formats for compatibility across different browsers.
// Files: hero-1280.webm  hero-1280.mp4  hero-720.mp4  hero-poster.jpg from the /public/homepage_hero/ directory.

import { useEffect, useRef, type ReactNode } from 'react';

type Props = { className?: string; children?: ReactNode; variant?: 'captioned' | 'clean' };

export default function HeroVideo({ className = '', children, variant = 'captioned' }: Props) {
  const base = variant === 'captioned' ? '/media/hero12-captioned' : '/media/hero12';
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Respect "reduce motion": show the poster and don't play.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => (reduce.matches ? v.pause() : v.play().catch(() => {}));
    apply();
    reduce.addEventListener('change', apply);

    // Save battery/bandwidth: only play while the video is on screen.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting && !reduce.matches ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.25 },
    );
    io.observe(v);

    return () => {
      reduce.removeEventListener('change', apply);
      io.disconnect();
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-[1280/666] w-full overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        autoPlay
        muted          // required for autoplay in all browsers
        loop
        playsInline    // required for autoplay on iOS
        preload="auto"
        poster={`./homepage_hero/hero12-captioned-poster.jpg`}
        aria-label="Hands selecting local goods, packing and tying a Prairie Joy Baskets gift box"
      >
        <source media="(max-width: 640px)" src={`./homepage_hero/hero12-captioned-720.mp4`} type="video/mp4" />
        <source src={`./homepage_hero/hero12-captioned-1280.webm`} type="video/webm" />
        <source src={`./homepage_hero/hero12-captioned-1280.mp4`} type="video/mp4" />
      </video>
      </div>
      {children /* e.g. your "4.9 ★ Over 1,200+ Delivered" badge, positioned absolutely; may overhang the edge */}
    </div>
  );
}
