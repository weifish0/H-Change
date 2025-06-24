// 一粒米的旅程時間軸動畫模組
document.addEventListener('DOMContentLoaded', function () {
  const steps = Array.from(document.querySelectorAll('.rice-journey-step'));
  const stepsWrapper = document.querySelector('.rice-journey-steps');
  const leftBtn = document.querySelector('.rice-journey-arrow.left');
  const rightBtn = document.querySelector('.rice-journey-arrow.right');
  const riceJourneySection = document.querySelector('.rice-journey-section');
  let current = 0;
  let isMobile = window.innerWidth <= 600;
  let isScrolling = false;
  let isFixed = false;
  let wheelHandler = null;
  let touchStartY = 0;

  function updateSteps() {
    if (isMobile) {
      // 手機版：顯示當前步驟，隱藏其他
      steps.forEach((step, idx) => {
        if (idx === current) {
          step.style.display = 'flex';
          step.classList.add('active');
        } else {
          step.style.display = 'none';
          step.classList.remove('active');
        }
      });
    } else {
      // 桌面版：保持原有水平滾動
      steps.forEach((step, idx) => {
        step.style.display = 'flex';
        step.classList.toggle('active', idx === current);
      });
      const stepWidth = steps[0].offsetWidth + 48; // gap
      stepsWrapper.style.transform = `translateX(${-current * stepWidth}px)`;
    }
    
    // 按鈕狀態
    leftBtn.disabled = current === 0;
    rightBtn.disabled = current === steps.length - 1;
  }

  function nextStep() {
    if (current < steps.length - 1) {
      current++;
      updateSteps();
      return true; // 成功切換
    }
    return false; // 已是最後一個
  }

  function prevStep() {
    if (current > 0) {
      current--;
      updateSteps();
      return true; // 成功切換
    }
    return false; // 已是第一個
  }

  leftBtn.addEventListener('click', () => {
    prevStep();
  });
  rightBtn.addEventListener('click', () => {
    nextStep();
  });

  // 處理 fixed 狀態下的 wheel/touchmove
  function enableFixedScrollControl() {
    if (wheelHandler) return;
    wheelHandler = function(e) {
      if (isScrolling) return;
      e.preventDefault();
      if (e.deltaY > 0) {
        // 向下
        if (current < steps.length - 1) {
          isScrolling = true;
          nextStep();
          setTimeout(() => { isScrolling = false; }, 400);
        } else {
          disableFixedScrollControl();
        }
      } else if (e.deltaY < 0) {
        // 向上
        if (current > 0) {
          isScrolling = true;
          prevStep();
          setTimeout(() => { isScrolling = false; }, 400);
        } else {
          disableFixedScrollControl();
        }
      }
    };
    riceJourneySection.addEventListener('wheel', wheelHandler, { passive: false });
    // 手機觸控
    riceJourneySection.addEventListener('touchstart', onTouchStart, { passive: false });
    riceJourneySection.addEventListener('touchmove', onTouchMove, { passive: false });
  }
  function disableFixedScrollControl() {
    if (!wheelHandler) return;
    riceJourneySection.removeEventListener('wheel', wheelHandler, { passive: false });
    riceJourneySection.removeEventListener('touchstart', onTouchStart, { passive: false });
    riceJourneySection.removeEventListener('touchmove', onTouchMove, { passive: false });
    wheelHandler = null;
    // 解除 fixed
    riceJourneySection.style.position = '';
    riceJourneySection.style.top = '';
    riceJourneySection.style.left = '';
    riceJourneySection.style.width = '';
    riceJourneySection.style.zIndex = '';
    document.body.style.overflow = '';
    isFixed = false;
  }
  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    if (isScrolling) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (Math.abs(deltaY) < 30) return;
    e.preventDefault();
    if (deltaY < 0) {
      // 向上滑（實際是往下捲）
      if (current < steps.length - 1) {
        isScrolling = true;
        nextStep();
        setTimeout(() => { isScrolling = false; }, 400);
      } else {
        disableFixedScrollControl();
      }
    } else if (deltaY > 0) {
      // 向下滑（實際是往上捲）
      if (current > 0) {
        isScrolling = true;
        prevStep();
        setTimeout(() => { isScrolling = false; }, 400);
      } else {
        disableFixedScrollControl();
      }
    }
  }

  // 滾動監聽
  function handleScroll() {
    if (isScrolling || isFixed) return;
    const sectionRect = riceJourneySection.getBoundingClientRect();
    const sectionHeight = sectionRect.height;
    const windowHeight = window.innerHeight;
    const sectionCenter = sectionRect.top + sectionHeight / 2;
    const windowCenter = windowHeight / 2;
    if (
      sectionCenter > windowCenter - 40 &&
      sectionCenter < windowCenter + 40 &&
      !isFixed
    ) {
      riceJourneySection.style.position = 'fixed';
      riceJourneySection.style.top = `${windowCenter - sectionHeight / 2}px`;
      riceJourneySection.style.left = '0';
      riceJourneySection.style.width = '100%';
      riceJourneySection.style.zIndex = '100';
      document.body.style.overflow = 'hidden';
      isFixed = true;
      enableFixedScrollControl();
    }
  }

  // 節流滾動事件
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: false });

  // 手機滑動支援（僅桌面版）
  if (!isMobile) {
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
  }

  // 監聽視窗大小變化
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 600;
    
    if (wasMobile !== isMobile) {
      // 重新初始化顯示
      updateSteps();
    }
  });

  updateSteps();
}); 