import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

const PORTAL_BG =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779707217/image_1_vdzwae.png';
const CURTAIN_LEFT =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706559/curtain_left_znkmva.png';
const CURTAIN_RIGHT =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706564/curtain_right_paeyym.png';
const WORLD_BG =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706392/image_2_gkcdlx.png';
const BOTTOM_CLOUDS =
  'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706555/bottom_clouds_xskut6.png';

const CARD_IMAGES = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260525_160507_2ccbb4eb-1469-484f-af25-59168ad9a233.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260525_160644_072a7f68-a101-4ded-a332-7d37707dbdd1.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260525_160706_1c153d04-0dfb-4ac9-a4ef-e74f301c329c.png&w=1280&q=85'
];

const ARC_CARDS = [
  { title: 'Hidden Realms', desc: 'Luminous sanctuaries unseen by wandering eyes', color: '#f3cdd6' },
  { title: 'Wild Solitudes', desc: 'Dissolve into untamed horizons and deep calm', color: '#dcedc2' },
  { title: 'Silent Havens', desc: 'Remote escapes far beyond ordinary reach', color: '#c3e3f4' },
  { title: 'Bespoke Quests', desc: 'Journeys shaped around your vision and soul', color: '#f0e4c0' },
  { title: 'Vivid Drifts', desc: 'Surreal passages through breathtaking terrain', color: '#dcd2f2' },
  { title: 'Mystic Crests', desc: 'Timeless ridgelines wrapped in cloud and myth', color: '#f3cdd6' },
  { title: 'Deep Currents', desc: 'Glowing depths alive with uncharted wonder', color: '#c3e3f4' },
  { title: 'Gilded Dusk', desc: 'Amber horizons that stretch past all reason', color: '#f0e4c0' },
  { title: 'Glassy Tides', desc: 'Calm waters holding skies of pure stillness', color: '#dcedc2' }
];

type ArcCard = (typeof ARC_CARDS)[number];

const MAG = {
  world: 6,
  clouds: 9,
  portal: 7,
  curtainL: 14,
  curtainR: 14
};

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function StarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 4.06 2.09-6.42L4.96 8.42h6.95L14 2z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="14" cy="24" r="1.5" fill="white" opacity="0.6" />
      <circle cx="6" cy="6" r="1" fill="white" opacity="0.4" />
      <circle cx="22" cy="6" r="1" fill="white" opacity="0.4" />
    </svg>
  );
}

function PlayIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <path d="M3 1.7v6.6L8 5 3 1.7z" fill="#351606" />
    </svg>
  );
}

function ScrollChevron() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.5)',
        display: 'grid',
        placeItems: 'center',
        animation: 'bobUp 1.8s ease-in-out infinite'
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path
          d="M3 5l4 4 4-4"
          fill="none"
          stroke="rgba(255,255,255,0.78)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function NavLink({ children, size = 12 }: { children: string; size?: number }) {
  return (
    <a
      href="#"
      style={{
        fontFamily: "'Imprima', sans-serif",
        fontSize: size,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#fff',
        opacity: 0.9,
        textDecoration: 'none'
      }}
    >
      {children}
    </a>
  );
}

function Navigation({ isMobile }: { isMobile: boolean }) {
  return (
    <nav
      style={{
        position: 'absolute',
        zIndex: 50,
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '18px 20px' : '22px 48px',
        pointerEvents: 'auto'
      }}
    >
      <div className="flex md:hidden" style={{ alignItems: 'center' }}>
        <NavLink size={11}>Explore</NavLink>
      </div>
      <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
        <NavLink>Worlds</NavLink>
        <NavLink>Atelier</NavLink>
        <NavLink>Immersions</NavLink>
      </div>

      <div
        style={{
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? 'auto' : '50%',
          top: isMobile ? 'auto' : 22,
          transform: isMobile ? 'none' : 'translateX(-50%)',
          width: 28,
          height: 28
        }}
      >
        <StarLogo />
      </div>

      <div className="flex md:hidden" style={{ alignItems: 'center' }}>
        <NavLink size={11}>Connect</NavLink>
      </div>
      <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
        <NavLink>Craft</NavLink>
        <NavLink>Codex</NavLink>
        <NavLink>Connect</NavLink>
      </div>
    </nav>
  );
}

