// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 모바일 네비게이션 토글
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // 스크롤 시 네비게이션 바 스타일 변경
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 스무스 스크롤링
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 네비게이션 바 높이만큼 조정
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 모바일에서 메뉴 닫기
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // 애니메이션을 적용할 요소들
    const animateElements = document.querySelectorAll('.service-card, .result-card, .step, .about-content, .contact-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // 통계 숫자 카운터 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                if (element.textContent.includes('%')) {
                    element.textContent = Math.floor(start) + '%';
                } else if (element.textContent.includes('+')) {
                    element.textContent = Math.floor(start) + '+';
                } else if (element.textContent.includes('/')) {
                    element.textContent = Math.floor(start) + '/7';
                } else {
                    element.textContent = Math.floor(start);
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (element.textContent.includes('%')) {
                    element.textContent = target + '%';
                } else if (element.textContent.includes('+')) {
                    element.textContent = target + '+';
                } else if (element.textContent.includes('/')) {
                    element.textContent = target + '/7';
                } else {
                    element.textContent = target;
                }
            }
        };
        
        updateCounter();
    };
    
    // 통계 섹션이 화면에 보일 때 카운터 시작
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // 폼 제출 처리
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 간단한 유효성 검사
            if (!data.name || !data.phone || !data.email || !data.business) {
                showNotification('모든 필수 항목을 입력해주세요.', 'error');
                return;
            }
            
            // 이메일 형식 검사
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
                return;
            }
            
            // 전화번호 형식 검사
            const phoneRegex = /^[0-9-+\s()]+$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('올바른 전화번호 형식을 입력해주세요.', 'error');
                return;
            }
            
            // 성공 메시지 표시
            showNotification('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.', 'success');
            
            // 폼 초기화
            this.reset();
        });
    }
    
    // 알림 메시지 표시 함수
    function showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 새 알림 생성
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // 스타일 적용
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // 닫기 버튼 이벤트
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // 자동 제거 (5초 후)
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        document.body.appendChild(notification);
    }
    
    // 차트 애니메이션
    function animateChart() {
        const chartLine = document.querySelector('.chart-line');
        const dots = document.querySelectorAll('.dot');
        
        if (chartLine) {
            chartLine.style.width = '0';
            setTimeout(() => {
                chartLine.style.transition = 'width 2s ease-out';
                chartLine.style.width = '100%';
            }, 500);
        }
        
        dots.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.opacity = '1';
                dot.style.transform = 'scale(1)';
            }, 1000 + (index * 500));
        });
    }
    
    // 차트 섹션이 화면에 보일 때 애니메이션 시작
    const chartObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateChart();
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const chartSection = document.querySelector('.hero-visual');
    if (chartSection) {
        chartObserver.observe(chartSection);
    }
    
    // 서비스 카드 호버 효과
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 결과 카드 호버 효과
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 프로세스 단계 애니메이션
    const processSteps = document.querySelectorAll('.step');
    const processObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'all 0.6s ease-out';
        processObserver.observe(step);
    });
    
    // CTA 버튼 클릭 효과
    const ctaButtons = document.querySelectorAll('.cta .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 리플 효과 생성
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 스크롤 진행률 표시
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // 스크롤 진행률 바 생성 또는 업데이트
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #00d4ff, #667eea);
                z-index: 10001;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // 페이지 로드 완료 후 초기화
    window.addEventListener('load', function() {
        // 로딩 애니메이션 제거
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
        
        // 초기 애니메이션 시작
        document.body.classList.add('loaded');
    });
    
    // 키보드 네비게이션 지원
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // ESC 키로 모바일 메뉴 닫기
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
    
    // 터치 제스처 지원 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 왼쪽으로 스와이프
                console.log('Left swipe');
            } else {
                // 오른쪽으로 스와이프
                console.log('Right swipe');
            }
        }
    }
    
    // 성능 최적화: 스크롤 이벤트 쓰로틀링
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }
    
    function updateScrollProgressThrottled() {
        ticking = false;
    }
    
    window.addEventListener('scroll', requestTick);
    
    // CSS 애니메이션 키프레임 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .loaded .hero-content {
            animation: fadeInUp 1s ease-out;
        }
        
        .loaded .hero-image {
            animation: fadeInUp 1s ease-out 0.3s both;
        }
    `;
    document.head.appendChild(style);
    
    // 페이지 가시성 변경 감지 (탭 전환 시)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때
            document.title = '내바 - 상담 문의 대기 중...';
        } else {
            // 페이지가 다시 보일 때
            document.title = '내바 - 퍼포먼스 마케팅 전문기업';
        }
    });
    
    // 에러 처리
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // 에러 로깅 또는 사용자에게 알림
    });
    
    // 성능 모니터링
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
            }, 0);
        });
    }
});

// 서비스 워커 등록 (PWA 지원)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker 등록 성공:', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker 등록 실패:', error);
            });
    });
}

