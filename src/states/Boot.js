import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init (level_file, next_state, extra_parameters) {
    this.stage.backgroundColor = '#000000'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)

    this.level_file = level_file
    this.next_state = next_state
    this.extra_parameters = extra_parameters

  }

  preload () {
    WebFont.load({
      google: {
        families: ['Nunito']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.text("level1", this.level_file)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  render () {

    let level_text, level_data
    level_text = this.game.cache.getText("level1")
    level_data = JSON.parse(level_text)

    if (this.fontsReady) {
      this.state.start('Splash', true, false, level_data, this.next_state, this.extra_parameters)
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }

}