function HeroHeading({
  color,
  desktop
}: {
  color: string;
  desktop?: boolean;
}) {
  return (
    <div
      style={{
        fontFamily: "'Viaoda Libre', serif",
        color,
        textAlign: desktop ? 'left' : 'center',
        textShadow: desktop
          ? '0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)'
          : 'none'
      }}
    >
      <div
        style={{
          fontSize: desktop ? 'clamp(32px, 4.5vw, 54px)' : 'clamp(26px, 7vw, 42px)',
          lineHeight: desktop ? 1.1 : 1,
          letterSpacing: desktop ? '0.04em' : '0.12em'
        }}
      >
        FALL{' '}
        <span style={{ color: desktop ? 'rgba(255,220,180,0.7)' : '#6b2e0e', fontSize: '0.8em' }}>
          &gt;
        </span>{' '}
        <em style={{ fontStyle: 'italic' }}>INTO</em>
      </div>
      <div
        style={{
          fontSize: desktop ? 'clamp(50px, 7.5vw, 88px)' : 'clamp(52px, 16vw, 80px)',
          lineHeight: desktop ? 0.9 : 0.86,
          letterSpacing: desktop ? '0' : '0.01em'
        }}
      >
        REVERIE
      </div>
    </div>
  );
}

function HeroCopy({ desktop, maxWidth }: { desktop?: boolean; maxWidth: number }) {
  return (
    <p
      style={{
        margin: desktop ? '22px 0 0' : '18px auto 0',
        maxWidth,
        color: desktop ? 'rgba(255,245,235,0.88)' : '#5c2d0e',
        fontSize: desktop ? 18 : 15,
        lineHeight: desktop ? 1.7 : 1.65,
        textAlign: desktop ? 'left' : 'center',
        textShadow: desktop ? '0 1px 12px rgba(0,0,0,0.8)' : 'none'
      }}
    >
      Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
    </p>
  );
}

