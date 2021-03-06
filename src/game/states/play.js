var playState = {
	preload: function() {
		// load the words that will be reviewed
		this.review = [];
		for (let i = 0; i < vue.numEntries; i++) {
			const pair = game.frequencyList[i];
			this.review.push([pair[0], pair[1]]);
		}

		game.stage.disableVisibilityChange = true;
	}, 

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.targets = [];
		this.lives = 3;
		this.score = 0;

		// Layers to control the order in which objects are rendered
		this.backLayer = game.add.group();
		this.midLayer = game.add.group();
		this.frontLayer = game.add.group();

		// The horizontal bar at the bottom of the screen
		this.bar = game.add.graphics();
		this.bar.beginFill(0x4286f4);
		this.bar.drawRect(0, 530, 800, 70);
		this.bar.endFill();
		this.frontLayer.add(this.bar);

		this.frontLayer.add(game.add.text(20, 550, 'Input: ', { font: '20pt Arial', fill: '#ffffff' }));
		this.textBuffer = game.add.text(100, 550, '', { font: '20pt Arial', fill: '#ffffff' });
		this.frontLayer.add(this.textBuffer);

		this.livesLabel = game.add.text(20, 20, 'Lives: 3', { font: '20pt Arial', fill: '#ffffff' });
		this.frontLayer.add(this.livesLabel);

		this.scoreLabel = game.add.text(20, 45, 'Score: 0', { font: '20pt Arial', fill: '#ffffff' });
		this.frontLayer.add(this.scoreLabel);

		// Set up a listener for each letter in the Roman alphabet
		for (var keycode = Phaser.Keyboard.A; keycode <= Phaser.Keyboard.Z; keycode++) {
			game.input.keyboard.addKey(keycode).onDown.add(
				this.handleKeyInput(String.fromCharCode(keycode).toLowerCase()), 
				this
			);
		}

		// Submit and clear the input
		game.input.keyboard.addKey(Phaser.KeyCode.ENTER).onDown.add(this.enterPressed, this);

		// Delete the rightmost letter or kana
		game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE).onDown.add(this.backspacePressed, this);

		game.time.events.repeat(Phaser.Timer.SECOND * 2, this.review.length, this.generateRandomReview, this);
	}, 

	update: function() {
		var targets = this.targets;
		for (var reading in targets) {
			if (targets[reading].y >= GAME_HEIGHT - this.bar.height) {
				targets[reading].kill();
				delete targets[reading];
				this.lives = this.lives - 1;
				this.livesLabel.text = 'Lives: ' + this.lives;
			}
		}
	}, 


	/*** Below are functions that we define ***/
	generateRandomReview: function() {
		var i = Math.floor(Math.random()*this.review.length);
		var pair = this.review[i];
		
		if (this.targets[pair[1]]) { 
			// We don't allow targets with the same reading 
			// to be active at the same time.
			pair = null;
			for (i = 0; i < this.review.length; i++) {
				if (!this.targets[this.review[i][1]]) {
					pair = this.review[i];
					break;
				}
			}
			if (!pair) {
				return;
			}
		}

		this.review.splice(i, 1);
		this.generateTarget(pair[0], pair[1]);
	}, 

	generateTarget: function(text, reading) {
		var style = {
			font: '20pt MS Mincho', 
			fill: '#ffffff'
		}
		var textObject = game.add.text(MARGIN, 0, text, style);

		// A colored box for the text to go into
		var box = game.add.graphics();
		box.beginFill(0x397003);
		box.drawRect(0, 0, textObject.width + 2*MARGIN, 34);
		box.endFill();

		// Pick a random horizontal position but don't let the box run off the right edge
		var x = Math.floor(Math.random()*(game.world.width - box.width));
		// Initialize the target off-screen so that it can slide in from the top
		var y = -1*box.height
		// The parent object
		var sprite = game.add.sprite(x, y)
		sprite.addChild(box);
		sprite.addChild(textObject);

		game.physics.arcade.enable(sprite);
		sprite.body.velocity.y = 50;

		this.midLayer.add(sprite);
		this.targets[reading] = sprite;
	}, 

	handleKeyInput: function(letter) {
		return function() {
			var text = this.textBuffer.text + letter;
			this.textBuffer.text = wanakana.toKana(text, { IMEMode: true });
		}
	}, 

	enterPressed: function() {
		var reading = this.textBuffer.text;

		if (reading.slice(-1) == 'n') {
			// Let's be nice when the last kana is ん
			reading = reading.slice(0, -1) + 'ん';
		}

		if (this.targets[reading]) {
			this.targets[reading].kill();
			this.score = this.score + 1;
		}

		this.textBuffer.text = '';
		this.scoreLabel.text = 'Score: ' + this.score;
	}, 

	backspacePressed: function() {
		this.textBuffer.text = this.textBuffer.text.slice(0, -1);
	}
}
