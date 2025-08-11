// Simple auth guard using localStorage markers set by login/signup
// Works across root, /pages, and /auth directories
(function(){
  function computePaths() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const isInAuth = path.includes('/auth/');
    const isInPages = path.includes('/pages/');
    return {
      toIndex: isInAuth ? '../index.html' : isInPages ? '../index.html' : 'index.html',
      toLogin: isInAuth ? 'login.html' : isInPages ? '../auth/login.html' : 'auth/login.html'
    };
  }

  function isAuthenticated() {
    try {
      return Boolean(localStorage.getItem('userId'));
    } catch {
      return false;
    }
  }

  window.requireAuth = function requireAuth() {
    if (!isAuthenticated()) {
      const { toLogin } = computePaths();
      window.location.replace(toLogin);
    }
  };

  window.redirectIfAuthenticated = function redirectIfAuthenticated() {
    if (isAuthenticated()) {
      const { toIndex } = computePaths();
      window.location.replace(toIndex);
    }
  };
})();


