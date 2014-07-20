
function $(val){
  return document.querySelector(val);
}

window.addEventListener("scroll", function() {
	if (window.pageYOffset > 0 && window.pageYOffset <= 400){
		$(".overlay").style.opacity = (window.pageYOffset / 400);
	}
}, false);