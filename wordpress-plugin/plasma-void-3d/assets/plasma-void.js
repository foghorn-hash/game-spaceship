/**
 * Plasma Void 3D - WordPress Plugin JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  const fsButtons = document.querySelectorAll('.plasma-void-fs-btn');
  const wrappers = document.querySelectorAll('.plasma-void-wrapper');

  // 1. Prevent parent WordPress page from scrolling when hovering/playing game with Space or Arrow keys
  let isGameHovered = false;

  wrappers.forEach(function (wrapper) {
    wrapper.addEventListener('mouseenter', function () {
      isGameHovered = true;
    });
    wrapper.addEventListener('mouseleave', function () {
      isGameHovered = false;
    });
  });

  window.addEventListener(
    'keydown',
    function (e) {
      const activeEl = document.activeElement;
      const isIframeActive = activeEl && activeEl.classList && activeEl.classList.contains('plasma-void-iframe');

      if (isGameHovered || isIframeActive) {
        if (
          e.code === 'Space' ||
          e.key === ' ' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight'
        ) {
          e.preventDefault();
        }
      }
    },
    { passive: false }
  );

  // 2. Fullscreen toggling
  fsButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const container = document.getElementById(targetId);

      if (!container) return;

      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });
  });

  document.addEventListener('fullscreenchange', updateFsButtons);
  document.addEventListener('webkitfullscreenchange', updateFsButtons);

  function updateFsButtons() {
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    fsButtons.forEach(function (btn) {
      btn.textContent = isFs ? '✕ Poistu koko näytöstä' : '⛶ Koko näyttö';
    });
  }
});
