const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// DB setup
mongoose.connect(
	process.env.MONGO_URI,
	{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: false },
	function(err, db) {
		if (err) {
			console.log("Unable to connect to the mongoDB server. Error:", err);
		} else {
			console.log(`Connection established to the "${db.name}" mongoDB.`);
		}
	}
);

mongoose.connection
	.once("open", () => console.log("DB, good to go!"))
	.on("error", error => {
		console.warn("Warning", error);
	});

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
require("./routes/accountRoutes")(app);
require("./routes/checkRoutes")(app);
require("./routes/logRoutes")(app);
require("./routes/eventRoutes")(app);

app.get("*", function(req, res) {
	res.status(404).send("");
});

app.listen(port, () =>
	console.log(`Uptimedown API listening on port ${port}!`)
);
