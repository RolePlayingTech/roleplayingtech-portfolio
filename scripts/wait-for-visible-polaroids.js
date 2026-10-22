/*
 * Screenshot-only guard for review captures of RolePlayingTech.
 * Do not include this file in the public page or change site.js.
 *
 * Usage after scrolling to the frame you want to capture:
 *   Chrome CDP: Runtime.evaluate({ expression: FILE_CONTENT, awaitPromise: true, returnByValue: true })
 *   Browser console: paste file content and await the returned promise.
 *
 * Inspect result.ready before taking the screenshot. When false, keep the
 * screenshot but report result.failed instead of claiming the visual test passed.
 *
 * Why: travel polaroids are injected by site.js with loading="lazy".
 * A headless screenshot immediately after scrolling can capture a caption
 * while its corresponding image is still being downloaded or decoded.
 */
(async function waitForVisiblePolaroids() {
  const timeoutMs = 8000;

  const visibleImages = [...document.querySelectorAll('.bg-polaroid img')].filter((img) => {
    const host = img.closest('.bg-polaroid') || img;
    const style = getComputedStyle(host);
    if (style.display === 'none' || style.visibility === 'hidden') return false;

    const rect = host.getBoundingClientRect();
    return (
      rect.width > 0 && rect.height > 0 &&
      rect.right > 0 && rect.left < innerWidth &&
      rect.bottom > 0 && rect.top < innerHeight
    );
  });

  const checked = await Promise.all(visibleImages.map(async (img) => {
    // Only change loading priority in this review capture, not production code.
    img.loading = 'eager';
    const loaded = img.complete && img.naturalWidth > 0
      ? true
      : await Promise.race([
        img.decode().then(() => img.naturalWidth > 0).catch(() => false),
        new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs))
      ]);

    return {
      src: img.currentSrc || img.src,
      loaded: Boolean(loaded && img.complete && img.naturalWidth > 0)
    };
  }));

  return {
    ready: checked.every((item) => item.loaded),
    visible: checked.length,
    loaded: checked.filter((item) => item.loaded).length,
    failed: checked.filter((item) => !item.loaded).map((item) => item.src)
  };
})()
