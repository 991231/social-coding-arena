import axios from "axios";

// submit code and run test
export const submitCode = (codeInfo, cb, errcb) => {
  axios
    .post("/api/code-submission/create-submission", codeInfo)
    .then((res) => {
      if (cb != null) {
        cb(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
      // catch error
      if (errcb != null) {
        errcb(err);
      }
    });
};

// delay function
function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

// get submission results
export const getSubmissionResults = (submission_token, cb, errcb) => {
  axios
    .post("/api/code-submission/get-submission", submission_token)
    .then(sleeper(3000)) // TODO: HARDCODE delay, need to be responsive
    .then((res) => {
      if (cb != null) {
        cb(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
      if (errcb != null) {
        errcb(err);
      }
    });
};
