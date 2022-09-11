
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
	  CryptoJS = require("crypto-js"),
	  cookieParser = require('cookie-parser'),
	  fs = require("fs"),

	  SERVERPORT = 25565; // Change to whatever


db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS shortUrls (shortId TEXT, redirectUrl TEXT, time INT)")
}); 
function insert(shortID, redirectUrl) {
	db.run(`INSERT INTO shortUrls (shortId, redirectUrl, time) VALUES ("${shortID}", "${redirectUrl}", "${Date.now()}")`, (err) => {
		if(err) return console.log("Error occured whilst inserting values " + shortID + " and " + redirectUrl);
		console.log("Created ShortURL of code " + shortID + " redirecting to " + redirectUrl);
	})
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.use(cookieParser());

function getCookieVal(query, str) {
	let r = "";
	const split = str.toString().replace(" ", "").split(",")
	split.forEach(v => {
		const data = v.split(":");
		if(data[0] === query) {
			r = data[1]
		}
	});
	return r
}

app.get("/:id?", (req, res) => {
	const { id } = req.params;
	if(id) {
		db.get(`SELECT * FROM shortUrls WHERE shortId = "${id}"`, function (err,val) {
			if(val) return res.redirect(val.redirectUrl)
			switch(id) {
				case "admin":
					if(req.cookies["login-token"]) {
						console.log(CryptoJS.AES.decrypt(req.cookies["login-token"], "Lorem Ipsum Dolor Sit Amet").toString(CryptoJS.enc.Utf8).replace(" ", ""));
						if(CryptoJS.AES.decrypt(req.cookies["login-token"], "Lorem Ipsum Dolor Sit Amet").toString(CryptoJS.enc.Utf8)) {
							res.sendFile(__dirname + "/admin/authenticated.html")
						}
				 	} else {
						res.sendFile(__dirname + "/admin/index.html")
					}
					break
			}
		})
	}
});
app.post("/api/create", (req, res) => {
	const redirectURL = req.body.redirectURL;
	const randomId = shortid.generate() ;
	if (redirectURL.toString().startsWith("http")) {
		res.status(201);
	} else {
		res.status(400).send(`
			Please make sure your links start with <code>http://</code>. You gave us: <code>${redirectURL}</code>
		`);
	}
	db.run(`SELECT shortId FROM shortUrls WHERE shortId = ${randomId}`, (err) => {
		if(err) {
			res.send(`Created link (${randomId}) that redirects to "${redirectURL}"`)
			insert(randomId, redirectURL) // inserts into the db (took me like 30 seconds to realise my own code)
			return
		}
	})
})
app.post("/api/tryAdmin", (req, res) => {
	const {username,password} = req.body
	if(username === "root" && password === "rootrootroot") {
		res.cookie("login-token", CryptoJS.AES.encrypt(`username:${username},password:${CryptoJS.SHA512(password)},logintime:${Date.now()}`, "Lorem Ipsum Dolor Sit Amet").toString())
		res.status(200).send("200")
	} else {
		res.status(400).send("400")
	}
});
app.get("/api/getAllLinks", (req, res) => {
	db.each(`SELECT * FROM shortUrls`, (err, val) => {
		if(!err) {
			console.log(val);
		}
	})
})
server.listen(SERVERPORT, () => {
    console.log('a')
	console.log(`——————————znci—————————`);
	console.log(`Server Opened`);
	console.log(`API Listening`);
	console.log(`———————————go——————————`);
})
 