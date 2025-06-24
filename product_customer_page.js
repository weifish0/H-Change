// 一粒米的旅程時間軸動畫模組
document.addEventListener('DOMContentLoaded', function () {
  const steps = Array.from(document.querySelectorAll('.rice-journey-step'));
  const stepsWrapper = document.querySelector('.rice-journey-steps');
  const leftBtn = document.querySelector('.rice-journey-arrow.left');
  const rightBtn = document.querySelector('.rice-journey-arrow.right');
  let current = 0;

  function updateSteps() {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === current);
    });
    // 滾動動畫
    const stepWidth = steps[0].offsetWidth + 32; // gap
    stepsWrapper.style.transform = `translateX(${-current * stepWidth}px)`;
    // 按鈕狀態
    leftBtn.disabled = current === 0;
    rightBtn.disabled = current === steps.length - 1;
  }

  leftBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      updateSteps();
    }
  });
  rightBtn.addEventListener('click', () => {
    if (current < steps.length - 1) {
      current++;
      updateSteps();
    }
  });

  // 手機滑動支援
  let startX = 0, deltaX = 0;
  stepsWrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  stepsWrapper.addEventListener('touchmove', e => {
    deltaX = e.touches[0].clientX - startX;
  });
  stepsWrapper.addEventListener('touchend', () => {
    if (deltaX < -30 && current < steps.length - 1) {
      current++;
      updateSteps();
    } else if (deltaX > 30 && current > 0) {
      current--;
      updateSteps();
    }
    deltaX = 0;
  });

  updateSteps();
}); 