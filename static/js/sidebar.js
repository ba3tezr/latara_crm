/**
 * ===================================================================
 * ORIGIN.APP - Sidebar Navigation JavaScript
 * ===================================================================
 * Handles sidebar toggle, collapse, and responsive behavior
 * ===================================================================
 */

(function() {
    'use strict';

    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.querySelector('.main-content');
    
    // State
    let isMobile = window.innerWidth <= 992;
    let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

    /**
     * Initialize sidebar
     */
    function init() {
        // Set initial state
        if (!isMobile && isCollapsed) {
            sidebar.classList.add('collapsed');
            if (mainContent) {
                mainContent.classList.add('sidebar-collapsed');
            }
        }

        // Set active link
        setActiveLink();

        // Setup event listeners
        setupEventListeners();

        // Handle window resize
        handleResize();
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Sidebar toggle (desktop)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }

        // Mobile toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', toggleMobileSidebar);
        }

        // Overlay click (mobile)
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeMobileSidebar);
        }

        // Dropdown toggles
        const dropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', handleDropdownToggle);
        });

        // Window resize
        window.addEventListener('resize', debounce(handleResize, 250));

        // ESC key to close mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobile && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            }
        });
    }

    /**
     * Toggle sidebar (desktop)
     */
    function toggleSidebar() {
        if (isMobile) return;

        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed');
        
        if (mainContent) {
            mainContent.classList.toggle('sidebar-collapsed');
        }

        // Save state
        localStorage.setItem('sidebarCollapsed', isCollapsed);

        // Update toggle icon with animation
        const icon = sidebarToggle.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                icon.className = isCollapsed ? 'fas fa-angle-double-left' : 'fas fa-angle-double-right';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }

        console.log('Sidebar toggled:', isCollapsed ? 'collapsed' : 'expanded');
    }

    /**
     * Toggle mobile sidebar
     */
    function toggleMobileSidebar() {
        if (!isMobile) return;

        const isOpen = sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    }

    /**
     * Open mobile sidebar
     */
    function openMobileSidebar() {
        sidebar.classList.add('mobile-open');
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile sidebar
     */
    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    /**
     * Handle dropdown toggle
     */
    function handleDropdownToggle(e) {
        e.preventDefault();
        const dropdownItem = e.currentTarget.closest('.sidebar-dropdown');
        
        if (dropdownItem) {
            // Close other dropdowns
            const allDropdowns = document.querySelectorAll('.sidebar-dropdown.open');
            allDropdowns.forEach(dropdown => {
                if (dropdown !== dropdownItem) {
                    dropdown.classList.remove('open');
                }
            });

            // Toggle current dropdown
            dropdownItem.classList.toggle('open');
        }
    }

    /**
     * Set active link based on current URL
     */
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.sidebar-nav-link');

        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Exact match or starts with (for child pages)
            if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
                link.classList.add('active');
                
                // Open parent dropdown if link is inside one
                const parentDropdown = link.closest('.sidebar-dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.add('open');
                }
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 992;

        // Changed from mobile to desktop
        if (wasMobile && !isMobile) {
            closeMobileSidebar();
            
            // Restore collapsed state
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
                if (mainContent) {
                    mainContent.classList.add('sidebar-collapsed');
                }
            }
        }

        // Changed from desktop to mobile
        if (!wasMobile && isMobile) {
            sidebar.classList.remove('collapsed');
            if (mainContent) {
                mainContent.classList.remove('sidebar-collapsed');
            }
        }
    }

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Close mobile sidebar when clicking on a link
     */
    function setupLinkClickHandlers() {
        const links = document.querySelectorAll('.sidebar-nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile) {
                    setTimeout(closeMobileSidebar, 300);
                }
            });
        });
    }

    /**
     * Smooth scroll to top when navigating
     */
    function smoothScrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Setup link click handlers after init
    setTimeout(setupLinkClickHandlers, 100);

    // Expose functions for external use
    window.sidebarAPI = {
        toggle: toggleSidebar,
        toggleMobile: toggleMobileSidebar,
        closeMobile: closeMobileSidebar,
        setActiveLink: setActiveLink
    };

})();
