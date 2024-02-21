const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  apiURL: "https://api.themoviedb.org/3/",
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
        div.innerHTML = `<a href="/public/movie-details.html?id=${movie.id}">

        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
            : `<img src="images/no-image.jpg" alt="${movie.title}" />`
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
            : `<img src="images/no-image.jpg" alt="${show.name}" />`
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
        alt="${data.name}" />`
          : `<img src="images/no-image.jpg"
        class="card-img-top"
        alt="${data.name}" />`
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
            ${
              data.last_episode_to_air === null
                ? `null`
                : data.last_episode_to_air.air_date +
                  " " +
                  data.last_episode_to_air.name
            }
         </li>
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

function displayNowplaying() {
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
      data.results.forEach((movie) => {
        // console.log(movie);
        const div = document.createElement("div");
        div.className = "swiper-slide";
        div.innerHTML = `
        <a href="/public/movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
            : `<img src="/images/no-image.jpg" alt="${movie.title}" />`
        }
          
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
            2
          )} / 10
        </h4>`;
        document.querySelector(".swiper-wrapper").appendChild(div);

        initSwiper();
      });
    })
    .catch((err) => console.error(err));
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    speed: 400,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// search movies/show
// function search() {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);

//   global.search.type = urlParams.get("type");
//   global.search.term = urlParams.get("search-term");

//   if (global.search.term !== "" && global.search.term !== null) {
//     const results = searchAPIData();
//     // showAlert(
//     //   `There are ${results.total_results} search results of ${global.search.term}`,
//     //   "alert-success"
//     // );
//     console.log(results);
//     // console.log(results.total_results);
//   } else {
//     showAlert("Please enter a search term", "alert-error");
//   }
// }

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  urlParams.set("page", global.search.page);
  console.log(urlParams.toString());

  if (global.search.term !== "" && global.search.term !== null) {
    const data = await searchAPIData();
    console.log(data);
    console.log(data.results);

    showAlert(
      `There are ${data.total_results} search results of ${global.search.term} in ${global.search.type}`,
      "alert-success"
    );

    global.search.page = data.page;
    global.search.totalPages = data.total_pages;
    global.search.totalResults = data.total_results;

    const searchResults = data.results;

    if (searchResults === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(searchResults);
    document.querySelector("#search-term").value = global.search.term;

    const searchRadio = document.querySelector(".search-radio");
    if (global.search.type === "movie") {
      searchRadio.querySelector("input#movie").checked = true;
    } else if (global.search.type === "tv") {
      searchRadio.querySelector("input#tv").checked = true;
    }
  } else {
    showAlert("Please enter a search term", "alert-error");
  }
}

function displaySearchResults(results) {
  // clear prev page results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="${global.search.type}-details.html?id=${
      result.id
    }">
          ${
            result.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
            class="card-img-top"
            alt="${
              global.search.type === "movie" ? result.title : result.name
            }" />`
              : `<img src="images/no-image.jpg"
            class="card-img-top"
            alt="${
              global.search.type === "movie" ? result.title : result.name
            }" />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${
            global.search.type === "movie" ? result.title : result.name
          }</h5>
          <p class="card-text">
            <small class="text-muted">Release:
            ${
              global.search.type === "movie"
                ? result.release_date
                : result.first_air_date
            }</small>
          </p>
        </div>`;
    document.getElementById("search-results").appendChild(div);
    document.querySelector(
      "#search-results-heading"
    ).innerHTML = `<h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>`;
  });

  displayPagination();
}

// create & display pagination for search
function displayPagination() {
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = `      <div class="pagination">
        <button class="btn btn-primary"
          id="prev">Prev</button>
        <button class="btn btn-primary"
          id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}
        </div>
      </div>`;
  document.getElementById("pagination").appendChild(paginationDiv);

  // disable next button if on last page, disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector(".pagination button#prev").disabled = true;
  } else if (global.search.page === global.search.totalPages) {
    document.querySelector(".pagination button#next").disabled = true;
  }

  // next page
  document
    .querySelector(".pagination button#next")
    .addEventListener("click", async () => {
      global.search.page++;
      const data = await searchAPIData();
      displaySearchResults(data.results);
    });

  // pre page
  document
    .querySelector(".pagination button#prev")
    .addEventListener("click", async () => {
      global.search.page--;
      const data = await searchAPIData();
      displaySearchResults(data.results);
    });
}

async function searchAPIData() {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/${global.search.type}?query=${global.search.term}&language=en-US&page=${global.search.page}`,
    options
  );

  const data = await response.json();

  return data;
}

// Custom show alert
function showAlert(message, className = "alert alert-error") {
  alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.getElementById("alert").appendChild(alertEl);

  setTimeout(() => {
    // alertEl.style.display = "none";
    // document.getElementById("alert").removeChild(alertEl);
    alertEl.remove();
  }, 3000);
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
    case "/MovieDB/":
      console.log("home");
      displayPopularMovies();
      displayNowplaying();
      break;
    // case "/shows.html":
    // case "/shows":
    case "/public/shows.html":
    case "/public/shows":
      console.log("shows");
      displayPopularTVShows();
      break;
    case "/public/movie-details.html":
      console.log("movie details");
      displayMovieDetails();
    case "/public/tv-details.html":
      console.log("tv details");
      displayTVDetails();
    case "/public/search.html":
      console.log("search");
      search();
  }
  highlightActive();
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", showSpinner);
document.addEventListener("readystatechange", hideSpinner);
