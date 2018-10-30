var cvpHandlers = {
	canvasClickHandler: null,
	videoTimeUpdateHandler: null,
	videoSeekedHandler: null,
	videoCanPlayHandler: null,
	windowResizeHandler: null
};

var CanvasVideoPlayer = function(options) {
	var i;

	this.options = {
		framesPerSecond: 25,
		hideVideo: true,
		autoplay: false,
		audio: false,
		timelineSelector: false,
		resetOnLastFrame: true,
		loop: false,
		isAndroidTeacherVideo:false,
	};

	for (i in options) {
		this.options[i] = options[i];
	}

	// this.video = document.querySelector(this.options.videoSelector);
	// this.canvas = document.querySelector(this.options.canvasSelector);
	this.video = this.options.videoSelector;
	this.canvas = this.options.canvasSelector;
	this.timeline = document.querySelector(this.options.timelineSelector);
	this.timelinePassed = document.querySelector(this.options.timelineSelector + '> div');

	if (!this.options.videoSelector || !this.video) {
		console.error('No "videoSelector" property, or the element is not found');
		return;
	}

	if (!this.options.canvasSelector || !this.canvas) {
		console.error('No "canvasSelector" property, or the element is not found');
		return;
	}

	if (this.options.timelineSelector && !this.timeline) {
		console.error('Element for the "timelineSelector" selector not found');
		return;
	}

	if (this.options.timelineSelector && !this.timelinePassed) {
		console.error('Element for the "timelinePassed" not found');
		return;
	}

	if (this.options.audio) {
		if (typeof(this.options.audio) === 'string'){
			// Use audio selector from options if specified
			this.audio = document.querySelectorAll(this.options.audio)[0];

			if (!this.audio) {
				console.error('Element for the "audio" not found');
				return;
			}
		} else {
			// Creates audio element which uses same video sources
			this.audio = document.createElement('audio');
			this.audio.innerHTML = this.video.innerHTML;
			this.video.parentNode.insertBefore(this.audio, this.video);
			this.audio.load();
		}

		var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
		if (iOS) {
			// Autoplay doesn't work with audio on iOS
			// User have to manually start the audio
			this.options.autoplay = false;
		}
	}

	// Canvas context
	this.ctx = this.canvas.getContext('2d');

	this.playing = false;

	this.resizeTimeoutReference = false;
	this.RESIZE_TIMEOUT = 1000;

	this.init();
	this.bind();
};

CanvasVideoPlayer.prototype.init = function() {
	this.video.load();

	this.setCanvasSize();

	if (this.options.hideVideo) {
		this.video.style.display = 'none';
	}
};

// Used most of the jQuery code for the .offset() method
CanvasVideoPlayer.prototype.getOffset = function(elem) {
	var docElem, rect, doc;

	if (!elem) {
		return;
	}

	rect = elem.getBoundingClientRect();

	// Make sure element is not hidden (display: none) or disconnected
	if (rect.width || rect.height || elem.getClientRects().length) {
		doc = elem.ownerDocument;
		docElem = doc.documentElement;

		return {
			top: rect.top + window.pageYOffset - docElem.clientTop,
			left: rect.left + window.pageXOffset - docElem.clientLeft
		};
	}
};

CanvasVideoPlayer.prototype.jumpTo = function(percentage) {
	this.video.currentTime = this.video.duration * percentage;

	if (this.options.audio) {
		this.audio.currentTime = this.audio.duration * percentage;
	}
};

CanvasVideoPlayer.prototype.bind = function() {
	var self = this;

	// Playes or pauses video on canvas click
	// this.canvas.addEventListener('click', cvpHandlers.canvasClickHandler = function() {
	// 	self.playPause();
	// });

	// On every time update draws frame
	this.video.addEventListener('seeked', cvpHandlers.videoSeekedHandler = function() {
		self.drawFrame();
	});

	// Draws first frame
	this.video.addEventListener('canplay', cvpHandlers.videoCanPlayHandler = function() {
		self.drawFrame();
	});


	if(this.options.isAndroidTeacherVideo){
		this.video.addEventListener('timeupdate', cvpHandlers.videoTimeUpdateHandler = function() {
			console.log('android teacher video currentTime:',self.video.currentTime);
			// self.drawFrame();
		});
	}

	// To be sure 'canplay' event that isn't already fired
	if (this.video.readyState >= 2) {
		self.drawFrame();
	}

	if (self.options.autoplay) {
	  self.play();
	}

	// Click on the video seek video
	if (self.options.timelineSelector) {
		this.timeline.addEventListener('click', function(e) {
			var offset = e.clientX - self.getOffset(self.canvas).left;
			var percentage = offset / self.timeline.offsetWidth;
			self.jumpTo(percentage);
		});
	}

	// Cache canvas size on resize (doing it only once in a second)
	window.addEventListener('resize', cvpHandlers.windowResizeHandler = function() {
		clearTimeout(self.resizeTimeoutReference);

		self.resizeTimeoutReference = setTimeout(function() {
			self.setCanvasSize();
			self.drawFrame();
		}, self.RESIZE_TIMEOUT);
	});

	
	
	
	
	
	this.unbind = function() {
		// this.canvas.removeEventListener('click', cvpHandlers.canvasClickHandler);
		this.video.removeEventListener('seeked', cvpHandlers.videoSeekedHandler);
		this.video.removeEventListener('canplay', cvpHandlers.videoCanPlayHandler);
		this.video.removeEventListener('timeupdate', cvpHandlers.videoTimeUpdateHandler);

		window.removeEventListener('resize', cvpHandlers.windowResizeHandler);

		if (this.options.audio) {
			this.audio.remove();
		}
	};
};

