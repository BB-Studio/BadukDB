/**
 * Dark Mode Theme and Navigation
 * Forces dark theme application and handles navigation
 */
document.addEventListener('DOMContentLoaded', function() {
    // Always use dark theme
    document.documentElement.setAttribute('data-theme', 'dark');

    // Initialize Bootstrap collapse with animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Pre-calculate the height before animation
            if (!navbarCollapse.classList.contains('show')) {
                navbarCollapse.style.display = 'block';
                const height = navbarCollapse.scrollHeight;
                navbarCollapse.style.display = '';
            }
        });
    }
});