const global = {
  currentPage: window.location.pathname,
  search: { term: '', type: '', page: 1, totalPages: 1 },
  api: {
    apiKey: '2cd1686cd69c34e4dc8772cc7302ebec',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

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
  const genresItem = genres.map((genre) => `<li>${genre.name}</li>`).join('');

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
      ${vote_average ? `${vote_average.toFixed(1)} / 10` : 'No Average yet'}
    </p>
    <p class="text-muted">Release Date: ${release_date}</p>
    <p>${overview ? overview : 'No Info'}</p>
    <h5>Genres</h5>
    <ul class="list-group">${genresItem}</ul>
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

async function displayShowDetails() {
  const url = window.location.search;
  const id = url.match(/id=(\d+)/)[1];

  const {
    backdrop_path,
    first_air_date,
    genres,
    homepage,
    last_air_date,
    name,
    number_of_episodes,
    overview,
    poster_path,
    production_companies,
    status,
    vote_average,
  } = await fetchAPIData(`tv/${id}`);

  // Overlay for background image
  displayBackgroundImage('tv', backdrop_path);

  const div = document.createElement('div');

  // Make genres LI items
  const genresItem = genres.map((genre) => `<li>${genre.name}</li>`).join('');

  // Make companies string
  const companies = production_companies
    .map((companie, idx, arr) =>
      idx === arr.length - 1 ? `${companie.name}.` : `${companie.name}, `
    )
    .join('');

  const hasHomePage = homepage
    ? `<a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>`
    : '<button disabled class="btn">No Movie Homepage</button>';

  div.innerHTML = `
  <div class="details-top">
   <div>
    <img src="${
      poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : '../images/no-image.jpg'
    }" class="card-img-top" alt="${name}" />
   </div>
   <div>
    <h2>${name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${vote_average ? `${vote_average.toFixed(1)} / 10` : 'No Average yet'}
    </p>
    <p class="text-muted">Release Date: ${first_air_date}</p>
    <p>${overview ? overview : 'No Info'}</p>
    <h5>Genres</h5>
    <ul class="list-group">${genresItem}</ul>
    ${hasHomePage}
   </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes: </span>${number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode To Air: </span>${last_air_date}</li>
      <li><span class="text-secondary">Status: </span>${status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${companies}</div>
  </div>
  `;

  const container = document.getElementById('show-details');
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

// Search Movies / Shows
async function search() {
  const url = window.location.search;
  const [, type, searchTerm] = url.match(/type=(.*?)&search-term=(.*?)$/);

  global.search.type = type;
  global.search.term = searchTerm;

  if (global.search.term !== '' && global.search.term !== null) {
    // @todo - make request and display results
    const results = await searchAPIData();
    console.log(results);
  } else {
    showAlert('Please enter a search term');
  }
}

// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

// Swiper control
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Fetch data from TMBD API
async function fetchAPIData(endpoint) {
  showSpinner();

  const { apiUrl } = global.api;
  const { apiKey } = global.api;

  const response = await fetch(`${apiUrl}${endpoint}?api_key=${apiKey}`);
  const data = await response.json();

  hideSpinner();

  return data;
}

// Make request to Search
async function searchAPIData() {
  showSpinner();

  const { apiUrl } = global.api;
  const { apiKey } = global.api;
  const { type } = global.search;
  const { term } = global.search;

  const response = await fetch(
    `${apiUrl}search/${type}?api_key=${apiKey}&query=${term}`
  );
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

// Show Alert
function showAlert(message, className) {
  const container = document.getElementById('alert');
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));

  container.appendChild(alertEl);

  setTimeout(() => {
    container.removeChild(alertEl);
  }, 5000);
}

//Init app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }

  highLightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
