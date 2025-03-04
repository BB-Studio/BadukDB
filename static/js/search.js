document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const topicFilter = document.getElementById('topic-filter');
    const tagFilter = document.getElementById('tag-filter');
    const rankFilter = document.getElementById('rank-filter');
    const resultsContainer = document.getElementById('results-container');
    const loadMoreBtn = document.getElementById('load-more');

    let currentPage = 1;
    let isLoading = false;
    let debounceTimer;

    // Debounce function
    function debounce(func, wait) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, wait);
    }

    // Reset search
    function resetSearch() {
        currentPage = 1;
        resultsContainer.innerHTML = '';
        loadMoreBtn.style.display = 'none';
        isLoading = false;  // Reset loading state
    }

    // Search function
    function performSearch(resetPage = true) {
        if (isLoading) return;
        isLoading = true;

        if (resetPage) {
            resetSearch();
        }

        const searchQuery = searchInput.value;
        const selectedTopic = topicFilter.value;
        const selectedTag = tagFilter.value;
        const selectedRank = rankFilter.value;

        let url = `/api/search?page=${currentPage}&q=${encodeURIComponent(searchQuery)}&sort=-publish_date`; //Always sort by newest

        if (selectedTopic) {
            url += `&topics[]=${selectedTopic}`;
        }

        if (selectedTag) {
            url += `&tags[]=${selectedTag}`;
        }

        if (selectedRank) {
            url += `&rank=${selectedRank}`;
        }

        // Show loading state
        if (currentPage === 1) {
            resultsContainer.innerHTML = '<div class="text-center my-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Always clear loading indicator
                if (currentPage === 1) {
                    resultsContainer.innerHTML = '';
                }

                if (data.lectures.length === 0 && currentPage === 1) {
                    resultsContainer.innerHTML = '<div class="col-12 text-center my-5"><p>No lectures found matching your criteria.</p></div>';
                    loadMoreBtn.style.display = 'none';
                    isLoading = false;  // Reset loading state
                    return;
                }

                // Append lectures to the container
                data.lectures.forEach(lecture => {
                    const lectureEl = document.createElement('div');
                    lectureEl.className = 'col-md-4 mb-4';
                    lectureEl.innerHTML = `
                        <div class="lecture-card">
                            <div class="lecture-thumbnail" onclick="openVideoModal('${lecture.youtube_id}')" style="cursor: pointer;">
                                <img src="${lecture.thumbnail_url}" alt="${lecture.title}">
                                <i class="fas fa-play-circle play-button"></i>
                            </div>
                            <h3 class="lecture-title" onclick="openVideoModal('${lecture.youtube_id}')" style="cursor: pointer;">
                                ${lecture.title}
                            </h3>
                            <div class="lecture-meta">
                                <div class="topics mb-1">
                                    ${lecture.topics.map(topic => `<span class="badge bg-primary me-1">${topic}</span>`).join('')}
                                </div>
                                <div class="tags mb-1">
                                    ${lecture.tags.map(tag => `<span class="badge bg-info me-1">${tag}</span>`).join('')}
                                </div>
                                <div class="rank mb-1">
                                    ${lecture.rank ? `<span class="badge bg-secondary">${lecture.rank}</span>` : ''}
                                </div>
                                <div class="date text-muted small">
                                    ${new Date(lecture.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(lectureEl);
                });

                // Show/hide load more button
                loadMoreBtn.style.display = data.has_next ? 'inline-block' : 'none';

                // Update UI state
                isLoading = false;
            })
            .catch(error => {
                console.error('Search error:', error);
                resultsContainer.innerHTML = '<div class="col-12 text-center my-5"><p>An error occurred while fetching results. Please try again.</p></div>';
                loadMoreBtn.style.display = 'none';
                isLoading = false;  // Reset loading state even on error
            });
    }

    // Event listeners
    searchInput.addEventListener('input', () => debounce(() => performSearch(true), 300));
    topicFilter.addEventListener('change', () => performSearch(true));
    tagFilter.addEventListener('change', () => performSearch(true));
    rankFilter.addEventListener('change', () => performSearch(true));

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        performSearch(false);
    });

    // Get URL parameters and set initial filter values
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic');
    const tag = urlParams.get('tag');

    if (topic) {
        const option = Array.from(topicFilter.options).find(opt => opt.text === topic);
        if (option) option.selected = true;
    }
    if (tag) {
        const option = Array.from(tagFilter.options).find(opt => opt.text === tag);
        if (option) option.selected = true;
    }

    // Initial search
    performSearch(true);
});