export function placementFor(link) {
  if (link.classList.contains('mobile-call-bar')) return 'mobile_sticky';
  if (link.closest('.nav-mobile')) return 'mobile_navigation';
  if (link.closest('.nav')) return 'header';
  if (link.closest('.hero, .service-hero')) return 'hero';
  if (link.closest('.service-cta')) return 'service_cta';
  if (link.closest('.booking-callout')) return 'booking';
  if (link.closest('.contact-info-section')) return 'contact_details';
  if (link.closest('.footer')) return 'footer';
  return 'content';
}

export function buildConversionDetail({ href, isMapLink, placement, pagePath }) {
  const interactionType = href.startsWith('tel:')
    ? 'phone_click'
    : isMapLink
      ? 'directions_click'
      : 'instagram_click';
  const phoneLine = href.includes('0983181262')
    ? 'mobile_098'
    : href.includes('0617875511')
      ? 'landline_061'
      : undefined;

  return {
    event: 'status_conversion_intent',
    interaction_type: interactionType,
    placement,
    page_path: pagePath,
    ...(phoneLine ? { phone_line: phoneLine } : {})
  };
}

export function installConversionTracking(doc = document, browserWindow = window) {
  const trackedLinks = doc.querySelectorAll(
    'a[href^="tel:"], a.map-link, a[href*="instagram.com/status_dent_zp"]'
  );

  trackedLinks.forEach((link) => link.addEventListener('click', () => {
    const detail = buildConversionDetail({
      href: link.getAttribute('href') || '',
      isMapLink: link.classList.contains('map-link'),
      placement: placementFor(link),
      pagePath: browserWindow.location.pathname
    });

    browserWindow.dispatchEvent(new CustomEvent('status:conversion-intent', { detail }));
    if (Array.isArray(browserWindow.dataLayer)) browserWindow.dataLayer.push(detail);
  }));
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  installConversionTracking();
}
