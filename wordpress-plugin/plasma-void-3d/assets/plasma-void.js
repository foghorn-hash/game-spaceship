/**
 * Plasma Void 3D - WordPress Plugin JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  const fsButtons = document.querySelectorAll('.plasma-void-fs-btn');

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
