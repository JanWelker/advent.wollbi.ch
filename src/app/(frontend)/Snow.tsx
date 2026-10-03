// The Pelican template drew eight snowflakes with inline styles. Same eight,
// same drift, now soft dots that read as snow against the night sky, and
// still for anyone who asked for less motion.
const FLAKES = [
  { left: '20%', size: 6, duration: '10s', delay: '0s' },
  { left: '40%', size: 4, duration: '12s', delay: '2s' },
  { left: '60%', size: 5, duration: '15s', delay: '4s' },
  { left: '80%', size: 7, duration: '11s', delay: '1s' },
  { left: '30%', size: 4, duration: '13s', delay: '3s' },
  { left: '70%', size: 6, duration: '14s', delay: '5s' },
  { left: '50%', size: 5, duration: '16s', delay: '0s' },
  { left: '90%', size: 4, duration: '9s', delay: '2s' },
]

export const Snow = () => (
  <div className="snow" aria-hidden="true">
    {FLAKES.map((flake, i) => (
      <span
        key={i}
        className="snowflake"
        style={{
          left: flake.left,
          width: flake.size,
          height: flake.size,
          animationDuration: flake.duration,
          animationDelay: flake.delay,
        }}
      />
    ))}
  </div>
)
