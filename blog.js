// Fetch Dev.to articles
async function fetchDevToArticles() {
    const loading = document.getElementById('loading');
    const blogPosts = document.getElementById('blog-posts');
    
    try {
        const response = await fetch('https://dev.to/api/articles?username=fidelisesq&per_page=12');
        const articles = await response.json();
        
        loading.style.display = 'none';
        
        if (articles.length === 0) {
            blogPosts.innerHTML = '<p class="no-articles">No articles found.</p>';
            return;
        }
        
        articles.forEach(article => {
            const articleCard = createArticleCard(article);
            blogPosts.appendChild(articleCard);
        });
        
    } catch (error) {
        loading.style.display = 'none';
        blogPosts.innerHTML = '<p class="error">Failed to load articles. Please try again later.</p>';
        console.error('Error fetching articles:', error);
    }
}

// Create article card HTML
function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'blog-post-card';
    
    const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="blog-post-image">
            <img src="${article.cover_image || 'https://via.placeholder.com/400x200?text=Dev.to+Article'}" alt="${article.title}" loading="lazy">
        </div>
        <div class="blog-post-content">
            <div class="blog-post-meta">
                <span class="blog-post-date">${publishedDate}</span>
                <span class="blog-post-reading-time">${article.reading_time_minutes} min read</span>
            </div>
            <h3 class="blog-post-title">${article.title}</h3>
            <p class="blog-post-description">${article.description}</p>
            <div class="blog-post-tags">
                ${article.tag_list.slice(0, 3).map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
            </div>
            <div class="blog-post-stats">
                <span><i class="fas fa-heart"></i> ${article.public_reactions_count}</span>
                <span><i class="fas fa-comment"></i> ${article.comments_count}</span>
            </div>
            <a href="${article.url}" class="blog-post-link" target="_blank">
                Read on Dev.to <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
    
    return card;
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    fetchDevToArticles();
});