CanvasVideoPlayer.prototype.updateTimeline = function() {
	var percentage = (this.video.currentTime * 100 / this.video.duration).toFixed(2);
	this.timelinePassed.style.width = percentage + '%';
};

CanvasVideoPlayer.prototype.setCanvasSize = function() {
	let clientWidth = document.documentElement.clientWidth;
	let clientHeight =  document.documentElement.clientHeight;
	this.width = clientWidth > clientHeight ? clientWidth : clientHeight;
	this.height = clientWidth < clientHeight ? clientWidth : clientHeight;
	if($(this.canvas).hasClass('teacher-canvas')){
		let teachVideoWidth = this.height*1280/720;
		let teachVideoHeight = this.height;
		if(teachVideoWidth > this.width){
			teachVideoHeight = this.width*720/1280;
			this.canvas.parentNode.style.bottom = Math.floor((this.height - teachVideoHeight)/2)+'px';
		}

		let styleHeight = teachVideoHeight *0.8;
		if(styleHeight>480)styleHeight = 480;
		this.canvas.style.height = styleHeight +'px';
		this.canvas.style.width = styleHeight * 0.8 +'px';
		this.height = 480;
		this.width = 384;
	}else {


		let videoFullScreenWidth = this.height*1280/720;
		if(videoFullScreenWidth > this.width){
			this.height = this.width*720/1280;

		}else {
			this.width = videoFullScreenWidth;
		}
		this.canvas.style.height = this.height +'px';
		this.canvas.style.width = this.width +'px';
		this.height = 720;
		this.width = 1280;
	}
	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);

};

CanvasVideoPlayer.prototype.play = function() {
	this.lastTime = Date.now();
	this.playing = true;
	this.loop();

	if (this.options.audio) {//ios不播放video
		// Resync audio and video
		this.audio.currentTime = this.video.currentTime;
		this.audio.play();
		$(this.video).trigger('playing');
	}else { //android播放video
		this.video.play();
		// if(this.video.currentTime ===0){
		// 	this.video.currentTime = 0.01;
		// }
	}
};

CanvasVideoPlayer.prototype.pause = function() {
	this.playing = false;

	if (this.options.audio) {
		this.audio.pause();
		$(this.video).trigger('pause');
		
	}else {
		this.video.pause();
	}
};

CanvasVideoPlayer.prototype.playPause = function() {
	if (this.playing) {
		this.pause();
	}
	else {
		this.play();
	}
};

CanvasVideoPlayer.prototype.loop = function() {
	var self = this;

	var time = Date.now();
	var elapsed = (time - this.lastTime) / 1000;

	// Render
	if(this.options.audio && elapsed >= (1 / this.options.framesPerSecond)) {
		this.video.currentTime = this.video.currentTime + elapsed;
		this.lastTime = time;
		// Resync audio and video if they drift more than 300ms apart
		if(this.audio && Math.abs(this.audio.currentTime - this.video.currentTime) > 0.3){
			this.audio.currentTime = this.video.currentTime;
		}
	}

	// If we are at the end of the video stop
	if (this.video.ended || (this.video.currentTime > 0 && this.video.currentTime >= this.video.duration)) {
		this.playing = false;
		this.options.videoEndedCallback();
		if (this.options.resetOnLastFrame === true) {
			this.video.currentTime = 0;
		}

		if (this.options.loop === true) {
			this.video.currentTime = 0;
			this.play();
		}
	}

	if (this.playing) {
		this.animationFrame = requestAnimationFrame(function(){
			//android 教师视频
			if(self.options.isAndroidTeacherVideo && self.video.currentTime > 0.1){
				// console.log('loop:  ',self.video.currentTime);
				self.drawFrame();
			}
			self.loop();
		});
	}
	else {
		cancelAnimationFrame(this.animationFrame);
	}
};

