// ============================================================
// HOMEPAGE.JS.
// ============================================================

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // 1. CUSTOM CURSOR
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorDefaultImg = cursor ? cursor.querySelector('.cursor-buzz-default') : null;
    const cursorHoverImg = cursor ? cursor.querySelector('.cursor-buzz-hover') : null;

    const interactiveElements = gsap.utils.toArray(
      'a, button, .result-card, .nav-links li a, .lang-btn, .search-box, .nav-arrow'
    );
    
    const headerInteractiveElements = gsap.utils.toArray(
      '.header .nav-links li a, .header .lang-btn, .header .search-box'
    );

    if (!cursor || !cursorDefaultImg || !cursorHoverImg) {
      return;
    }

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    const damping = 0.1; 
    gsap.ticker.add(() => {
      cursorX += (mouseX - cursorX) * damping;
      cursorY += (mouseY - cursorY) * damping;
      gsap.set(cursor, { x: cursorX, y: cursorY });
    });
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      const leaveTimeline = gsap.timeline();
      leaveTimeline.to(cursorHoverImg, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.out" }, 0);
      leaveTimeline.to(cursorDefaultImg, { opacity: 1, scale: 1, duration: 0.4, ease: "elastic.out(1.5, 0.6)" }, 0);
    });
    
    interactiveElements.forEach(el => {
      const isHeaderElement = headerInteractiveElements.includes(el);
      const isFancyButton = el.matches('.btn-primary') || el.matches('.btn-secondary');
      const bg = isFancyButton ? el.querySelector('.btn-bg') : null;
      const textInner = isFancyButton ? el.querySelectorAll('.text-inner') : null;

      el.addEventListener('mouseenter', () => {
        gsap.killTweensOf([cursorDefaultImg, cursorHoverImg]);
        const hoverTimeline = gsap.timeline();
        if (!isHeaderElement) { 
          hoverTimeline.to(cursorDefaultImg, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.out" }, 0);
          hoverTimeline.to(cursorHoverImg, { opacity: 1, scale: 1.5, duration: 0.4, ease: "elastic.out(1.5, 0.4)" }, 0);
        }
        
        if (isFancyButton && bg && textInner && textInner.length > 1) {
          gsap.killTweensOf([bg, textInner[1]]); 
          gsap.to(bg, { clipPath: "circle(75% at 50% 50%)", duration: 0.5, ease: "power2.out" });
          gsap.to(textInner[1], { opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.1 });
        }
      });

      el.addEventListener('mouseleave', () => {
        if (isFancyButton && bg && textInner && textInner.length > 1) {
          gsap.killTweensOf([bg, textInner[1]]);
          gsap.to(bg, { clipPath: "circle(0% at 50% 50%)", duration: 0.4, ease: "power2.inOut" });
          gsap.to(textInner[1], { opacity: 0, duration: 0.3, ease: "power2.in" });
        }
        
        if (isHeaderElement) return; 
        gsap.killTweensOf([cursorDefaultImg, cursorHoverImg]);
        const leaveTimeline = gsap.timeline();
        leaveTimeline.to(cursorHoverImg, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.out" }, 0);
        leaveTimeline.to(cursorDefaultImg, { opacity: 1, scale: 1, duration: 0.4, ease: "elastic.out(1.5, 0.6)" }, 0);
      });
    });

    const headerElement = document.querySelector('.header');
    if (headerElement) {
      headerElement.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2, ease: "power2.out" });
      });
      
      headerElement.addEventListener('mouseleave', () => {
        gsap.killTweensOf([cursor, cursorDefaultImg, cursorHoverImg]);
        gsap.set(cursorHoverImg, { opacity: 0, scale: 0.8 }); 
        gsap.to(cursorDefaultImg, { opacity: 1, scale: 1, duration: 0.4, ease: "elastic.out(1.5, 0.6)" });
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
      });
    }
    
    const footer = document.querySelector(".footer");
    if (footer) {
      footer.addEventListener("mouseenter", () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 }); 
      });
      footer.addEventListener("mouseleave", () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      });
    }
  }
  
  // 2. HERO FLOAT & INTERACTION
  const pushContainers = gsap.utils.toArray(".float-element"); 
  const innerElements = gsap.utils.toArray(".float-element-inner"); 
  const mainPic = document.querySelector(".hero-main-scene-shape-img"); 
  const sensitivity = 0.20; 
  const pushRange = 200;      
  
  innerElements.forEach(element => {
    const MAX_Y = 40; 
    const FAST_DURATION = 2.5; 
    const randomDelay = gsap.utils.random(0, 1.0); 
    const randomRotation = gsap.utils.random(2, 6); 
    gsap.to(element, {
      y: MAX_Y, 
      rotation: `+=${randomRotation}`, 
      duration: FAST_DURATION, 
      ease: "sine.inOut", 
      repeat: -1, 
      yoyo: true, 
      delay: randomDelay 
    });
  });

  if (mainPic) {
    const entranceTimeline = gsap.timeline();
    entranceTimeline.from(mainPic, { duration: 1.0, opacity: 0, y: 50, ease: "power2.out" }, 0); 
    entranceTimeline.from(innerElements, { duration: 0.8, scale: 0.1, opacity: 0, ease: "elastic.out(1, 0.4)", stagger: 0.08 }, "<0.2"); 
  }

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    pushContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const containerCenterX = rect.left + rect.width / 2;
      const containerCenterY = rect.top + rect.height / 2;
      const dx = containerCenterX - mouseX;
      const dy = containerCenterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let targetX = 0;
      let targetY = 0;
      if (distance < pushRange) {
        const normalizedPushStrength = (pushRange - distance) / pushRange; 
        targetX = dx * normalizedPushStrength * sensitivity;
        targetY = dy * normalizedPushStrength * sensitivity; 
      }
      gsap.to(container, { 
        x: targetX,
        y: targetY, 
        duration: distance < pushRange ? 0.3 : 0.8, 
        ease: distance < pushRange ? "power2.out" : "elastic.out(1, 0.5)" 
      });
    });
  });

  window.addEventListener('mouseleave', () => {
    gsap.to(pushContainers, { x: 0, y: 0, duration: 1.0, ease: "elastic.out(1, 0.5)" });
  });

  
