/**
 * Centralized helper for Heal & Play supporter display name resolution.
 * Automatically trims, normalizes, and capitalizes names (e.g., "   rahul kumar   " -> "Rahul Kumar").
 */

export function capitalizeName(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .split(' ')
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(' ');
}

export function getSupporterDisplayName(user, manualName) {
  // 1. Manual entered name (either passed directly, or loaded from cache keys)
  let name = manualName || localStorage.getItem('hp_supporter_name') || localStorage.getItem('hp_user_name');
  if (name && name.trim()) {
    return capitalizeName(name);
  }

  // 2. Google account display name
  if (user?.displayName && user.displayName.trim()) {
    return capitalizeName(user.displayName);
  }

  // 3. Email username fallback
  const email = user?.email || localStorage.getItem('hp_user_email') || localStorage.getItem('hp_supporter_email');
  if (email && email.includes('@')) {
    const username = email.split('@')[0];
    if (username && username.trim()) {
      return capitalizeName(username);
    }
  }

  // 4. Anonymous Supporter fallback
  return 'Anonymous Supporter';
}
