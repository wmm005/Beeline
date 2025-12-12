// ============================================================
// HOMEPAGE.JS
// ============================================================

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // 1. CUSTOM CURSOR
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorDefaultImg = cursor ? cursor.querySelector('.cursor-buzz-default') : null;
    const cursorHoverImg = cursor ? cursor.querySelector('.cursor-buzz-hover') : null;

    const interactiveElements = gsap.utils.toArray(
      'a, button, .result-card, .nav-links li a, .lang-btn, .search-box, .slider-nav'
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


  initCustomCursor();

}); 

// ==================== UNIVERSAL TAB & SLIDER LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. 先初始化所有 Slider
    initAllSliders();

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // 2. Tab 点击逻辑
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有 active 类
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 激活当前点击的 Tab
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            
            if(targetContent) {
                targetContent.classList.add('active');

                // ★★★ 关键修改：如果有重置功能，就调用它 ★★★
                // 这行代码会调用我们在 initAllSliders 里绑定的 reset 函数
                if (typeof targetContent.resetSlider === 'function') {
                    targetContent.resetSlider(); 
                }
            }
        });
    });
});

function initAllSliders() {
    const allContents = document.querySelectorAll('.tab-content');
    
    allContents.forEach(content => {
        const track = content.querySelector('.portfolio-track');
        const originalSlides = content.querySelectorAll('.portfolio-slide');
        const nextBtn = content.querySelector('.next-btn');
        const prevBtn = content.querySelector('.prev-btn');
        const dots = content.querySelectorAll('.dot'); 

        if (!track || originalSlides.length === 0) return;

        // 克隆逻辑 (无限循环必备)
        const totalSlides = originalSlides.length;
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

        track.prepend(lastClone);
        track.appendChild(firstClone);

        const allSlides = track.querySelectorAll('.portfolio-slide');
        const totalWithClones = allSlides.length;
        
        let currentIndex = 1;
        gsap.set(track, { xPercent: -100 * currentIndex });

        let isAnimating = false;
        let autoPlayTimer;
        const autoPlayInterval = 3000;

        function updateDots() {
            let realIndex = currentIndex - 1;
            if (realIndex < 0) realIndex = totalSlides - 1;
            if (realIndex >= totalSlides) realIndex = 0;

            dots.forEach((dot, i) => {
                if (i === realIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        function updateSlider(jump = false) {
            const xDest = -100 * currentIndex;
            
            if (jump) {
                // 如果是瞬移（比如重置），立刻杀掉所有动画，防止冲突
                gsap.killTweensOf(track); 
                gsap.set(track, { xPercent: xDest });
                isAnimating = false; // 强制解锁
            } else {
                isAnimating = true;
                gsap.to(track, {
                    xPercent: xDest,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onComplete: () => {
                        isAnimating = false;
                        checkLoop();
                    }
                });
            }
            updateDots(); 
        }

        function checkLoop() {
            if (currentIndex === totalWithClones - 1) {
                currentIndex = 1;
                updateSlider(true);
            }
            else if (currentIndex === 0) {
                currentIndex = totalWithClones - 2;
                updateSlider(true);
            }
        }

        function startAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                // 只有当不在动画中时，才触发下一页
                if (!isAnimating) {
                    currentIndex++;
                    updateSlider();
                }
            }, autoPlayInterval);
        }

        function stopAutoPlay() {
            // 只清除定时器，不要杀掉 GSAP 动画
            // 这样如果正在滑动，它会滑完再停，不会卡中间
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        // ★★★ 修复核心：重置时强制清洗状态 ★★★
        content.resetSlider = function() {
            stopAutoPlay();
            
            // 1. 杀掉可能正在跑的动画，防止 onComplete 不执行导致锁死
            gsap.killTweensOf(track); 
            
            // 2. 强制把状态设为“空闲”
            isAnimating = false; 

            // 3. 回到起点
            currentIndex = 1;
            updateSlider(true); // 瞬移
            
            startAutoPlay();
        };

        // 事件监听
        content.addEventListener('mouseenter', stopAutoPlay);
        content.addEventListener('mouseleave', startAutoPlay);
        content.addEventListener('touchstart', stopAutoPlay);
        content.addEventListener('touchend', startAutoPlay);

        // 启动
        startAutoPlay();

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!isAnimating) {
                    stopAutoPlay();
                    currentIndex++;
                    updateSlider();
                }
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!isAnimating) {
                    stopAutoPlay();
                    currentIndex--;
                    updateSlider();
                }
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                if (!isAnimating) {
                    stopAutoPlay();
                    currentIndex = i + 1;
                    updateSlider();
                }
            });
        });
    });
}

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