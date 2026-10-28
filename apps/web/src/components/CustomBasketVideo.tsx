// CustomBasketVideo component for displaying the promotional video in the custom basket builder
export default function CustomBasketVideo({ className = '' }: { className?: string }) {
  return (
    <video
      className={`aspect-video w-full rounded-xl object-cover shadow-md ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/custom_basket_clip/prairie-joy-baskets-poster.jpg"
      aria-label="How Prairie Joy baskets are collected, assembled and delivered"
    >
      <source src="/custom_basket_clip/prairie-joy-baskets-promo.webm" type="video/webm" />
      <source src="/custom_basket_clip/prairie-joy-baskets-promo.mp4" type="video/mp4" />
    </video>
  );
}
