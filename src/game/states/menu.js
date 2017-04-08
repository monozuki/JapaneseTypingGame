var menuState = {
	create: function() {

		game.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'Japanese Typing Game', 
			{
				font: '50px Arial', 
				fill: '#ffffff'
			}
		).anchor.set(0.5);;

		game.add.text(GAME_WIDTH/2, 3*GAME_HEIGHT/4, 'press the "W" key to start',
			{
				font: '25px Arial', 
				fill: '#ffffff'
			}
		).anchor.set(0.5);

		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		wkey.onDown.add(this.start, this);
	},

	start: function() {
		game.state.start('play');
	}
}