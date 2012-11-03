(function() {
	this.pjs = this.pjs || {};

	this.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		function(callback) {
			window.setTimeout(function() {
				callback(new Date().getTime());
			}, 1 / 60 * 1000);
		};

	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);

		return (results && results[1]) || '';
	}

	var paused = false;
	var lastTimestamp = 0;
	var texture = new Image();
	texture.src = 'particle.png';
	var particleSystem;
	var canvas;
	var context;

	function draw(timestamp) {
		if (paused) {
			return;
		}

		var delta = timestamp - (lastTimestamp || timestamp);
		lastTimestamp = timestamp;

		delta /= 1000;
		particleSystem.update(delta);

		context.fillStyle = 'black';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		pjs.Renderer.render(context, particleSystem.particles);

		requestAnimationFrame(draw);
	}

	pjs.onReady = function() {
		pjs.ps = particleSystem = new pjs.Emitter({
			totalParticles: 300,
			emissionRate: 50,
			pos: {
				x: 200,
				y: 200
			},
			angle: 0,
			angleVar: 360,
			speed: 20,
			speedVar: 10,
			life: 7,
			lifeVar: 4,
			radialAccel: - 20,
			radialAccelVar: 0,
			tangentialAccel: 15,
			tangentialAccelVar: 0,
			radius: 10,
			radiusVar: 4,
			startScale: 1,
			endScale: 0,
			//texture: texture,
			startColor: [1, 0.5, 0, 0.8],
			endColor: [0, 0, 0, 0],
			active: true,
			duration: Infinity
		});

		canvas = document.createElement('canvas');
		canvas.width = 350;
		canvas.height = 400;
		context = canvas.getContext('2d');

		pjs.ui.Builder.build(pjs, particleSystem, canvas, getUrlParam('ui'), function() {
			draw(new Date().getTime());
		});

	};

	pjs.pause = function() {
		paused = true;
	};

	pjs.resume = function() {
		paused = false;
		lastTimestamp = 0;
		draw(new Date().getTime());
	}
})();

