document.addEventListener('DOMContentLoaded', () => {
    const resultDiv = document.getElementById('result');
    const movies = JSON.parse(localStorage.getItem('movieResults'));

    if (!movies || movies.length === 0) {
        resultDiv.innerHTML = '<p>No results found!</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Set a background image if available
        if (movie.poster_path) {
            movieCard.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`;
        } else {
            movieCard.style.backgroundColor = '#333';
        }

        movieCard.innerHTML = `
            <div class="movie-info">
                <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'})</h3>
                <p>${movie.overview ? movie.overview.slice(0, 150) + '...' : 'No description available.'}</p>
                <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="details-link">View More</a>
            </div>
        `;

        resultDiv.appendChild(movieCard);
    });
});
