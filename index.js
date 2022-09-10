
/* 
	Copyright znci (2022)
		[znci.dev]
		<hello@znci.dev>
		LICENSE.md
*/

var __main__ = {};

__main__.version = 1

const express = require("express"),
	  http = require("http"),
	  path = require("path"),
	  bodyParser = require('body-parser'),
	  app = express(),
	  server = http.createServer(app),
	  sqlite3 = require('sqlite3'),
	  db = new sqlite3.Database('main.sqlite3'),
	  shortid = require('shortid'),
	  chalk = require("chalk")

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS shortUrls (shortId TEXT, redirectUrl TEXT)")
	console.log('a')
}); 

function insert(shortID, redirectUrl) {
	db.run(`INSERT INTO shortUrls (shortId, redirectUrl) VALUES ("${shortID}", "${redirectUrl}")`, (err) => {
		if(err) return console.log("Error occured whilst inserting values " + shortID + " and " + redirectUrl);
		console.log("Created ShortURL of code " + shortID + " redirecting to " + redirectUrl);
	})
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));

app.get("/:id?", (req, res) => {
	const { id } = req.params;
	if(id) {
		db.get(`SELECT * FROM shortUrls WHERE shortId = "${id}"`, function (err,val) {
			if(val) res.redirect(val.redirectUrl)
		})
	}
});
	
app.post("/api/:request", (req, res) => {
	const r = req.params;
})
app.post("/api/create", (req, res) => {
	const redirectURL = req.body.redirectURL
	const randomId = shortid.generate() 
	if (redirectURL.toString().startsWith("http")) {
		res.status(201)
	} else {
		res.status(400).send(`Please make sure your links start with <code>http://</code>. You gave us: <code>${redirectURL}</code>`)
	}
	db.run(`SELECT shortId FROM shortUrls WHERE shortId = ${randomId}`, (err) => {
		if(err) {
			res.send(`Created link (${randomId}) that redirects to "${redirectURL}"`)
			insert(randomId, redirectURL)
			return
		}
	})
})
app.post("/api/tryAdmin", (req, res) => {
	const {username,password} = req.body
	if(username === "AAAAAAAAAADMINNNNN" && password === "porgammering") {
		res.status(200).send("yous di it!"); console.log("yees");
	}
}) 
app.get("*", (req, res) => { 
	console.log("insert 404 page");
})
server.listen(() => {
	console.log(`——————————znci—————————`);
	console.log(chalk.cyanBright(`Server Opened`));
	console.log(chalk.cyanBright(`API Listening`));
	console.log(`———————————go——————————`);
})