// 3. NAVIGATION LINKS
const navLinks = gsap.utils.toArray(".nav-links > li > a");
const customCursor = document.getElementById('customCursor'); 

navLinks.forEach(link => {
  const background = link.querySelector('.nav-bg');
  const textWrap = link.querySelector('.text-wrap');
  const textInner = link.querySelectorAll('.text-inner'); 
  const navArrow = link.querySelector('.nav-arrow');

  // 【修改点 1】：直接获取 wrap 的高度作为滚动的距离
  // 这样无论 CSS 里的 em 是多少，动画距离永远精准等于盒子高度
  let textHeight = textWrap ? textWrap.offsetHeight : 0;

  // 如果获取失败，才用 fallback
  if (textHeight === 0 && textInner.length > 0) {
      textHeight = textInner[0].offsetHeight;
  }

  if (background && textWrap && textInner.length > 1) { 
    // 初始化位置
    gsap.set(textInner[0], { y: 0 }); 
    gsap.set(textInner[1], { y: 0 }); 

    link.addEventListener('mouseenter', () => {
      // 在 hover 瞬间重新计算高度（防止浏览器缩放导致的高度变化）
      let currentHeight = textWrap.offsetHeight; 

      gsap.killTweensOf([background, link, textInner]);
      if (navArrow) gsap.to(navArrow, { color: 'white', duration: 0.2 });
      if (customCursor) { 
        gsap.to(customCursor, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.out" });
      }
      gsap.to(background, { scale: 1, duration: 0.4, ease: "power2.out" });
      gsap.to(link, { color: 'white', duration: 0.2 });
      
      // 【修改点 2】：使用重新计算的 currentHeight
      gsap.to(textInner, { y: -currentHeight, duration: 0.3, ease: "power2.out" });
      
      if (navArrow) gsap.to(navArrow, { color: 'white', duration: 0.2 });
    });

    link.addEventListener('mouseleave', () => {
      gsap.killTweensOf([background, link, textInner]);
      if (navArrow) gsap.to(navArrow, { color: 'var(--dark-text)', duration: 0.2 });
      gsap.to(background, { scale: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(link, { color: 'var(--dark-text)', duration: 0.2, delay: 0.1 });
      
      // 回归原位
      gsap.to(textInner, { y: 0, duration: 0.3, ease: "power2.out" });
      
      if (navArrow) gsap.to(navArrow, { color: 'var(--dark-text)', duration: 0.2 });
    });
  }
});


// 4. SERVICE ITEMS EXPAND (防过缩/防跳动终极修复)
const serviceItems = gsap.utils.toArray('.service-item');
const toggleButtons = gsap.utils.toArray('.toggle-btn');

// 初始化图标
gsap.set('.icon-wrapper .icon-minus', { opacity: 0, rotationY: 180 });
gsap.set('.icon-wrapper .icon-plus', { opacity: 1, rotationY: 0 });

toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();

        const parentItem = button.closest('.service-item');
        const targetContent = document.getElementById(button.dataset.target);
        const iconPlus = button.querySelector('.icon-plus');
        const iconMinus = button.querySelector('.icon-minus');

        if (!parentItem || !targetContent) return;

        const isCollapsing = parentItem.classList.contains('active');
        const style = window.getComputedStyle(parentItem);
        const contentStyle = window.getComputedStyle(targetContent);

        // 获取样式数据
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;
        const borderTop = parseFloat(style.borderTopWidth) || 0;
        const borderBottom = parseFloat(style.borderBottomWidth) || 0;
        const cssMarginTop = parseFloat(contentStyle.marginTop) || 0;

        // 获取标题行精确高度
        const titleRow = parentItem.querySelector('.title-row');
        const titleRect = titleRow.getBoundingClientRect();
        const titleHeight = titleRect.height; 

        // ★★★ 核心修复：向上取整 Math.ceil ★★★
        // 之前的问题是：如果算出 80.2px，GSAP 设为 80.2px，浏览器可能显示为“压扁了一点”
        // 现在强制设为 81px，宁可多 0.8px 也不要少 0.1px，彻底防止“缩过头”
        const targetCollapsedHeight = Math.ceil(titleHeight + paddingTop + paddingBottom + borderTop + borderBottom);

        if (isCollapsing) {
            // ==================== [收起逻辑] ====================
            
            // 1. 锁定内容
            gsap.set(targetContent, { display: 'block' });
            
            // 2. 状态变更
            parentItem.classList.remove('active');
            button.classList.remove('active');

            // 3. 瞬间切回透明背景 (无过渡)
            gsap.set(parentItem, { 
                backgroundColor: 'transparent',
                borderColor: '#e27d3a', 
                boxShadow: 'none' 
            });

            // 4. 动画
            const collapseTL = gsap.timeline({
                defaults: { duration: 0.4, ease: 'power2.inOut' },
                onComplete: () => {
                    // 动画结束，清理现场
                    // 因为我们用了 Math.ceil，targetCollapsedHeight 肯定够大，不会跳
                    gsap.set(parentItem, { clearProps: 'height, overflow' }); 
                    gsap.set(targetContent, { clearProps: 'all', display: 'none' });
                }
            });

            // 图标动画
            collapseTL.to(iconPlus, { opacity: 1, rotationY: 0 }, 0);
            collapseTL.to(iconMinus, { opacity: 0, rotationY: 180 }, 0);

            // 内容消失
            collapseTL.to(targetContent, { height: 0, opacity: 0, marginTop: 0 }, 0);

            // ★★★ 盒子收缩 ★★★
            // 同时设置 minHeight 保护，防止浏览器渲染 bug 导致它变小
            collapseTL.fromTo(parentItem, 
                { height: parentItem.offsetHeight }, 
                { 
                    height: targetCollapsedHeight,
                    // 额外加一道保险：告诉浏览器最小也不能小于这个数
                    minHeight: targetCollapsedHeight 
                }, 
                0
            );

        } else {
            // ==================== [展开逻辑] ====================
            
            // 1. 手风琴逻辑 (保持不变)
            serviceItems.forEach(item => {
                if (item !== parentItem && item.classList.contains('active')) {
                    const otherButton = item.querySelector('.toggle-btn');
                    if (otherButton) otherButton.click();
                }
            });

            // 2. 记录起点
            const startHeight = parentItem.offsetHeight;

            // 3. 测量终点
            gsap.set(targetContent, { display: 'block', height: 'auto', opacity: 1 });
            const contentHeight = targetContent.scrollHeight;
            gsap.set(targetContent, { display: 'none', height: 0, opacity: 0 }); 
            
            // 同样向上取整，保证展开也足够大
            const finalExpandHeight = Math.ceil(startHeight + contentHeight + cssMarginTop);

            // 4. 状态变更 & 瞬间变白
            parentItem.classList.add('active');
            button.classList.add('active');
            targetContent.style.display = 'block';

            gsap.set(parentItem, {
                backgroundColor: 'white',
                borderColor: 'transparent',
                boxShadow: 'var(--card-shadow)'
            });

            const expandTL = gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out' } });

            expandTL.to(iconPlus, { opacity: 0, rotationY: -180 }, 0);
            expandTL.to(iconMinus, { opacity: 1, rotationY: 0 }, 0);

            // 盒子展开
            expandTL.fromTo(parentItem, 
                { height: startHeight }, 
                { height: finalExpandHeight }, 
                0
            );

            // 内容展开
            expandTL.fromTo(targetContent, 
                { height: 0, opacity: 0, marginTop: 0 }, 
                { 
                    height: 'auto', 
                    opacity: 1, 
                    marginTop: cssMarginTop 
                }, 0.1);
        }
    });
});


