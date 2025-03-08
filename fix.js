// This script fixes any remaining "rd" text fragments in the hero section
document.addEventListener('DOMContentLoaded', function() {
  // Look for any orphaned text nodes containing only "rd" in the hero section
  const header = document.querySelector('header.animated-gradient');
  if (header) {
    // Create a walker to find all text nodes
    const walker = document.createTreeWalker(
      header,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    // Check each text node
    let node;
    const nodesToRemove = [];
    while ((node = walker.nextNode())) {
      // If the text content is just "rd" or contains it, add to removal list
      if (node.textContent.trim() === "rd") {
        nodesToRemove.push(node);
      }
    }

    // Remove the problematic nodes
    nodesToRemove.forEach(node => {
      node.parentNode.removeChild(node);
    });
  }
});
