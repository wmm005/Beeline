
// 注册 GSAP 插件
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
} else {
    console.error("GSAP or ScrollTrigger not loaded!");
}

document.addEventListener('DOMContentLoaded', () => {

    // ==================== 1. CUSTOM CURSOR ====================
    function initCustomCursor() {
        const cursor = document.getElementById('customCursor');
        const cursorDefaultImg = cursor ? cursor.querySelector('.cursor-buzz-default') : null;
        const cursorHoverImg = cursor ? cursor.querySelector('.cursor-buzz-hover') : null;

        const interactiveElements = gsap.utils.toArray(
            'a, button, .result-card, .nav-links li a, .lang-btn, .search-box, .nav-arrow, .custom-select-trigger, .custom-option'
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

        // Header logic
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

        // Footer logic
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

    // ==================== 2. NAVIGATION LINKS (已修复：添加了函数包装) ====================
    function initNavLinks() {
        const navLinks = gsap.utils.toArray(".nav-links > li > a");
        const customCursor = document.getElementById('customCursor'); 

        navLinks.forEach(link => {
            const background = link.querySelector('.nav-bg');
            const textWrap = link.querySelector('.text-wrap');
            const textInner = link.querySelectorAll('.text-inner'); 
            const navArrow = link.querySelector('.nav-arrow');

            // 获取 wrap 的高度作为滚动的距离
            let textHeight = textWrap ? textWrap.offsetHeight : 0;

            if (textHeight === 0 && textInner.length > 0) {
                textHeight = textInner[0].offsetHeight;
            }

            if (background && textWrap && textInner.length > 1) { 
                // 初始化位置
                gsap.set(textInner[0], { y: 0 }); 
                gsap.set(textInner[1], { y: 0 }); 

                link.addEventListener('mouseenter', () => {
                    // 在 hover 瞬间重新计算高度
                    let currentHeight = textWrap.offsetHeight; 

                    gsap.killTweensOf([background, link, textInner]);
                    if (navArrow) gsap.to(navArrow, { color: 'white', duration: 0.2 });
                    if (customCursor) { 
                        gsap.to(customCursor, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.out" });
                    }
                    gsap.to(background, { scale: 1, duration: 0.4, ease: "power2.out" });
                    gsap.to(link, { color: 'white', duration: 0.2 });
                    
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
    }

    // ==================== 3. DROPDOWN LOGIC ====================
    function initDropdowns() {
        const dropdowns = document.querySelectorAll('.custom-select-wrapper');

        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.custom-select-trigger');
            const options = dropdown.querySelectorAll('.custom-option');
            const realInput = dropdown.querySelector('.real-input');
            const selectedText = dropdown.querySelector('.selected-text');

            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    dropdowns.forEach(d => {
                        if (d !== dropdown) d.classList.remove('open');
                    });
                    dropdown.classList.toggle('open');
                    e.stopPropagation();
                });
            }

            options.forEach(option => {
                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;

                    if (selectedText) selectedText.textContent = text;
                    if (realInput) realInput.value = value;

                    dropdown.classList.add('selected');
                    dropdown.classList.remove('open');
                });
            });
        });

        document.addEventListener('click', (e) => {
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        });
    }

    // ==================== 4. INPUT LOGIC ====================
    function initInputs() {
        const inputs = document.querySelectorAll('.input-group input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('filled');
                } else {
                    input.classList.remove('filled');
                }
            });
            if (input.value.trim() !== '') {
                input.classList.add('filled');
            }
        });
    }

    // ==================== 5. MISSION BEE LOGIC ====================
    function initMissionBees() {
        gsap.utils.toArray(".pop-bee").forEach((bee) => {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: bee, 
                    start: "top 80%", 
                    toggleActions: "play none none none"
                }
            });

            // 1. 弹跳入场
            tl.fromTo(bee, 
                { scale: 0.5, autoAlpha: 0 },
                { duration: 0.8, scale: 1, autoAlpha: 1, ease: "back.out(1.7)", force3D: true }
            )
            // 2. 持续漂浮
            .to(bee, {
                y: -30, 
                duration: 1, 
                ease: "sine.inOut", 
                yoyo: true, 
                repeat: -1
            });
        });
    }

    // ==================== 6. SCROLL DOWN ARROWS ====================
    function initScrollDownArrows() {
        const arrow1 = document.querySelector('.scroll-down-arrow-container .arrow-1');
        const arrow2 = document.querySelector('.scroll-down-arrow-container .arrow-2');

        if (!arrow1 || !arrow2) return;

        // Arrow 1
        gsap.to(arrow1, {
            y: 10, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0
        });

        // Arrow 2 (Staggered start)
        gsap.to(arrow2, {
            y: 10, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.4
        });
    }

    // ==================== 7. SEARCH BOX (整合进主流程) ====================
    function initSearchBox() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        // 如果页面上没有搜索框元素，直接跳过，防止报错
        if (!searchInput || !searchResults) return;

        const searchData = [
            { title: "Brand Identity", category: "Service", link: "Services_Branding.html" },
            { title: "Web Development", category: "Service", link: "Services_WebDesign.html" },
            { title: "Nike Campaign", category: "Portfolio", link: "Portfolio_Nike.html" },
            { title: "Coffee Shop", category: "Portfolio", link: "Portfolio_Coffee.html" },
            { title: "About Beeline", category: "Page", link: "About Us.html" },
            { title: "Contact Us", category: "Contact", link: "Get in Touch.html" },
            { title: "Instagram Management Management", category: "Service", link: "Services_Social.html" }
        ];

        function getCategoryColor(cat) {
            switch(cat) {
                case 'Service': return '#964f33'; 
                case 'Portfolio': return '#E04F5F'; 
                case 'Page': return '#4A90E2'; 
                case 'Contact': return '#27AE60'; 
                default: return '#999';
            }
        }

        function displayResults(results) {
            searchResults.innerHTML = ''; 
            if (results.length > 0) {
                results.forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.className = 'search-item';
                    const color = getCategoryColor(item.category);
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

        searchInput.addEventListener('input', function(e) {
            const value = e.target.value.toLowerCase().trim();
            if (value.length === 0) {
                searchResults.classList.remove('active');
                return;
            }
            const filteredData = searchData.filter(item => 
                item.title.toLowerCase().includes(value)
            );
            displayResults(filteredData);
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    // ==================== INITIALIZATION (统一运行) ====================
    try {
        initCustomCursor();
        initNavLinks();         // 之前这里报错，因为函数未定义
        initDropdowns();
        initInputs();
        initMissionBees();
        initScrollDownArrows();
        initSearchBox();
        console.log("All scripts initialized successfully.");
    } catch (error) {
        console.error("Initialization error:", error);
    }
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
        { title: "Brand Identity", category: "Service", link: "Services_Branding.html" },
        { title: "Web Development", category: "Service", link: "Services_Website Design.html" },
        { title: "Nike Campaign", category: "Portfolio", link: "Portfolio.html" },
        { title: "Coffee Shop", category: "Portfolio", link: "Portfolio.html" },
        { title: "About Beeline", category: "Page", link: "About Us.html" },
        { title: "Contact Us", category: "Contact", link: "Get in Touch.html" },
        { title: "Social Media", category: "Service", link: "Services_Social Media Management.html" }
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