// 6. RESULTS SCROLLER MARQUEE (增强修复版)
function initResultsMarquee() {
    // 检查 GSAP 版本是否支持 matchMedia，如果太老则报错或降级（通常不用担心）
    if (!gsap.matchMedia) {
        console.warn("GSAP matchMedia is not supported. Please update GSAP.");
        return;
    }

    let mm = gsap.matchMedia();

    // ================== Desktop 模式 (> 991px) ==================
    mm.add("(min-width: 992px)", () => {
        const scroller = document.querySelector(".results-scroller");
        const scrollerWrapper = document.querySelector(".results-scroller-wrapper");
        
        if (!scroller || !scrollerWrapper) return;

        // --- 1. 克隆卡片逻辑 ---
        const originalCards = gsap.utils.toArray(scroller.children);
        const clonedElements = [];

        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute("aria-hidden", true);
            clone.classList.add("js-clone-card"); // 加上特定 class 方便 CSS 隐藏
            scroller.appendChild(clone);
            clonedElements.push(clone);
        });

        // 重新获取所有卡片
        const allCards = gsap.utils.toArray(scroller.children);

        // --- 2. 悬停放大逻辑 (Hover) ---
        const originalShadow = "0 4px 8px rgba(0, 0, 0, 0.08), 0 15px 20px rgba(0, 0, 0, 0.1)";
        const hoverShadow = "0 12px 25px rgba(0, 0, 0, 0.15)";
        
        // 存储蜜蜂动画的 Map
        const beeTimelines = new Map();

        allCards.forEach(card => {
            const beeIcon = card.querySelector('.result-bee-animated-icon');

            // 绑定鼠标移入事件
            card.addEventListener('mouseenter', () => {
                // 其他卡片变暗
                gsap.to(allCards.filter(c => c !== card), { 
                    opacity: 0.5, scale: 0.8, duration: 0.3, overwrite: true 
                });
                
                // 当前卡片放大
                gsap.to(card, { 
                    scale: 1.25, opacity: 1, zIndex: 20, boxShadow: hoverShadow, duration: 0.3, ease: "back.out(3)", overwrite: true 
                });

                // 蜜蜂动画
                if (beeIcon) {
                    if (beeTimelines.has(beeIcon)) beeTimelines.get(beeIcon).kill();
                    const tl = gsap.timeline({ repeat: -1, yoyo: true });
                    tl.to(beeIcon, { y: -10, rotate: 5, duration: 0.3, ease: "power1.inOut" });
                    beeTimelines.set(beeIcon, tl);
                }
            });

            // 恢复状态通常由 wrapper 的 mouseleave 处理，或者在这里加 mouseleave
        });

        // --- 3. 跑马灯滚动逻辑 ---
        // 强制 scroller 排成一横排
        scroller.style.display = "flex";
        scroller.style.flexWrap = "nowrap";
        scroller.style.width = "max-content"; // 关键：让容器宽度自动撑开

        const totalWidth = scroller.scrollWidth / 2; // 因为克隆了一份，所以是一半
        
        // 初始位置归零
        gsap.set(scroller, { x: 0 });

        const marqueeTween = gsap.to(scroller, {
            x: -totalWidth,
            duration: totalWidth / 80, // 速度控制
            ease: "none",
            repeat: -1
        });

        // --- 4. 容器交互 (暂停/播放) ---
        scrollerWrapper.addEventListener('mouseenter', () => {
            marqueeTween.pause();
        });

        scrollerWrapper.addEventListener('mouseleave', () => {
            marqueeTween.play();
            // 鼠标离开容器时，复原所有卡片状态
            gsap.to(allCards, { opacity: 1, scale: 1, x: 0, y: 0, zIndex: 1, boxShadow: originalShadow, duration: 0.3, overwrite: true });
            
            // 停止所有蜜蜂
            beeTimelines.forEach(tl => tl.kill());
            beeTimelines.clear();
            gsap.set(scroller.querySelectorAll('.result-bee-animated-icon'), { clearProps: "all" });
        });

        // ================== CLEANUP (当变成手机版时执行) ==================
        return () => {
            // 1. 杀掉动画
            marqueeTween.kill();
            beeTimelines.forEach(tl => tl.kill());
            gsap.killTweensOf(allCards);
            gsap.killTweensOf(scroller);

            // 2. 移除克隆元素 (非常重要!)
            clonedElements.forEach(el => el.remove());

            // 3. 彻底清除内联样式 (让 CSS 接管)
            // clearProps: "all" 会移除 style="..." 里的所有东西
            gsap.set(scroller, { clearProps: "all" });
            gsap.set(originalCards, { clearProps: "all" });
            
            // 额外保险：强制重置 display，防止 flex 残留
            scroller.style.display = "";
            scroller.style.width = "";
        };
    });
}


  // 7. FAQ ACCORDION
  function initFaqAccordion() {
    const allFaqItems = gsap.utils.toArray(".faq-item");

    allFaqItems.forEach(item => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        allFaqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains("is-open")) {
            const otherAnswer = otherItem.querySelector(".faq-answer");
            gsap.to(otherAnswer, { height: 0, duration: 0.3, ease: "power1.inOut" });
            otherItem.classList.remove("is-open");
          }
        });

        if (isOpen) {
          gsap.to(answer, { height: 0, duration: 0.3, ease: "power1.inOut" });
          item.classList.remove("is-open");
        } else {
          gsap.to(answer, { height: "auto", duration: 0.3, ease: "power1.inOut" });
          item.classList.add("is-open");
        }
      });
    });
  }

  // 8. INTRO POPUP
  function initIntroPopup() {
    const bee = document.getElementById('intro-bee');
    const modal = document.getElementById('intro-modal');
    const overlay = document.querySelector('.modal-overlay');
    const card = document.querySelector('.modal-card');
    const bookBtn = document.querySelector('.modal-cta-btn'); 

    if (!bee || !modal || !card) return;

    const centerX = window.innerWidth / 2 - 100; 
    const centerY = window.innerHeight / 2 - 100;

    const tl = gsap.timeline({ delay: 0.5 });

    gsap.set(bee, { visibility: 'visible', x: -300, y: centerY, scale: 0.8, rotation: 30 }); 
    gsap.set(modal, { visibility: 'visible' });
    gsap.set(overlay, { opacity: 0 }); 

    tl.to(bee, { x: centerX, scale: 1.2, duration: 1, ease: "power2.out" })
      .to(overlay, { opacity: 1, duration: 1 }, "<") 
      .to(bee, { y: centerY - 40, duration: 0.1, yoyo: true, repeat: 1 })
      .to(bee, { scale: 0, opacity: 0, duration: 0.1 }) 
      .to(card, { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<"); 

    const closeModal = () => {
      gsap.to(card, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => {
         modal.style.display = 'none'; 
      }});
    };

    if (overlay) overlay.addEventListener('click', closeModal);
    if (bookBtn) bookBtn.addEventListener('click', closeModal);
  }

  initIntroPopup();
  initResultsMarquee();
  initCustomCursor();
  initFaqAccordion();

}); 


