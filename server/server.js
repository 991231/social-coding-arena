// express
const app = require("express")();

const codeSubmission = require("./routes/api/codeSubmission");

// bodyparser middleware
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// API Routes
app.use("/api/code-submission", codeSubmission);

// run server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
