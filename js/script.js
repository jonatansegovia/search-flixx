const global = { currentPage: window.location.pathname };

// Display 20 more popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach(({ id, poster_path, original_title, release_date }) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
          <a href="movie-details.html?id=${id}">
            <img
              src="${
                poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : '../images/no-image.jpg'
              }"
              class="card-img-top"
              alt="${original_title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${original_title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${release_date}</small>
            </p>
          </div>`;

    const container = document.getElementById('popular-movies');

    container.appendChild(div);
  });
}

// Display 20 more popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach(({ id, poster_path, original_name, first_air_date }) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
          <a href="tv-details.html?id=${id}">
            <img
              src="${
                poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : '../images/no-image.jpg'
              }"
              class="card-img-top"
              alt="${original_name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${original_name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${first_air_date}</small>
            </p>
          </div>`;

    const container = document.getElementById('popular-shows');

    container.appendChild(div);
  });
}

// Fetch data from TMBD API
async function fetchAPIData(endpoint) {
  showSpinner();

  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = '2cd1686cd69c34e4dc8772cc7302ebec';

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await response.json();

  hideSpinner();

  return data;
}

// Spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

//Highlight active link
function highLightActiveLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

//Init app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      console.log('Movie details');
      break;
    case '/tv-details.html':
      console.log('Tv details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }

  highLightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
