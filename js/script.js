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

// Display Movie Details
async function displayMovieDetails() {
  const url = window.location.search;
  const id = url.match(/id=(\d+)/)[1];

  const {
    backdrop_path,
    budget,
    genres,
    homepage,
    overview,
    poster_path,
    production_companies,
    release_date,
    revenue,
    runtime,
    status,
    title,
    vote_average,
  } = await fetchAPIData(`movie/${id}`);

  // Overlay for background image
  displayBackgroundImage('movie', backdrop_path);

  const div = document.createElement('div');

  // Make genres LI items
  const genresLi = genres.map((genre) => `<li>${genre.name}</li>`).join('');

  // Make companies string
  const companies = production_companies
    .map((companie, idx, arr) =>
      idx === arr.length - 1 ? `${companie.name}.` : `${companie.name}, `
    )
    .join('');

  const hasHomePage = homepage
    ? `<a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>`
    : '<button disabled class="btn">No Movie Homepage</button>';

  const budgetNum = budget ? `$${Number(budget).toLocaleString()}` : 'No Info';

  const revenueNum = revenue
    ? `$${Number(revenue).toLocaleString()}`
    : 'No Info';

  div.innerHTML = `
  <div class="details-top">
   <div>
    <img src="${
      poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : '../images/no-image.jpg'
    }" class="card-img-top" alt="${title}" />
   </div>
   <div>
    <h2>${title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${release_date}</p>
    <p>${overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">${genresLi}</ul>
    ${hasHomePage}
   </div>
  </div>
  <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget: </span>${budgetNum}</li>
        <li><span class="text-secondary">Revenue: </span>${revenueNum}</li>
        <li><span class="text-secondary">Runtime: </span>${runtime} minutes</li>
        <li><span class="text-secondary">Status: </span>${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${companies}</div>
  </div>
  `;

  const container = document.getElementById('movie-details');
  container.appendChild(div);
}

// Display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
  const container = type === 'movie' ? '#movie-details' : '#show-details';

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('overlay');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;

  document.querySelector(container).appendChild(overlayDiv);
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
      displayMovieDetails();
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