CanvasVideoPlayer.prototype.drawFrame = function() {
	let isBgGreenColor = (r, g, b)=>{
		// return r < 25 && g > 225 && b < 25;
		return  g > r+80 && g> b + 80;
		// return r<20&&g<20&&b<20;
	};
	let isGreenColor = (r, g, b)=>{
		return g > 30 && g > r+8 && g > b+8;
	};
	let findClosestNonGreenColor = (data, r, g, b, i, len)=>{
		let rgb = [221, 221, 221], steps = 10000;

		//向右找,找到图片边缘|绿色背景点|非绿色点为止
		let rightSteps = 1;
		while(true){
			if((i%this.width)+rightSteps >= this.width){break} //已到图片右边缘

			let rightR = data[(i+rightSteps)*4 + 0]; //右一点的R值
			let rightG = data[(i+rightSteps)*4 + 1]; //右一点的G值
			let rightB = data[(i+rightSteps)*4 + 2]; //右一点的B值
			if(isBgGreenColor(rightR, rightG, rightB)){
				break
			}
			if(!isBgGreenColor(rightR, rightG, rightB) && !isGreenColor(rightR, rightG, rightB) && rightSteps < steps){
				rgb = [rightR, rightG, rightB];
				steps = rightSteps;
				if(rightSteps == 1) {
					return rgb;
				}else {
					break;
				}

			}
			rightSteps++;
			if(rightSteps>6){
				break;
			}
		}

		//向下找,找到图片边缘|绿色背景点|非绿色点为止
		let downSteps = 1;
		while(true){
			if((i+downSteps*this.width) >= len){break} //已到图片下边缘

			let downR = data[(i+downSteps*this.width)*4 + 0]; //下一点的R值
			let downG = data[(i+downSteps*this.width)*4 + 1]; //下一点的G值
			let downB = data[(i+downSteps*this.width)*4 + 2]; //下一点的B值
			if(isBgGreenColor(downR, downG, downB)){
				break
			}
			if(!isBgGreenColor(downR, downG, downB) && !isGreenColor(downR, downG, downB) && downSteps < steps){
				rgb = [downR, downG, downB];
				steps = downSteps;
				if(downSteps == 1) {
					return rgb;
				}else {
					break;
				}
			}
			downSteps++;
			if(downSteps>6){
				break;
			}

		}

		//向左找,找到图片边缘|绿色背景点|非绿色点为止
		let leftSteps = 1;
		while(true){
			if((i%this.width)-leftSteps <= 0){break} //已到图片左边缘

			let leftR = data[(i-leftSteps)*4 + 0]; //左一点的R值
			let leftG = data[(i-leftSteps)*4 + 1]; //左一点的G值
			let leftB = data[(i-leftSteps)*4 + 2]; //左一点的B值
			if(isBgGreenColor(leftR, leftG, leftB)){
				break
			}
			if(!isBgGreenColor(leftR, leftG, leftB) && !isGreenColor(leftR, leftG, leftB) && leftSteps < steps){
				rgb = [leftR, leftG, leftB];
				steps = leftSteps;
				if(leftSteps == 1) {
					return rgb;
				}else {
					break;
				}
			}
			leftSteps++;
			if(leftSteps>6){
				break;
			}
		}

		//向上找,找到图片边缘|绿色背景点|非绿色点为止
		let upSteps = 1;
		while(true){
			if((i-upSteps*this.width) <= 0){break} //已到图片上边缘

			let upR = data[(i-upSteps*this.width)*4 + 0]; //上一点的R值
			let upG = data[(i-upSteps*this.width)*4 + 1]; //上一点的G值
			let upB = data[(i-upSteps*this.width)*4 + 2]; //上一点的B值
			if(isBgGreenColor(upR, upG, upB)){
				break
			}
			if(!isBgGreenColor(upR, upG, upB) && !isGreenColor(upR, upG, upB) && upSteps < steps){
				rgb = [upR, upG, upB];
				steps = upSteps;
				if(upSteps == 1) {
					return rgb;
				}else {
					break;
				}
			}
			upSteps++;
			if(upSteps>6){
				break;
			}
		}

		return rgb;
	};

	if(angular.element(this.canvas).is(".teacher-canvas")){
		this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
		let frame = this.ctx.getImageData(0,0,this.width,this.height);
		let frame2 = this.ctx.getImageData(0,0,this.width,this.height);
		let len = frame.data.length / 4;
		for (let i = 0; i < len; i++) {
			let r = frame.data[i * 4 + 0];
			let g = frame.data[i * 4 + 1];
			let b = frame.data[i * 4 + 2];
			if (isBgGreenColor(r,g,b)) {
				frame.data[i * 4 + 3] = 0;
			}else if(isGreenColor(r,g,b)){
				let closestRGB = findClosestNonGreenColor(frame2.data,r, g, b, i, len);
				frame.data[i * 4 + 0] = closestRGB[0];
				frame.data[i * 4 + 1] = closestRGB[1];
				frame.data[i * 4 + 2] = closestRGB[2];
				frame.data[i * 4 + 3] = 255 - Math.ceil(0.5*255*Math.max(g-r,g-b)/g)
			}
		}
		this.ctx.putImageData(frame, 0, 0);
		// console.log("teacher");
	}else{
		// console.log("teach");

		this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
	}
};

export default CanvasVideoPlayer;
