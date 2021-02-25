
let canvas = document.getElementById("canvas-z");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;
let drawBorder = function () {
	ctx.fillStyle = "Gray";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};


let drawScore = function () {
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, blockSize, blockSize);

}

let gameOver = function () {
	clearInterval(intervalId);
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game over.", width / 2, height / 2);
};

let circle = function (x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);

	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}

}
let Block = function (col, row) {
	this.col = col;
	this.row = row;

};


Block.prototype.drawSquare = function (color) {
	let x = this.col * blockSize;
	let y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);

};

Block.prototype.drawCircle = function (color) {
	let centerX = this.col * blockSize + blockSize / 2;
	let centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};


let Snake = function () {
	this.segments = [
		new Block(7, 5),
		new Block(6, 5),
		new Block(5, 5)
	];
	this.direction = "ArrowRight";
	this.nextDirection = "ArrowRight";
}

Snake.prototype.draw = function () {
	for (let i = 0; i < this.segments.length; i++) {
		this.segments[i].drawSquare("Blue");
	}
};


Snake.prototype.checkCollision = function (head)  {

	let topCollision = (head.row === 0);

	let leftCollision = (head.col === 0);

	let rightCollision = (head.col === widthInBlocks - 1);
	let bottomCollision = (head.row === heightInBlocks - 1);

	let wallCollision = leftCollision || topCollision ||
		rightCollision || bottomCollision;
	let selfCollision = false;

	for (let i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}
	return wallCollision || selfCollision;
};

Snake.prototype.move = function () {
	let head = this.segments[0];
	let newHead;
	this.direction = this.nextDirection;

	if (this.direction === "ArrowRight") {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === "ArrowDown") {
		newHead = new Block(head.col, head.row + 1);
	} else if (this.direction === "ArrowLeft") {
		newHead = new Block(head.col - 1, head.row);
	} else if (this.direction === "ArrowUp") {
		newHead = new Block(head.col, head.row - 1);
	}

	if (this.checkCollision(newHead)) {
		gameOver();
		return;
	}
	this.segments.unshift(newHead);
	if (newHead.equal(apple.position)) {
		score++;
		apple.move();
	} else {
		this.segments.pop();
	}
};


Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};


Snake.prototype.setDirection = function (newDirection) {
	if (this.direction === "ArrowUp" && newDirection === "down") {
		return;
	} else if (this.direction === "ArrowRight" && newDirection === "ArrowLeft") {
		return;
	} else if (this.direction === "ArrowLeft" && newDirection === "ArrowRight") {
		return;
	}
	this.nextDirection = newDirection;
};

let Apple = function () {
	this.position = new Block(10, 10);
}


Apple.prototype.draw = function () {
	this.position.drawCircle("limeGreen");

}


Apple.prototype.move = function () {
	let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	this.position = new Block(randomCol, randomRow);
}


let snake = new Snake();
let apple = new Apple();

let intervalId = setInterval(function () {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.draw();
	apple.draw();
	drawBorder();
	snake.move();


}, 100);

addEventListener("keydown", function (e) {
	let newDirection = e.key;

	if (newDirection !== undefined) {
		snake.setDirection(newDirection);
	}
})



