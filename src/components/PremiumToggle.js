// src/components/PremiumToggle.js

export default function PremiumToggle({ isPremium, onToggle }) {
  return (
    <button
    disabled
      onClick={onToggle}
      className={`px-3 py-1 rounded transition text-white font-semibold
      ${isPremium ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
    >
      {isPremium ? 'Premium' : 'Standard'}
    </button>
  );
}
