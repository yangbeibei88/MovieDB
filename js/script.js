const global = {
  currentPage: window.location.pathname,
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMWUyN2Y1MjQ2NWM4MWY1YjNlMWQ4OGM1NjE1MTUzMyIsInN1YiI6IjY0YmI1NDc0ZWI3OWMyMDBlMjhjYjYwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PiSeqGdciSnRUE7KdUT-kkcLVLYk2nBc_SZdbxP9TTo",
  },
};

const spinner = document.querySelector(".spinner");

// Hilight active links
function highlightActive() {
  const navLinks = document.querySelectorAll(".nav-link");
  console.log(navLinks);
  // method 1:
  // switch (global.currentPage) {
  //   case "/":
  //   case "/index.html":
  //     navLinks[0].classList.add("active");
  //     break;
  //   case "/shows.html":
  //     navLinks[1].classList.add("active");
  //     break;
  // }
  // method 2:
  navLinks.forEach((navLink) => {
    // another way to write if statement:
    // if(navLink["pathname"] === global.currentPage)
    if (navLink.getAttribute("href") === global.currentPage) {
      navLink.classList.add("active");
    }
    console.log(navLink["pathname"]);
    console.log(global.currentPage);
    console.log(navLink);
  });
}

// display popular movies on home page
function displayPopularMovies() {
  fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.results);
      const movies = data.results;
      movies.forEach((movie) => {
        const popularMovies = document.getElementById("popular-movies");
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<a href="movie-details.html?id=${movie.id}">

        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
            : `<img src="..images/no-image.jpg" alt="${movie.title}" />`
        }

      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release:
          ${movie.release_date}</small>
        </p>
      </div>`;
        popularMovies.appendChild(div);
      });
    })
    .catch((err) => console.error(err));
}

// display popular TV shows
function displayPopularTVShows() {
  fetch(
    "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const shows = data.results;
      shows.forEach((show) => {
        const popularShows = document.getElementById("popular-shows");
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<a href="tv-details.html?id=${show.id}">

        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" />`
            : `<img src="..images/no-image.jpg" alt="${show.name}" />`
        }

      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release:
          ${show.first_air_date}</small>
        </p>
      </div>`;
        popularShows.appendChild(div);
      });
    })

    .catch((err) => console.error(err));
}

// display movie details
function displayMovieDetails() {
  // const currentMovieID = location.search.slice(4);
  const currentMovieID = location.search.split("=")[1];
  fetch(
    `https://api.themoviedb.org/3/movie/${currentMovieID}?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.genres);
      const movieDetails = document.getElementById("movie-details");
      const DetailsDiv = document.createElement("div");

      // genreArr = Array.from(data.genres, (genre) => {
      //   return `<li>${genre.name}<li>`;
      // });
      genreArr = data.genres
        .map((genre) => {
          return `<li>${genre.name}<li>`;
        })
        .join("");
      // prodCompanyArr = Array.from(data.production_companies, (company) => {
      //   return company.name;
      // });
      prodCompanyArr = data.production_companies
        .map((company) => {
          return `<span>${company.name}</span>`;
        })
        .join(", ");

      displayBackdrop(data.backdrop_path);

      DetailsDiv.innerHTML = `<div class="details-top"><div>
      ${
        data.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${data.poster_path}"
        class="card-img-top"
        alt="${data.title}" />`
          : `<img src="images/no-image.jpg"
        class="card-img-top"
        alt="${data.title}" />`
      }
      
    </div>
    <div>
      <h2>${data.title}</h2>
      <h3 class="tagline">${data.tagline}</h3>
      <p>
        <i
          class="fas fa-star text-primary"></i>
        ${data.vote_average.toFixed(2)} / 10
      </p>
      <p class="text-muted">Release Date:
      ${data.release_date}</p>
      <p>
      ${data.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group" id="genre">
      ${genreArr}
      </ul>
      <a href="${data.homepage}" target="_blank"
        class="btn">Visit Movie Homepage</a>
    </div></div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span
            class="text-secondary">Budget:</span>
          ${formatMoney(data.budget)}</li>
        <li><span
            class="text-secondary">Revenue:</span>
          ${formatMoney(data.revenue)}</li>
        <li><span
            class="text-secondary">Runtime:</span>
          ${data.runtime} minutes</li>
        <li><span
            class="text-secondary">Status:</span>
          ${data.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${prodCompanyArr}</div>
    </div>`;
      movieDetails.appendChild(DetailsDiv);
    })
    .catch((err) => console.error(err));
}

// display TV details
function displayTVDetails() {
  const currentTvID = location.search.split("=")[1];
  fetch(
    `https://api.themoviedb.org/3/tv/${currentTvID}?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.genres);
      const tvDetails = document.getElementById("show-details");
      const DetailsDiv = document.createElement("div");

      // genreArr = Array.from(data.genres, (genre) => {
      //   return `<li>${genre.name}<li>`;
      // });
      genreArr = data.genres
        .map((genre) => {
          return `<li>${genre.name}<li>`;
        })
        .join("");
      // prodCompanyArr = Array.from(data.production_companies, (company) => {
      //   return company.name;
      // });
      prodCompanyArr = data.production_companies
        .map((company) => {
          return `<span>${company.name}</span>`;
        })
        .join(", ");

      displayBackdrop(data.backdrop_path);

      DetailsDiv.innerHTML = `<div class="details-top"><div>
      ${
        data.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${data.poster_path}"
        class="card-img-top"
        alt="${data.title}" />`
          : `<img src="images/no-image.jpg"
        class="card-img-top"
        alt="${data.title}" />`
      }
      
    </div>
    <div>
      <h2>${data.name}</h2>
      <h3 class="tagline">${data.tagline}</h3>
      <p>
        <i
          class="fas fa-star text-primary"></i>
        ${data.vote_average.toFixed(2)} / 10
      </p>
      <p class="text-muted">Release Date:
      ${data.first_air_date}</p>
      <p>
      ${data.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group" id="genre">
      ${genreArr}
      </ul>
      <a href="${data.homepage}" target="_blank"
        class="btn">Visit Show Homepage</a>
    </div></div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span
            class="text-secondary">Number Of Seasons:</span>
          ${data.number_of_seasons}</li>
        <li><span
            class="text-secondary">Number Of Episodes:</span>
          ${data.number_of_episodes}</li>
        <li><span
            class="text-secondary">First Air Date:</span>
          ${data.first_air_date}</li>
        <li><span
            class="text-secondary">Last Episode To Air:</span>
          ${data.last_episode_to_air.air_date} ${
        data.last_episode_to_air.name
      }</li>
        <li><span
            class="text-secondary">Episode Runtime:</span>
          ${data.episode_run_time} minutes</li>
        <li><span
            class="text-secondary">Original Language:</span>
          ${data.original_language}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${prodCompanyArr}</div>
    </div>`;
      tvDetails.appendChild(DetailsDiv);
    })
    .catch((err) => console.error(err));
}

function displayBackdrop(backdropPath) {
  const backdrop = document.querySelector(".backdrop");
  backdrop.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${backdropPath}")`;
}

function formatMoney(number) {
  return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function showSpinner() {
  spinner.classList.add("show");
  console.log("loading");
}

function hideSpinner() {
  // spinner.className = "spinner";
  if (document.readyState == "complete") {
    spinner.classList.remove("show");
    console.log("content loaded");
  }
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      console.log("home");
      displayPopularMovies();
      break;
    case "/shows.html":
      console.log("shows");
      displayPopularTVShows();
      break;
    case "/movie-details.html":
      console.log("movie details");
      displayMovieDetails();
    case "/tv-details.html":
      console.log("tv details");
      displayTVDetails();
    case "/search.html":
      console.log("search");
  }
  highlightActive();
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", showSpinner);
document.addEventListener("readystatechange", hideSpinner);
