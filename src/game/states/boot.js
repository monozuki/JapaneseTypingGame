var bootState = {
	create: function() {
		game.stage.backgroundColor = '#5d5d5d';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}
};