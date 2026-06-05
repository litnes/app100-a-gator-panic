export function BushSvg() {
  return (
    <svg
      viewBox="0 0 110 70"
      width="110"
      height="70"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Back foliage — center */}
      <ellipse cx="55" cy="30" rx="44" ry="26" fill="#3a8c28" />
      {/* Left cluster */}
      <ellipse cx="26" cy="42" rx="30" ry="23" fill="#2d7a1f" />
      {/* Right cluster */}
      <ellipse cx="84" cy="42" rx="30" ry="23" fill="#2d7a1f" />
      {/* Front center — brightest */}
      <ellipse cx="55" cy="52" rx="32" ry="20" fill="#4aab35" />
      {/* Highlights */}
      <ellipse cx="40" cy="46" rx="9"  ry="5"  fill="#6ac94e" opacity="0.65" />
      <ellipse cx="70" cy="46" rx="9"  ry="5"  fill="#6ac94e" opacity="0.65" />
      <ellipse cx="55" cy="38" rx="7"  ry="4"  fill="#6ac94e" opacity="0.45" />
      {/* Dark shadow at the base / hole opening */}
      <ellipse cx="55" cy="68" rx="22" ry="6"  fill="#1a5010" opacity="0.5" />
    </svg>
  );
}
