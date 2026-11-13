export default function Foto({ src, className = "foto" }) {
  return <img className={className} src={src} alt="" loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />;
}
