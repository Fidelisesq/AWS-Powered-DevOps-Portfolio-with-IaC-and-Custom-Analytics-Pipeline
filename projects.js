// Fetch GitHub repositories
async function fetchGitHubProjects() {
    const loading = document.getElementById('loading');
    const projectsContainer = document.getElementById('github-projects');
    
    try {
        const response = await fetch('https://api.github.com/users/Fidelisesq/repos?sort=updated&per_page=20');
        const repos = await response.json();
        
        loading.style.display = 'none';
        
        if (repos.length === 0) {
            projectsContainer.innerHTML = '<p class="no-projects">No projects found.</p>';
            return;
        }
        
        // Filter out forks and sort by date (most recent first)
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        filteredRepos.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        loading.style.display = 'none';
        projectsContainer.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>';
        console.error('Error fetching projects:', error);
    }
}

// Create project card HTML
function createProjectCard(repo) {
    const card = document.createElement('article');
    card.className = 'github-project-card';
    
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const languageColor = getLanguageColor(repo.language);
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">
                <i class="fab fa-github"></i>
            </div>
            <div class="project-meta">
                <span class="project-updated">Updated ${updatedDate}</span>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${repo.name}</h3>
            <p class="project-description">${repo.description || 'No description available'}</p>
            
            ${repo.topics && repo.topics.length > 0 ? `
                <div class="project-topics">
                    ${repo.topics.slice(0, 4).map(topic => `<span class="project-topic">${topic}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="project-stats">
                ${repo.language ? `
                    <span class="project-language">
                        <span class="language-dot" style="background-color: ${languageColor}"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                <span class="project-stat">
                    <i class="fas fa-star"></i> ${repo.stargazers_count}
                </span>
                <span class="project-stat">
                    <i class="fas fa-code-branch"></i> ${repo.forks_count}
                </span>
            </div>
            
            <div class="project-links">
                ${repo.homepage ? `
                    <a href="${repo.homepage}" class="project-link live" target="_blank">
                        Live Demo <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
                <a href="${repo.html_url}" class="project-link" target="_blank">
                    View Code <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Get language color for visual indication
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Shell': '#89e051',
        'Go': '#00ADD8',
        'Dockerfile': '#384d54',
        'HCL': '#844FBA',
        'YAML': '#cb171e'
    };
    return colors[language] || '#586069';
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
    fetchGitHubProjects();
});