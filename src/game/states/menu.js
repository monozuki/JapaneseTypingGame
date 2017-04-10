var menuState = {
	create: function() {

		game.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'Japanese Typing Game', 
			{
				font: '50px Arial', 
				fill: '#ffffff'
			}
		).anchor.set(0.5);;

	},

	start: function() {
		document.querySelector('#overlay').style.display = 'none';
		game.state.start('play');
	}
}