/**
 * Simple client-side fingerprinting utility for the MVP.
 * Generates a SHA-256 hash based on browser and device characteristics.
 */
export async function getFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'server';
  
  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen.colorDepth,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      // @ts-expect-error - deviceMemory is not in all browsers
      navigator.deviceMemory || 'unknown',
    ];
    
    const data = components.join('|');
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    // Fallback to a simpler fingerprint if crypto.subtle is not available
    return btoa(navigator.userAgent).slice(0, 32);
  }
}

/**
 * Sets the fingerprint as a cookie to be used by middleware.
 */
export async function setFingerprintCookie() {
  if (typeof window === 'undefined') return;
  
  const fingerprint = await getFingerprint();
  document.cookie = `x-fingerprint=${fingerprint}; path=/; max-age=31536000; SameSite=Lax`;
}