function MediaCard({
  image,
  mode = 'play',
  compact = false
}: {
  image: string;
  mode?: 'play' | 'number';
  compact?: boolean;
}) {
  const size = compact ? 140 : 158;
  const radius = compact ? 22 : 28;
  const circle = compact ? 26 : 30;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: radius,
        overflow: 'hidden',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: compact ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.45)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '60%',
          background:
            'linear-gradient(to top, rgba(12,5,8,0.88) 0%, rgba(41,16,10,0.44) 56%, transparent 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '44%',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: compact ? 12 : 14,
          bottom: compact ? 12 : 14,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          color: '#fff'
        }}
      >
        {mode === 'play' ? (
          <>
            <span
              style={{
                width: circle,
                height: circle,
                borderRadius: '50%',
                background: '#fff',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <PlayIcon size={compact ? 10 : 12} />
            </span>
            <span style={{ fontSize: compact ? 13 : 18, lineHeight: 1 }}>View Reel</span>
          </>
        ) : (
          <div style={{ color: '#fff' }}>
            <div
              style={{
                fontFamily: "'Viaoda Libre', serif",
                fontSize: compact ? 28 : 36,
                lineHeight: 0.86
              }}
            >
              32
            </div>
            <div style={{ fontSize: compact ? 13 : 18, marginTop: 5, lineHeight: 1.05 }}>
              World Patrons
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FadeIn({
  children,
  visible,
  delay,
  y = 18,
  style
}: {
  children: ReactNode;
  visible: boolean;
  delay: string;
  y?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.9s ease ${delay}, transform 0.9s ease ${delay}`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function SliderDots({ visible, desktop }: { visible: boolean; desktop?: boolean }) {
  return (
    <FadeIn
      visible={visible}
      delay="0.8s"
      y={10}
      style={{
        position: 'absolute',
        zIndex: 20,
        bottom: desktop ? 40 : 28,
        left: desktop ? 60 : '50%',
        transform: visible
          ? desktop
            ? 'translateY(0)'
            : 'translate(-50%, 0)'
          : desktop
            ? 'translateY(10px)'
            : 'translate(-50%, 10px)',
        display: 'flex',
        gap: 8
      }}
    >
      {[0, 1, 2, 3].map((dot) => (
        <span
          key={dot}
          style={{
            display: 'block',
            width: dot === 0 ? 28 : 14,
            height: 4,
            borderRadius: 2,
            background: dot === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'
          }}
        />
      ))}
    </FadeIn>
  );
}

function SceneOne({ opacity, uiVisible }: { opacity: number; uiVisible: boolean }) {
  return (
    <section style={{ position: 'absolute', inset: 0, zIndex: 20, opacity, pointerEvents: 'none' }}>
      <div
        className="flex md:hidden"
        style={{
          height: '100%',
          padding: '80px 24px 100px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FadeIn visible={uiVisible} delay="0.3s">
          <HeroHeading color="#3b1a0a" />
          <HeroCopy maxWidth={280} />
        </FadeIn>
        <FadeIn visible={uiVisible} delay="0.55s" style={{ marginTop: 26 }}>
          <MediaCard image={CARD_IMAGES[0]} compact />
        </FadeIn>
      </div>

      <div
        className="hidden md:flex xl:hidden"
        style={{
          height: '100%',
          padding: '80px 32px 96px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28
        }}
      >
        <FadeIn visible={uiVisible} delay="0.3s">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Viaoda Libre', serif",
                color: '#3b1a0a'
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 5vw, 44px)',
                  lineHeight: 1,
                  letterSpacing: '0.12em'
                }}
              >
                FALL <span style={{ color: '#6b2e0e', fontSize: '0.8em' }}>&gt;</span>{' '}
                <em style={{ fontStyle: 'italic' }}>INTO</em>
              </div>
              <div
                style={{
                  fontSize: 'clamp(60px, 12vw, 86px)',
                  lineHeight: 0.86,
                  letterSpacing: '0.01em'
                }}
              >
                REVERIE
              </div>
            </div>
            <p
              style={{
                margin: '18px auto 0',
                maxWidth: 400,
                color: '#5c2d0e',
                fontSize: 16,
                lineHeight: 1.65,
                textAlign: 'center'
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth
              dissolves.
            </p>
          </div>
        </FadeIn>
        <FadeIn visible={uiVisible} delay="0.55s">
          <div style={{ display: 'flex', gap: 14 }}>
            <MediaCard image={CARD_IMAGES[0]} compact />
            <MediaCard image={CARD_IMAGES[1]} mode="number" compact />
            <MediaCard image={CARD_IMAGES[2]} compact />
          </div>
        </FadeIn>
      </div>

      <div className="hidden xl:block">
        <FadeIn
          visible={uiVisible}
          delay="0.3s"
          style={{
            position: 'absolute',
            top: '46%',
            left: 60,
            maxWidth: 440,
            transform: uiVisible ? 'translateY(-50%)' : 'translateY(calc(-50% + 18px))'
          }}
        >
          <HeroHeading color="#fff" desktop />
          <HeroCopy desktop maxWidth={300} />
        </FadeIn>
        <FadeIn
          visible={uiVisible}
          delay="0.55s"
          style={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: uiVisible ? 'translateY(-50%)' : 'translateY(calc(-50% + 18px))'
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <MediaCard image={CARD_IMAGES[0]} />
            <MediaCard image={CARD_IMAGES[1]} mode="number" />
            <MediaCard image={CARD_IMAGES[2]} />
          </div>
        </FadeIn>
      </div>

      <div className="md:hidden">
        <SliderDots visible={uiVisible} />
      </div>
      <div className="hidden md:block xl:hidden">
        <SliderDots visible={uiVisible} />
      </div>
      <div className="hidden xl:block">
        <SliderDots visible={uiVisible} desktop />
        <FadeIn
          visible={uiVisible}
          delay="0.9s"
          y={12}
          style={{
            position: 'absolute',
            zIndex: 20,
            bottom: 36,
            left: '50%',
            transform: uiVisible ? 'translate(-50%, 0)' : 'translate(-50%, 12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 9
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)'
            }}
          >
            DESCEND
          </span>
          <ScrollChevron />
        </FadeIn>
      </div>
    </section>
  );
}

function SceneTwo({ opacity, isMobile }: { opacity: number; isMobile: boolean }) {
  return (
    <section
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 46,
        opacity,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '0 24px' : '0 48px'
      }}
    >
      <div style={{ marginTop: isMobile ? '8vh' : '12vh' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "'Viaoda Libre', serif",
            fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(38px, 6.5vw, 78px)',
            color: '#fff',
            letterSpacing: '0.03em',
            lineHeight: 1.05,
            fontWeight: 400,
            textShadow: '0 2px 20px rgba(0,0,0,0.4)'
          }}
        >
          FORGE BEYOND THE REAL
        </h1>
        <p
          style={{
            margin: '16px auto 0',
            fontSize: isMobile ? 14 : 20,
            lineHeight: 1.6,
            letterSpacing: 0,
            maxWidth: isMobile ? 260 : 480,
            color: 'rgba(255,255,255,0.82)'
          }}
        >
          Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the
          ordinary and the known.
        </p>
      </div>
    </section>
  );
}

function ArcCardSlider({
  cards,
  rotationOffset,
  isMobile
}: {
  cards: ArcCard[];
  rotationOffset: number;
  isMobile: boolean;
}) {
  const totalCards = cards.length;
  const cardSpacingDeg = isMobile ? 12 : 9;
  const centerIndex = Math.floor(totalCards / 2);
  const arcRadius = isMobile ? 700 : 1100;
  const cardW = isMobile ? 160 : 220;
  const cardH = isMobile ? 175 : 230;
  const sliderH = isMobile ? 260 : 360;
  const lift = isMobile ? 140 : 200;

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: sliderH,
        overflow: 'visible'
      }}
    >
      {cards.map((card, i) => {
        const baseDeg = (i - centerIndex) * cardSpacingDeg;
        const deg = baseDeg - rotationOffset + centerIndex * cardSpacingDeg;
        const rad = (deg * Math.PI) / 180;
        const x = Math.sin(rad) * arcRadius;
        const y = arcRadius - Math.cos(rad) * arcRadius;

        return (
          <article
            key={card.title}
            style={{
              position: 'absolute',
              bottom: -y + lift,
              left: `calc(50% + ${x}px - ${cardW / 2}px)`,
              width: cardW,
              height: cardH,
              transform: `rotate(${deg}deg)`,
              transformOrigin: `${cardW / 2}px ${arcRadius}px`,
              borderRadius: isMobile ? 18 : 26,
              background: card.color,
              boxShadow: '0 8px 40px rgba(80,40,60,0.18)',
              padding: isMobile ? 16 : 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 32% 18%, rgba(255,255,255,0.65), transparent 32%), linear-gradient(150deg, rgba(255,255,255,0.3), transparent 56%)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: isMobile ? 14 : 18,
                right: isMobile ? 14 : 18,
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '1.5px solid rgba(80,50,60,0.3)',
                color: 'rgba(80,50,60,0.6)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 10,
                lineHeight: 1,
                zIndex: 1
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Viaoda Libre', serif",
                  fontSize: isMobile ? 22 : 30,
                  lineHeight: 1,
                  color: '#3a2530',
                  fontWeight: 400
                }}
              >
                {card.title}
              </h2>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: isMobile ? 12 : 15,
                  lineHeight: 1.35,
                  color: 'rgba(58,37,48,0.65)'
                }}
              >
                {card.desc}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const curtainLRef = useRef<HTMLDivElement>(null);
  const curtainRRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const openTimer = window.setTimeout(() => setCurtainsOpen(true), 100);
    const uiTimer = window.setTimeout(() => setUiVisible(true), 600);
    const doneTimer = window.setTimeout(() => setEntranceDone(true), 2200);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(uiTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const maxScroll = Math.max(container.scrollHeight - window.innerHeight, 1);
      setScrollProgress(clamp(window.scrollY / maxScroll, 0, 1));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMouse({ x: 0, y: 0 });
      return;
    }

    const raw = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let frame = 0;

    const onMouseMove = (event: MouseEvent) => {
      raw.x = (event.clientX / window.innerWidth - 0.5) * 2;
      raw.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      smooth.x = lerp(smooth.x, raw.x, 0.07);
      smooth.y = lerp(smooth.y, raw.y, 0.07);
      setMouse({ x: smooth.x, y: smooth.y });
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.cancelAnimationFrame(frame);
    };
  }, [isMobile]);

  const ep = easeInOut(scrollProgress);
  const scene1Opacity = clamp(1 - scrollProgress / 0.22, 0, 1);
  const scene2Opacity = clamp((scrollProgress - 0.68) / 0.16, 0, 1);
  const portalOpacity = scrollProgress <= 0.65 ? 1 : clamp(1 - (scrollProgress - 0.65) / 0.2, 0, 1);
  const cloudOpacity = lerp(0.7, 1, clamp(scrollProgress / 0.05, 0, 1));
  const arcSweepDeg = (ARC_CARDS.length - 1) * 10;
  const rotationOffset = lerp(0, arcSweepDeg, clamp((scrollProgress - 0.7) / 0.3, 0, 1));

  const transforms = useMemo(() => {
    const offset = (mag: number, yFactor = 1) =>
      `translate3d(${-mouse.x * mag}px, ${-mouse.y * mag * yFactor}px, 0)`;

    const curtainBase = curtainsOpen ? 62 : 0;
    const curtainScroll = lerp(0, 150, ep);
    const curtainScale = lerp(1, 1.3, ep);

    return {
      world: `${offset(MAG.world)} scale(${lerp(1, 1.18, ep)})`,
      clouds: `${offset(MAG.clouds, 0.4)} scale(${lerp(1, 1.4, ep)})`,
      portal: `${offset(MAG.portal)} scale(${lerp(1, 7.5, ep)})`,
      curtainL: `${offset(MAG.curtainL, 0.3)} translateX(-${curtainBase + curtainScroll}%) scale(${curtainScale})`,
      curtainR: `${offset(MAG.curtainR, 0.3)} translateX(${curtainBase + curtainScroll}%) scale(${curtainScale})`
    };
  }, [curtainsOpen, ep, mouse.x, mouse.y]);

  const imageLayer = (url: string, objectPosition = 'center'): CSSProperties => ({
    width: '100%',
    height: '100%',
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: objectPosition,
    backgroundRepeat: 'no-repeat'
  });

  return (
    <main ref={containerRef} style={{ height: '480vh', position: 'relative', background: '#0a0608' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#0a0608'
        }}
      >
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 50%',
            transform: transforms.world,
            willChange: 'transform'
          }}
        >
          <div style={imageLayer(WORLD_BG)} />
        </div>

        <div
          style={{
            position: 'absolute',
            zIndex: 9,
            bottom: isMobile ? 60 : 80,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: scene2Opacity,
            pointerEvents: 'none'
          }}
        >
          <ArcCardSlider cards={ARC_CARDS} rotationOffset={rotationOffset} isMobile={isMobile} />
        </div>

        <div
          ref={cloudsRef}
          style={{
            position: 'absolute',
            zIndex: 10,
            bottom: 0,
            left: 0,
            right: 0,
            transformOrigin: '50% 100%',
            transform: transforms.clouds,
            opacity: cloudOpacity,
            willChange: 'transform'
          }}
        >
          <img
            src={BOTTOM_CLOUDS}
            alt=""
            style={{ display: 'block', width: '100%', height: 'auto', userSelect: 'none' }}
          />
        </div>

        <div
          ref={portalRef}
          style={{
            position: 'absolute',
            zIndex: 15,
            inset: 0,
            transformOrigin: '52% 38%',
            transform: transforms.portal,
            opacity: portalOpacity,
            willChange: 'transform, opacity'
          }}
        >
          <div style={imageLayer(PORTAL_BG)} />
        </div>

        <div
          style={{
            position: 'absolute',
            zIndex: 16,
            left: 0,
            right: 0,
            bottom: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        <div
          ref={curtainLRef}
          style={{
            position: 'absolute',
            zIndex: 16,
            inset: 0,
            transformOrigin: 'left center',
            transform: transforms.curtainL,
            transition: entranceDone ? 'none' : 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform'
          }}
        >
          <div style={imageLayer(CURTAIN_LEFT, 'right center')} />
        </div>

        <div
          ref={curtainRRef}
          style={{
            position: 'absolute',
            zIndex: 16,
            inset: 0,
            transformOrigin: 'right center',
            transform: transforms.curtainR,
            transition: entranceDone ? 'none' : 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform'
          }}
        >
          <div style={imageLayer(CURTAIN_RIGHT, 'left center')} />
        </div>

        <SceneOne opacity={scene1Opacity} uiVisible={uiVisible} />
        <SceneTwo opacity={scene2Opacity} isMobile={isMobile} />

        <div
          style={{
            position: 'absolute',
            zIndex: 45,
            left: 0,
            right: 0,
            top: 0,
            height: '42vh',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        <Navigation isMobile={isMobile} />
      </div>
    </main>
  );
}



