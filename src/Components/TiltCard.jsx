import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * TiltCard - A customizable 3D tilt card component using Framer Motion.
 * 
 * @param {object} props
 * @param {number} props.maxTilt - Maximum tilt angle in degrees (default: 20)
 * @param {boolean} props.reverse - Reverse tilt direction (default: true, like react-parallax-tilt)
 * @param {boolean} props.glare - Show glare effect (default: false)
 * @param {string} props.className - Additional class names
 * @param {React.ReactNode} props.children - Card content
 */
const TiltCard = ({
  children,
  className = '',
  maxTilt = 20,
  reverse = true,
  glare = false,
  ...rest
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // For glare effect
  const glareRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    // Calculate tilt values
    const tiltX = (reverse ? 1 : -1) * (maxTilt * (yPercent - 0.5) * 2);
    const tiltY = (reverse ? -1 : 1) * (maxTilt * (xPercent - 0.5) * 2);

    x.set(tiltX);
    y.set(tiltY);

    // Glare effect (optional)
    if (glare && glareRef.current) {
      const angle = Math.atan2(
        e.clientY - (rect.top + rect.height / 2),
        e.clientX - (rect.left + rect.width / 2)
      ) * (180 / Math.PI) + 180;
      glareRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 80%)`;
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (glare && glareRef.current) {
      glareRef.current.style.background = 'none';
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative will-change-transform ${className}`}
      style={{
        rotateX: useSpring(x, { stiffness: 200, damping: 15 }),
        rotateY: useSpring(y, { stiffness: 200, damping: 15 }),
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{
            background: 'none',
            mixBlendMode: 'lighten',
            transition: 'background 0.2s',
          }}
        />
      )}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
};

export default TiltCard;