// 5. SERVICE ANIMATIONS (Typing & Floating)
window.addEventListener('load', () => {
  const socialPostImage = document.querySelector('.social-post-image'); 
  const buzzBees = gsap.utils.toArray('.buzz-fly');
  const heartIcons = gsap.utils.toArray('.heart-fly');
  const mediaContainer = socialPostImage ? socialPostImage.closest('.service-media') : null;

  const typingTextElement = document.getElementById('typing-text-content');
  let typingTimeout;

  function serviceTypingAnimation(start = true) {
    if (!typingTextElement) return; 
    
    clearTimeout(typingTimeout); 

    if (!start) {
      typingTextElement.innerHTML = ''; 
      return;
    }

    const textToType = "Buzzies are here to brighten your day with joy and energy, one happy buzz at a time!";
    
    let charIndex = 0;
    const typingSpeed = 30; 
    const restartDelay = 2000;

    function type() {
      if (charIndex < textToType.length) {
        let char = textToType.charAt(charIndex);
        
        if (char === '<') {
          const closingTagIndex = textToType.indexOf('>', charIndex);
          typingTextElement.innerHTML += textToType.substring(charIndex, closingTagIndex + 1);
          charIndex = closingTagIndex; 
        } else if (char === '\n') {
          typingTextElement.innerHTML += '<br>';
        } else {
          typingTextElement.innerHTML += char;
        }
        
        charIndex++;
        typingTimeout = setTimeout(type, typingSpeed);
      } else {
        typingTimeout = setTimeout(() => {
          charIndex = 0;
          typingTextElement.innerHTML = '';
          type(); 
        }, restartDelay);
      }
    }
    type(); 
  }

  function startFloating(element) {
    if (!element) return;
    if (gsap.isTweening(element) && gsap.getTweensOf(element).length > 1) return;
    
    const randomY = gsap.utils.random(5, 15);
    const randomRot = gsap.utils.random(3, 8);
    const randomDelay = gsap.utils.random(0, 1.5);
    const randomDuration = gsap.utils.random(2.5, 4.0);

    gsap.to(element, {
      y: `+=${randomY}`,
      rotation: `+=${randomRot}`,
      duration: randomDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: randomDelay,
      overwrite: true
    });
  }

  if (socialPostImage && mediaContainer && (buzzBees.length > 0 || heartIcons.length > 0)) {
    if (mediaContainer.offsetWidth === 0) return; 

    const w = window.innerWidth;
    
    // ================= 1. 定义动态中心点 (新增 480 判断) =================
    let postCenterX, postCenterY;

    // ★★★ 新增：针对超小屏幕 (0 - 480px) ★★★
    if (w <= 576) {
        // 图片非常小 (约 240px)，且屏幕很窄，中心点偏移量必须减小
        // 否则图标会飘到屏幕左边外面去
        postCenterX = socialPostImage.offsetLeft + (socialPostImage.offsetWidth / 2) - 95; // 偏移量改小 (-50)
        postCenterY = socialPostImage.offsetTop + (socialPostImage.offsetHeight / 2) - 50; // 高度适当上提
    }

    // ★★★ 针对大手机 (480px - 768px) ★★★
    else if (w <= 767) {
        postCenterX = socialPostImage.offsetLeft + (socialPostImage.offsetWidth / 2) - 100; 
        postCenterY = socialPostImage.offsetTop + (socialPostImage.offsetHeight / 2) - 80; 
    }

    // --- 平板/竖屏 (768px - 991px) ---
    else if(w <= 991) {
      postCenterX = socialPostImage.offsetLeft + (socialPostImage.offsetWidth / 2) -130;
      postCenterY = socialPostImage.offsetTop + (socialPostImage.offsetHeight / 2) -80;
    } 
    // --- 电脑端 (> 991px) ---
    else {
      postCenterX = mediaContainer.offsetWidth / 2.5;
      postCenterY = mediaContainer.offsetHeight / 3;
    }

    // ================= 2. RESPONSIVE 参数微调 (新增 480 判断) =================
    let distScale = 1.0; 
    let sizeScale = 1.0; 
    let moveX = 0;       
    let moveY = 0;  
    let heartAdjustX = 0; 
    let heartAdjustY = 0;    

    // ★★★ 新增：针对超小屏幕 (0 - 480px) ★★★
    if (w <= 576) {
        distScale = 0.5; // ★ 极度收缩范围，防止撑破 320px 屏幕
        sizeScale = 0.5;  // ★ 图标变得很小，不然挡住文字
        
        moveX = 10;       // 稍微往右挪一点，因为屏幕左边没空间了
        moveY = -10;      // 稍微往上
        
        heartAdjustX = -50; // 爱心微调
        heartAdjustY = 60;
    }

    // ★★★ 针对大手机 (480px - 768px) ★★★
    else if (w <= 767) {
        distScale = 0.7;  
        sizeScale = 0.7;  
        
        moveX = 0;        
        moveY = -0;       
        
        heartAdjustX = -80; 
        heartAdjustY = 20;
    }

    // --- 针对平板/竖屏 (768px - 991px) ---
    else if(w <= 991) {
        distScale = 0.9;  
        sizeScale = 0.9; 
        moveX = -0;    
        moveY = -0;  
        heartAdjustY = -0;
        heartAdjustX = -100;
    } 
    
    // --- 针对笔记本/小屏电脑 (992px - 1199px) ---
    else if (w <= 1199) {
        distScale = 0.75; 
        sizeScale = 0.8;  
        moveX = -20;       
        moveY = -20;      
        heartAdjustY = 30;
        heartAdjustX = 0;
    }

    // 3. 应用参数 (逻辑：基准点 ± (偏移 * 缩放) + 平移)
    const beeEndPositions = [
      [postCenterX - (70 * distScale) + moveX,  postCenterY - (280 * distScale) + moveY, 1.0 * sizeScale, 10],
      [postCenterX + (120 * distScale) + moveX, postCenterY - (190 * distScale) + moveY, 0.9 * sizeScale, 0], 
      [postCenterX - (250 * distScale) + moveX, postCenterY - (130 * distScale) + moveY, 1.0 * sizeScale, -20], 
      [postCenterX - (30 * distScale) + moveX,  postCenterY - (30 * distScale) + moveY,  1.0 * sizeScale, 0]
    ];
    
    const heartEndPositions = [
      [postCenterX + heartAdjustX - (200 * distScale) + moveX, postCenterY + heartAdjustY + (80 * distScale) + moveY,  0.9 * sizeScale, 0],    
      [postCenterX + heartAdjustX + (320 * distScale) + moveX, postCenterY + heartAdjustY + (80 * distScale) + moveY,  0.9 * sizeScale, 0],
      [postCenterX + heartAdjustX - (160 * distScale) + moveX, postCenterY + heartAdjustY + (130 * distScale) + moveY, 1.3 * sizeScale, 0],  
      [postCenterX + heartAdjustX + (280 * distScale) + moveX, postCenterY + heartAdjustY + (150 * distScale) + moveY, 1.7 * sizeScale, 0],
      [postCenterX + heartAdjustX + (250 * distScale) + moveX, postCenterY + heartAdjustY + (50 * distScale) + moveY,  1.2 * sizeScale, 0]       
      
      
    ];

    

    const mediaTimeline = gsap.timeline({ paused: true }); 
    
    buzzBees.forEach((bee, i) => {
      const endPos = beeEndPositions[i] || beeEndPositions[0];
      mediaTimeline.fromTo(bee, 
        { x: postCenterX, y: postCenterY, scale: 0, opacity: 0, rotation: 0 },
        { 
          x: endPos[0], y: endPos[1], scale: endPos[2], opacity: 1, rotation: endPos[3],
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => startFloating(bee)
        }, 
        i * 0.1
      );
    });

    heartIcons.forEach((heart, i) => {
      const endPos = heartEndPositions[i] || heartEndPositions[0];
      mediaTimeline.fromTo(heart, 
        { x: postCenterX, y: postCenterY, scale: 0, opacity: 0, rotation: 0 },
        { 
          x: endPos[0], y: endPos[1], scale: endPos[2], opacity: 1, rotation: endPos[3],
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => startFloating(heart)
        }, 
        (i * 0.1) + 0.2
      );
    });

    ScrollTrigger.create({
      trigger: ".service-media", 
      start: "top 75%",
      toggleActions: "restart none none reverse",
      onEnter: () => {
        mediaTimeline.restart();
        serviceTypingAnimation(true); 
      },
      onLeaveBack: () => {
        mediaTimeline.reverse();
        serviceTypingAnimation(false); 
      }
    });
  }
});

