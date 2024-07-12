import express from "express";
import url, { URLSearchParams } from "node:url";
import needle from "needle";
import apicache from "apicache";

export const router = express.Router();

// ENV vars
const API_BASE_URL = process.env.API_BASE_URL;

// Initialise cache
let cache = apicache.middleware;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.API_TOKEN,
  },
};

// popular movie route
router.get("/popular-movies", cache("5 minutes"), async (req, res) => {
  try {
    // console.log(url.parse(req.url, true).query);
    const params = new URLSearchParams({
      language: "en-US",
      page: 1,
      // ...url.parse(req.url, true).query,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}movie/popular?${params}`,
      API_OPTIONS
    );

    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}movie/popular?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// popular shows route
router.get("/popular-shows", cache("5 minutes"), async (req, res) => {
  try {
    // console.log(url.parse(req.url, true).query);
    const params = new URLSearchParams({
      language: "en-US",
      page: 1,
      // ...url.parse(req.url, true).query,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}tv/popular?${params}`,
      API_OPTIONS
    );

    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}tv/popular?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tv show details
router.get("/tv-details/:series_id", cache("5 minutes"), async (req, res) => {
  const series_id = req.params.series_id;
  try {
    // console.log(url.parse(req.url, true).query);
    const params = new URLSearchParams({
      // ...url.parse(req.url, true).query,
      language: "en-US",
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}tv/${series_id}?${params}`,
      API_OPTIONS
    );

    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}tv/${series_id}?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// movie details
router.get("/movie-details/:movie_id", cache("5 minutes"), async (req, res) => {
  const movie_id = req.params.movie_id;
  try {
    // console.log(url.parse(req.url, true).query);
    const params = new URLSearchParams({
      // ...url.parse(req.url, true).query,
      language: "en-US",
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}movie/${movie_id}?${params}`,
      API_OPTIONS
    );

    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `REQUEST: ${API_BASE_URL}movie-details/${movie_id}?${params}`
      );
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// search
router.get("/search/:searchType", cache("5 minutes"), async (req, res) => {
  const type = req.params.searchType;
  const page = req.query.page || 1;
  const query = req.query.query;
  const include_adult = req.query.include_adult || false;
  const language = req.query.language || "en-US";

  try {
    // console.log(url.parse(req.url, true).query);
    const params = new URLSearchParams({
      // ...url.parse(req.url, true).query,
      query: query,
      include_adult: include_adult,
      language: language,
      page: page,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}search/${type}?${params.toString()}`,
      API_OPTIONS
    );

    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}search/${type}?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// displayNow
// search
router.get("/nowplaying", cache("5 minutes"), async (req, res) => {
  try {
    // console.log(url.parse(req.url, true).query);
    const params = new URLSearchParams({
      language: "en-US",
      page: 1,
    });
    const apiRes = await needle(
      "get",
      `${API_BASE_URL}movie/now_playing?${params}`,
      API_OPTIONS
    );

    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}movie/now_playing?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});
