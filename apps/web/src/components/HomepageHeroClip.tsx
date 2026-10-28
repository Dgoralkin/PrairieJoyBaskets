import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
};

export default function HomepageHeroClip({ className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = false;

    const updatePlayback = () => {
      if (reducedMotion.matches || !isVisible) {
        video.pause();
        return;
      }

      void video.play().catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'NotAllowedError')) {
          console.error('Unable to play the homepage hero video:', error);
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    reducedMotion.addEventListener('change', updatePlayback);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', updatePlayback);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-[1280/666] w-full overflow-hidden shadow-2xl ring-4 ring-white">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/homepage_hero/hero12-captioned-poster.jpg"
          aria-label="Hands selecting local goods, packing and tying a Prairie Joy Baskets gift box"
        >
          <source
            media="(max-width: 640px)"
            src="/homepage_hero/hero12-captioned-720.mp4"
            type="video/mp4"
          />
          <source
            src="/homepage_hero/hero12-captioned-1280.webm"
            type="video/webm"
          />
          <source
            src="/homepage_hero/hero12-captioned-1280.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
}
