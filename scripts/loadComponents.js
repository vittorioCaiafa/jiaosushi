async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

// Load all components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('hero', '/components/hero.html');
  loadComponent('characteristics', '/components/characteristics.html');
  loadComponent('comments', '/components/comments.html');
  loadComponent('footer', '/components/footer.html');
}); 