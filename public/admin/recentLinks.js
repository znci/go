async function getAllLinks() {
	document.querySelector(".recent-links-container").innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
	setTimeout(() => {
		fetch("/api/getAllLinks").then((res) => res.json()).then(json => {
			document.querySelector(".recent-links-container").innerHTML = ``
			json.forEach(v => {
				document.querySelector(".recent-links-container").innerHTML += `
					<div class="container">
						<div class="action">Created link</div>
						<div class="info">${v.shortId} &bull; ${v.redirectUrl}</div>
						<p class="time">${$.timeago(v.time)}</p>
					</div>
				`
			});
		})
	}, 1000);
}
getAllLinks()