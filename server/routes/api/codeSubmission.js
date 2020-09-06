const express = require("express");
const router = express.Router();
const axios = require("axios");
const judge0Config = require("../../config/judge0Config");
const LANGUAGES = judge0Config.LANGUAGES;
const JUDGE0APIKEY = judge0Config.JUDGE0APIKEY;
const testCases = require("../../utils/codeSubmission/testCase");

// @route POST api/code-submission/create-submission
router.post("/create-submission", (req, res) => {
  const language = req.body.language;
  let source_code = req.body.source_code;

  // add test case string at the end of source_code
  source_code = testCases.addTestCases(source_code);
  console.log(source_code);

  // HARDCODE the language id for now (Python 3.8 only)
  const language_id = 71; // 71

  const config = {
    method: "POST",
    url: "https://judge0.p.rapidapi.com/submissions",
    headers: {
      "content-type": "application/json",
      "x-rapidapi-host": "judge0.p.rapidapi.com",
      "x-rapidapi-key": JUDGE0APIKEY,
      accept: "application/json",
      useQueryString: true,
    },
    data: {
      language_id: language_id,
      source_code: source_code,
      // stdin: "",
    },
  };

  // post a code submission to Judge0 API
  axios(config)
    .then((response) => {
      console.log(response.data);
      res.json(response.data); // should return a submission token
    })
    .catch((error) => {
      console.log(error);
      res.json({ error: error });
    });
});

// @route GET api/code-submission/get-submission
router.post("/get-submission", (req, res) => {
  const submission_token = req.body.submission_token;

  const config = {
    method: "GET",
    url:
      "https://judge0.p.rapidapi.com/submissions/" +
      submission_token.toString(),
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "judge0.p.rapidapi.com",
      "x-rapidapi-key": JUDGE0APIKEY,
      useQueryString: true,
    },
    timeout: 1000 * 5, // Wait for 5 seconds
  };

  // get code submission results
  axios(config)
    .then((response) => {
      // should return results from code submission
      console.log(response.data);
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.json({ error: error });
    });
});

// @route GET api/code-submission/get-judge0-languages
//
router.get("/get-judge0-languages", (req, res) => {
  axios({
    method: "GET",
    url: "https://judge0.p.rapidapi.com/languages",
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "judge0.p.rapidapi.com",
      "x-rapidapi-key": JUDGE0APIKEY,
      useQueryString: true,
    },
  })
    .then((response) => {
      // should return a list of dict, containing language ids and names
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.json({ error: error });
    });
});

module.exports = router;
