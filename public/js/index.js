const ctx = document.querySelector(".ctx-menu");
const ctxHeight = $(ctx).height();
async function ctxHeightScroll() { // I FINALLY FIGURED OUT WHAT ASYNC DOES (YOOOOOOOO)
	
	const ctx = document.querySelector(".ctx-menu");
	$(ctx).height(ctxHeight)
}

document.querySelector("html").addEventListener("contextmenu", (event) => {
	event.preventDefault();
	const { clientX: mouseX, clientY: mouseY } = event;

	ctx.style.top = `${mouseY}px`;
	ctx.style.left = `${mouseX}px`;
	ctx.classList.add(`visible`);
	ctxHeightScroll()
	document.querySelector("html").addEventListener("click", (e) => {
		if(e.target.offsetParent != ctx) {
			$(ctx).height(0)
		}
	})
})