
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
<<<<<<< HEAD
	  shortid = require('shortid'),

	  SERVERPORT = 25565;
=======
	  shortid = require('shortid')
>>>>>>> 3bc130a6772a9e78cf1585fdd31a21b7f975f02b

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS shortUrls (shortId TEXT, redirectUrl TEXT, time INT, ip TEXT)")
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
	console.log(req.connection.remoteAddress);
	if(id) {
		db.get(`SELECT * FROM shortUrls WHERE shortId = "${id}"`, function (err,val) {
			if(val) res.redirect(val.redirectUrl)
		})
	}
});
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
});
<<<<<<< HEAD
server.listen(SERVERPORT, () => {
    console.log('a')
=======
server.listen(() => {
	console.log(`a`)
>>>>>>> 3bc130a6772a9e78cf1585fdd31a21b7f975f02b
	console.log(`——————————znci—————————`);
	console.log(`Server Opened`);
	console.log(`API Listening`);
	console.log(`———————————go——————————`);
})