// SEARCH BOX
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 这里的 Data 可以随便写，用来测试
    const searchData = [
        { title: "Home", category: "Page", link: "index.html" },
        { title: "About Us", category: "Page", link: "About Us.html" },
        { title: "Portfolio", category: "Page", link: "Portfolio.html" },
        { title: "Contact", category: "Page", link: "Get in Touch.html" },
        { title: "Get in Touch", category: "Page", link: "Get in Touch.html" },

        { title: "Branding", category: "Service", link: "Services_Branding.html" },
        { title: "Website Design", category: "Service", link: "Services_Website Design.html" },
        { title: "Influencer Collaboration", category: "Service", link: "Services_Influencer Collaboration.html" },
        { title: "Social Media Management", category: "Service", link: "Services_Social Media Management.html" },

        { title: "DE CREATIVE", category: "Portfolio", link: "Portfolio_Branding_01.html" },
        { title: "LEHAO", category: "Portfolio", link: "Portfolio_Social Media Management_01.html" },
        { title: "QUBE", category: "Portfolio", link: "Portfolio_Website Design_01.html" },
        { title: "ZIDS", category: "Portfolio", link: "Portfolio_Website Design_02.html" },

        { title: "Contact Us", category: "Contact", link: "Get in Touch.html" },
        { title: "Get in Touch", category: "Contact", link: "Get in Touch.html" },
        
    ];

    // 2. 获取元素
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // 3. 定义分类颜色 (想要什么颜色改这里)
    function getCategoryColor(cat) {
        switch(cat) {
            case 'Service': return '#964f33';   // 你的品牌棕色
            case 'Portfolio': return '#E04F5F'; // 红色/粉色
            case 'Page': return '#4A90E2';      // 蓝色
            case 'Contact': return '#27AE60';   // 绿色
            default: return '#999';
        }
    }

    // 4. 监听输入
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase().trim();

        // 如果输入为空，隐藏下拉框
        if (value.length === 0) {
            searchResults.classList.remove('active');
            return;
        }

        // 过滤数据
        const filteredData = searchData.filter(item => 
            item.title.toLowerCase().includes(value)
        );

        // 显示结果
        displayResults(filteredData);
    });

    // 5. 渲染结果 HTML
    function displayResults(results) {
    searchResults.innerHTML = ''; 

    if (results.length > 0) {
        results.forEach(item => {
            const link = document.createElement('a');
            link.href = item.link;
            link.className = 'search-item';
            
            const color = getCategoryColor(item.category);

            // 【关键改动】：category 放前面，title 放后面
            link.innerHTML = `
                <span class="item-category" style="color: ${color}">${item.category}</span>
                <span class="item-title">${item.title}</span>
            `;
            
            searchResults.appendChild(link);
        });
    } else {
        searchResults.innerHTML = `
            <div class="search-item" style="justify-content:center; color:#bbb; cursor:default;">
                No results found
            </div>
        `;
    }
    
    searchResults.classList.add('active');
}

    // 6. 点击外部关闭搜索框
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
});




