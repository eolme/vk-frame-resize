const resizeFrame = (width: number, height: number) => {
  self.resizeTo(width, height);
  self.parent.postMessage({
    type: 'vk-connect',
    handler: 'VKWebAppResizeWindow',
    params: {
      width,
      height
    }
  }, '*');
};

const FIT = 'fit-content';
const HEIGHT = 'height';

/**
 * Observe content size with automatic frame resize to prevent internal scroll
 *
 * @param {number} [minHeight=500] -
 * @param {number} [width=630] -
 *
 * @returns {function} unobserve
 */
export const observeResize = (minHeight = 500, width = 630) => {
  // Set fit height
  const fitSize = `${HEIGHT}:intrinsic;${HEIGHT}:-webkit-${FIT};${HEIGHT}:-moz-${FIT};${HEIGHT}:${FIT};min-${HEIGHT}:${minHeight}px;`;

  const target = document.body;

  document.documentElement.style.cssText = fitSize;
  target.style.cssText = fitSize;

  // Observe with regard to fit height
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const height = Math.ceil(Math.max(minHeight, entry.target.scrollHeight || 0, entry.contentRect[HEIGHT] || 0));

    resizeFrame(width, height);
  });

  observer.observe(target);

  return () => {
    observer.disconnect();
  };
};
