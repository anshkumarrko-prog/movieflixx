// --- SEARCH PAGE FUNCTIONALITY ---
const searchbtn = document.getElementById('search-btn')
const placeholder = document.getElementById('search-placeholder')
const resultsContainer = document.getElementById('movie-results-container')

if (searchbtn) {
    searchbtn.addEventListener('click', function() {
        const searchinput = document.getElementById('movie-search-input').value.trim()
        
        if (!searchinput) return

        fetch(`https://www.omdbapi.com/?apikey=dc10af44&t=${searchinput}`)
            .then(res => res.json())
            .then(data => {
                if (data.Response === "True") {
                    if (placeholder) placeholder.style.display = 'none'
                    resultsContainer.style.display = 'block'

                    resultsContainer.innerHTML = `
                        <div class="movie-card">
                            <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/150x220?text=No+Poster'}" alt="${data.Title}" class="movie-poster">
                            <div class="movie-info">
                                <div class="movie-header">
                                    <h3 class="movie-title">${data.Title}</h3>
                                    <span class="movie-rating">⭐ ${data.imdbRating}</span>
                                </div>
                                <div class="movie-meta">
                                    <span>${data.Runtime}</span>
                                    <span>${data.Genre}</span>
                                    <button class="watchlist-btn" onclick="addToWatchlist('${data.imdbID}', '${data.Title.replace(/'/g, "\\'")}', '${data.Poster}', '${data.imdbRating}', '${data.Runtime}', '${data.Genre}', \`${data.Plot.replace(/`/g, "\\`")}\`)">
                                        + Watchlist
                                    </button>
                                </div>
                                <p class="movie-plot">${data.Plot}</p>
                            </div>
                        </div>
                    `
                } else {
                    if (placeholder) placeholder.style.display = 'none'
                    resultsContainer.style.display = 'block'
                    resultsContainer.innerHTML = `<div class="empty-title" style="text-align: center; color: var(--text-muted);">Unable to find film. Try another search.</div>`
                }
            })
    })
}

// Function to save movie to localStorage
function addToWatchlist(imdbID, title, poster, rating, runtime, genre, plot) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
    
    const exists = watchlist.some(movie => movie.imdbID === imdbID)
    if (!exists) {
        watchlist.push({ imdbID, title, poster, rating, runtime, genre, plot })
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
        alert(`${title} added to your Watchlist!`)
    } else {
        alert(`${title} is already in your Watchlist.`)
    }
}

// --- WATCHLIST PAGE FUNCTIONALITY ---
const watchlistContainer = document.getElementById('watchlist-container')
const emptyWatchlist = document.getElementById('empty-watchlist')
const watchlistSearchInput = document.getElementById('watchlist-search-input')

function renderWatchlist(filterQuery = '') {
    if (!watchlistContainer) return

    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

    // Filter list if user is typing in search bar on watchlist page
    if (filterQuery) {
        watchlist = watchlist.filter(movie => 
            movie.title.toLowerCase().includes(filterQuery.toLowerCase())
        )
    }

    if (watchlist.length === 0) {
        if (emptyWatchlist) emptyWatchlist.style.display = 'flex'
        watchlistContainer.innerHTML = ''
    } else {
        if (emptyWatchlist) emptyWatchlist.style.display = 'none'
        
        watchlistContainer.innerHTML = watchlist.map(movie => `
            <div class="movie-card">
                <img src="${movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/150x220?text=No+Poster'}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <div class="movie-header">
                        <h3 class="movie-title">${movie.title}</h3>
                        <span class="movie-rating">⭐ ${movie.rating}</span>
                    </div>
                    <div class="movie-meta">
                        <span>${movie.runtime}</span>
                        <span>${movie.genre}</span>
                        <button class="watchlist-btn" onclick="removeFromWatchlist('${movie.imdbID}')">
                            - Remove
                        </button>
                    </div>
                    <p class="movie-plot">${movie.plot}</p>
                </div>
            </div>
        `).join('')
    }
}

// Function to remove a movie from Watchlist
function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID)
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    renderWatchlist()
}

// Listen for input filtering in watchlist search input
if (watchlistSearchInput) {
    watchlistSearchInput.addEventListener('input', function(e) {
        renderWatchlist(e.target.value)
    })
}

// Initial call to render watchlist if on getstarted.html
renderWatchlist()