/* ==================== MOBILE MENU & SEARCH JS (最终修复版) ==================== */
document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. 汉堡菜单逻辑 (Hamburger Menu)
    // ============================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenuSidebar');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    
    // 获取 Services 元素 (用于关闭菜单时自动收起)
    const mobileServiceLink = document.querySelector('.mobile-has-submenu > a');
    const mobileGridWrapper = document.querySelector('.submenu-grid-wrapper');

    function toggleMenu() {
        if (!mobileMenu) return;

        // 检查当前是否打开
        const isActive = mobileMenu.classList.contains('active');

        if (isActive) {
            // ============== [关闭菜单] ==============
            mobileMenu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
            
            // 解锁背景滚动
            document.body.classList.remove('no-scroll');

            // ★★★ 自动收起 Services 菜单 (重置状态) ★★★
            if (mobileGridWrapper) mobileGridWrapper.classList.remove('open');
            if (mobileServiceLink) mobileServiceLink.classList.remove('active');

        } else {
            // ============== [打开菜单] ==============
            mobileMenu.classList.add('active');
            if (menuOverlay) menuOverlay.classList.add('active');
            if (hamburgerBtn) hamburgerBtn.classList.add('active');
            
            // 锁定背景滚动
            document.body.classList.add('no-scroll');
        }
    }

    // 绑定点击事件
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);


    // ============================================================
    // 2. Services 菜单折叠逻辑 (丝滑动画版)
    // ============================================================
    // 注意：这里必须获取 .submenu-grid-wrapper 才能实现丝滑动画
    const serviceLinkTrigger = document.querySelector('.mobile-has-submenu > a');
    const serviceGridWrapper = document.querySelector('.submenu-grid-wrapper');

    if (serviceLinkTrigger && serviceGridWrapper) {
        serviceLinkTrigger.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止跳转
            
            // 切换 Grid 动画类 (.open 控制 grid-template-rows)
            serviceGridWrapper.classList.toggle('open');
            
            // 切换箭头旋转
            serviceLinkTrigger.classList.toggle('active');
        });
    }


    // ============================================================
    // 3. 移动端搜索弹窗 UI (Search Overlay UI)
    // ============================================================
    const searchBtn = document.getElementById('mobileSearchBtn');
    const searchOverlay = document.getElementById('mobileSearchOverlay');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const mobileSearchInput = document.getElementById('mobileSearchInput');

    // 打开搜索
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            // 自动聚焦输入框
            if (mobileSearchInput) {
                setTimeout(() => mobileSearchInput.focus(), 100); 
            }
        });
    }

    // 关闭搜索
    if (closeSearchBtn && searchOverlay) {
        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }


    // ============================================================
    // 3. 统一搜索逻辑 (纯净版 - 样式完全由 CSS 控制)
    // ============================================================
    
    // A. 你的原始数据
    const searchData = [
        { title: "Home", category: "Page", link: "index.html" },
        { title: "About Us", category: "Page", link: "About Us.html" },
        { title: "Portfolio", category: "Page", link: "Portfolio.html" },
        { title: "Contact", category: "Page", link: "Get in Touch.html" },
        { title: "Get in Touch", category: "Page", link: "Get in Touch.html" },

        { title: "Branding", category: "Service", link: "Services_Branding.html" },
        { title: "Website Design", category: "Service", link: "Services_Website Design.html" },
        { title: "Influencer Collaboration", category: "Service", link: "Services_Influencer Collaboration.html" },
        { title: "Social Media Management", category: "Service", link: "Services_Social Media Management.html" },

        { title: "DE CREATIVE", category: "Portfolio", link: "Portfolio_Branding_01.html" },
        { title: "LEHAO", category: "Portfolio", link: "Portfolio_Social Media Management_01.html" },
        { title: "QUBE", category: "Portfolio", link: "Portfolio_Website Design_01.html" },
        { title: "ZIDS", category: "Portfolio", link: "Portfolio_Website Design_02.html" },

        { title: "Contact Us", category: "Contact", link: "Get in Touch.html" },
        { title: "Get in Touch", category: "Contact", link: "Get in Touch.html" },
        
    ];

    // B. 你的颜色定义函数
    function getCategoryColor(cat) {
        switch(cat) {
            case 'Service': return '#964f33';   // 品牌棕色
            case 'Portfolio': return '#E04F5F'; // 红色
            case 'Page': return '#4A90E2';      // 蓝色
            case 'Contact': return '#27AE60';   // 绿色
            default: return '#999';
        }
    }

    // C. 通用初始化函数
    function initSearchSystem(inputId, resultsId) {
        const input = document.getElementById(inputId);
        const resultsBox = document.getElementById(resultsId);

        if (!input || !resultsBox) return;

        // 监听输入
        input.addEventListener('input', function(e) {
            const value = e.target.value.toLowerCase().trim();

            // 空值隐藏
            if (value.length === 0) {
                resultsBox.style.display = 'none'; 
                return;
            }

            // 过滤
            const filteredData = searchData.filter(item => 
                item.title.toLowerCase().includes(value)
            );

            // 显示
            displayResults(filteredData, resultsBox);
        });

        // 渲染函数
        function displayResults(results, container) {
            container.innerHTML = ''; 

            if (results.length > 0) {
                container.style.display = 'block'; // 显示下拉框
                
                results.forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.className = 'search-item'; // CSS 样式类
                    
                    const color = getCategoryColor(item.category);

                    // ★★★ 修正版：没有任何宽度/字体样式，只有颜色 ★★★
                    // 样式全部由 CSS (.item-category, .item-title) 控制
                    link.innerHTML = `
                        <span class="item-category" style="color: ${color}">${item.category}</span>
                        <span class="item-title">${item.title}</span>
                    `;
                    
                    container.appendChild(link);
                });
            } else {
                container.style.display = 'block';
                container.innerHTML = `
                    <div class="search-item" style="justify-content:center; color:#bbb; cursor:default; padding: 10px;">
                        No results found
                    </div>
                `;
            }
        }

        // 点击外部关闭
        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
                resultsBox.style.display = 'none';
            }
        });
    }

    // D. 执行初始化
    initSearchSystem('searchInput', 'searchResults');           // 电脑版
    initSearchSystem('sidebarSearchInput', 'sidebarSearchResults'); // 手机侧边栏版
});