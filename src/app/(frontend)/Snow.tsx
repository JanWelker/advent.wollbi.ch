// The Pelican template drew eight snowflakes with inline styles. Same eight,
// same drift, but the positions and timings are data rather than markup.
const FLAKES = [
  { left: '20%', duration: '10s', delay: '0s' },
  { left: '40%', duration: '12s', delay: '2s' },
  { left: '60%', duration: '15s', delay: '4s' },
  { left: '80%', duration: '11s', delay: '1s' },
  { left: '30%', duration: '13s', delay: '3s' },
  { left: '70%', duration: '14s', delay: '5s' },
  { left: '50%', duration: '16s', delay: '0s' },
  { left: '90%', duration: '9s', delay: '2s' },
]

export const Snow = () => (
  <div aria-hidden="true">
    {FLAKES.map((flake, i) => (
      <span
        key={i}
        className="snowflake"
        style={{ left: flake.left, animationDuration: flake.duration, animationDelay: flake.delay }}
      >
        ❄
      </span>
    ))}
  </div>
)
