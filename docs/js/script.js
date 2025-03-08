// Card Alert Interface - Main JavaScript

// Architecture Diagram for How it Works section
function initArchitectureDiagram() {
  // This would normally use a library like D3.js to create an interactive diagram
  console.log("Architecture diagram initialized");
}

// Demo Transaction Data
const demoTransactions = [
  { id: 1, amount: 49.99, location: "New York", type: "retail", timestamp: "2025-03-07T14:22:31Z", riskScore: 12 },
  { id: 2, amount: 999.99, location: "Online", type: "online", timestamp: "2025-03-07T16:45:12Z", riskScore: 42 },
  { id: 3, amount: 2499.50, location: "Paris, France", type: "atm", timestamp: "2025-03-08T03:12:05Z", riskScore: 78 },
  { id: 4, amount: 5.99, location: "Chicago", type: "retail", timestamp: "2025-03-08T09:30:22Z", riskScore: 8 },
  { id: 5, amount: 3750.00, location: "Unknown", type: "transfer", timestamp: "2025-03-08T11:02:45Z", riskScore: 91 }
];

// API Demo Logic
function enhancedApiDemo() {
  const checkButton = document.getElementById('check-transaction');
  if (!checkButton) return;
  
  // The rest of this would add more sophisticated demo functionality
  // such as transaction history and pattern visualization
}

// API Documentation Interactive Examples
function setupCodeExamples() {
  // This would set up interactive code examples that users can edit and see results
  console.log("Interactive code examples initialized");
}

// Analytics Dashboard Preview
function initDashboardPreview() {
  // This would initialize a preview of the analytics dashboard
  console.log("Dashboard preview initialized");
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Initialize tabs
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => {
        btn.classList.remove('border-indigo-600', 'text-indigo-600');
        btn.classList.add('text-gray-500');
      });
      
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked button and corresponding content
      button.classList.add('border-indigo-600', 'text-indigo-600');
      button.classList.remove('text-gray-500');
      
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Initialize copy code functionality
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const code = button.getAttribute('data-code');
      navigator.clipboard.writeText(code);
      
      // Show copied feedback
      const originalIcon = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';
      
      setTimeout(() => {
        button.innerHTML = originalIcon;
      }, 2000);
    });
  });
  
  // Initialize other components
  initArchitectureDiagram();
  enhancedApiDemo();
  setupCodeExamples();
  initDashboardPreview();
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
});

// Animated elements on scroll
function initScrollAnimations() {
  // This would add animations to elements as they scroll into view
  // using Intersection Observer API
  const animatedElements = document.querySelectorAll('.feature-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// Initialize scroll animations
window.addEventListener('load', initScrollAnimations);
