import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene
{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor()
    {
        super('game')
    }

    preload()
    {
        this.load.image('background', 'assets/bg_layer1.png')
        this.load.image('platform', 'assets/ground_grass.png')
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    create()
    {
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)
        this.platforms = this.physics.add.staticGroup()
    // then create 5 platforms from the group
        for (let i = 0; i < 5; ++i)
        {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const platform = this.platforms.create(x, y, 'platform')
        platform.scale = 0.5

        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body = platform.body
        body.updateFromGameObject()
        }
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
        this.physics.add.collider(this.platforms, this.player)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.cameras.main.startFollow(this.player)
        // set the horizontal dead zone to 1.5x game width
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
    }
    update(t, dt)
    {
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child
        
            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700)
            {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
            })
        // find out from Arcade Physics if the player's physics body
        // is touching something below it
        const touchingDown = this.player.body.touching.down
        if (touchingDown)
        {
        // this makes the bunny jump straight up
        this.player.setVelocityY(-300)
        }
        if (this.cursors.left.isDown && !touchingDown)
        {
        this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && !touchingDown)
        {
        this.player.setVelocityX(200)
        }
        else
        {
        // stop movement if not left or right
        this.player.setVelocityX(0)
        }
        this.horizontalWrap(this.player)
    }
    /**
    * @param {Phaser.GameObjects.Sprite} sprite
    */
    horizontalWrap(sprite)
    {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth)
        {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth)
        {
        sprite.x = -halfWidth
        }
    }
}