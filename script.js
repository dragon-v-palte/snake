let score = document.getElementsByClassName("score")[0];
let best = document.getElementsByClassName("best")[0];
let start = document.getElementsByClassName("control__start")[0];
let stop = document.getElementsByClassName("control__stop")[0];
let level = document.getElementsByClassName("level__text")[0];
let levelInput = document.getElementsByClassName("level__input")[0];

let bestValue = 0;
let process = false;
let width;
let height;
let length;
let startLength;
let current;
let dx;
let dy;
let x;
let y;
let hasFood;
let newEl;
let change;
let levelValue;

var timer;

//расчет координаты для еды
var newFood = function() {
	for (let fX, fY; !hasFood; fX = Math.floor(Math.random() * 10 % width), fY = Math.floor(Math.random() * 10 % height)) {
		if (!!(fX + 1) && !!(fY + 1) && document.getElementsByClassName(fY + "_" + fX)[0].className.indexOf("s") < 0) {
			hasFood = true;
			document.getElementsByClassName(fY + "_" + fX)[0].className += " f";
		}
	}
}

var reset = function() {
	width = 10;
	height = 10;
	length = startLength = 3;
	current = 3;
	dx = 1;
	dy = 0;
	x = 2;
	y = 0;
	hasFood = false;
	newEl = null;
	process = false;
	change = true;
	levelInput.disabled = false;
	levelValue = levelInput.value;
	start.innerHTML = "Start";
	score.innerHTML = "Score: <br/> 0";
	for (let i = 0, items = document.getElementsByClassName("line"), len = items.length; i < len; i++) {
		for(let node of items[i].getElementsByTagName("div")) {		
			node.className = node.className.replace(" s", "");
			node.className = node.className.replace(" h", "");
			node.className = node.className.replace(" f", "");
			node.style.backgroundColor = "";
		}
	}
	document.getElementsByClassName("0_0")[0].className += " s";
	document.getElementsByClassName("0_1")[0].className += " s";
	document.getElementsByClassName("0_2")[0].className += " s h";
	document.getElementsByClassName("0_0")[0].setAttribute("data-n", 1);
	document.getElementsByClassName("0_1")[0].setAttribute("data-n", 2);
	document.getElementsByClassName("0_2")[0].setAttribute("data-n", 3);
	document.getElementsByClassName("0_0")[0].style.backgroundColor = `rgb(4, 104, 4)`;
	document.getElementsByClassName("0_1")[0].style.backgroundColor = `rgb(2, 102, 2)`;
	newFood();
}
reset();


document.body.onkeydown = function(e){
	if (change)
		switch (e.keyCode) {
			case 37:
				dx = dx != 1 ? -1 : dx;
				dy = 0;
				change = false;
				break;
			case 38:
				dx = 0;
				dy = dy != 1 ? -1 : dy;
				change = false;
				break;
			case 39:
				dx = dx != -1 ? 1 : dx;
				dy = 0;
				change = false;
				break;
			case 40:
				dx = 0;
				dy = dy != -1 ? 1 : dy;
				change = false;
				break;
			case 32:
				work();
				break;
		}
}

var work = function() {
	levelInput.disabled = true;
	if (!process) {
		timer = setInterval(snake, 1000 / levelValue);		
		start.innerHTML = "Pause";
		process = true;
		for (let i = 0, items = document.getElementsByClassName("line"), len = items.length; i < len; i++) {
			for(let node of items[i].getElementsByTagName("div")) {		
				if (node.className.indexOf("s") < 0 && node.className.indexOf("h") < 0 && node.className.indexOf("f") < 0)
					node.style.backgroundColor = "";
			}
		}
		document.body.style.backgroundColor = "";
	} else {
		clearInterval(timer);
		start.innerHTML = "Start";		
		process = false;
		for (let i = 0, items = document.getElementsByClassName("line"), len = items.length; i < len; i++) {
			for(let node of items[i].getElementsByTagName("div")) {		
				if (node.className.indexOf("s") < 0 && node.className.indexOf("h") < 0 && node.className.indexOf("f") < 0)
					node.style.backgroundColor = "lightgray";
			}
		}
		document.body.style.backgroundColor = "#eee";
	}
}

var snake = function() {	
	newEl = null;
	hasFood = false;
	
	//координаты следующей точки
	x = (x + dx) < 0 ? width - 1 : (x + dx) % width;
	y = (y + dy) < 0 ? height - 1 : (y + dy) % height;
	newEl = document.getElementsByClassName(y + "_" + x)[0];	

		
	//если врезался в самого себя
	if (newEl.className.indexOf("s") > 0) {		
		if ((length - startLength) * levelValue > bestValue) {
			bestValue = (length - startLength) * levelValue;
			best.innerHTML = "Best: <br/>" + bestValue;
		}
			
		clearInterval(timer);
		alert("Game Over! Score: " + (length - startLength) * levelValue);
		reset();
		return;
	}
	
	//если дошел до еды
	if (newEl.className.indexOf("f") > 0) {
		for (let i = 0, items = document.getElementsByClassName("s"); i < items.length; i++) {
			items[i].className = items[i].className.replace(" h", "");
		}
		newEl.className = newEl.className.replace(" f", " s h");
		length++;
		score.innerHTML = "Score: <br/>" + (length - startLength) * levelValue;
		hasFood = false;		
		newFood();
	}
	else
	{
		//поиск координат змейки
		let item;
		for (let i = 0, min = Infinity, items = document.getElementsByClassName("s"); i < items.length; i++) {
			let num = +items[i].getAttribute("data-n");
			if(num < min)
				min = +items[i].getAttribute("data-n"), item = items[i];
			items[i].className = items[i].className.replace(" h", "");
			let backColor = (current - num) * 2;
			items[i].style.backgroundColor = `rgb(${backColor}, ${100 + backColor}, ${backColor})`;
		}
		if (!!item) 
		{
			item.className = item.className.replace(" s", "");
			item.style.backgroundColor = "";
		}
		newEl.className += " s h";
	}
	newEl.setAttribute("data-n", current++);
	change = true;
}

start.addEventListener("click", work);

stop.onclick = function() {
	clearInterval(timer);
	reset();
}

levelInput.onchange = function() {
	level.innerHTML = "Level: <br/>" + levelInput.value;
	levelValue = levelInput.value;
}