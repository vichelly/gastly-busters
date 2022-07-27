let canvas = document.getElementById("mycanvas")
let scoreEl = document.getElementById("scoreEl")
let ctx = canvas.getContext("2d")

canvas.width = 1200
canvas.height = 600

let mousex
let mousey

canvas.addEventListener(type='mousemove', e=>{
    mousex = e.offsetX
    mousey = e.offsetY
})

//criando o player

class Player{
    constructor(){
        this.velocity = {
            x:0,
            y:0
        }
       
        this.opacity = 1

        const image = new Image()
        image.src = 'mewtho.png'
        image.onload = () =>{
            const scale = 0.7
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width /2 - this.width / 2 ,
                y: canvas.height/2
            }

        }

    }    
    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        ctx.restore()
    }

   
    update(){
        if (this.image){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    }
}

// criando projetil

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 12
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius, 0,
            Math.PI*2)
            ctx.fillStyle = '#00F6DE'
            ctx.fill()
            ctx.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

//criando particula de morte

class Particle {
    constructor({position, velocity, radius, color}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
    }
    draw(){
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius, 0,
            Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.opacity -= 0.01
    }
}

//criando projetil do inimigo

class GastlyProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 9
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius, 0,
            Math.PI*2)
            ctx.fillStyle = '#C500ED'
            ctx.fill()
            ctx.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

//criando o inimigo

class Gastly{
    constructor({position}){
        this.velocity = {
            x:0,
            y:0
        }


        const image = new Image()
        image.src = 'gastly.png'
        image.onload = () =>{
            const scale = 0.1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
        }
        }

    }    
    draw() {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

   
    update({velocity}){
        if (this.image){
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
    }
    }

    shoot(gastlyProjectiles){
        gastlyProjectiles.push(new GastlyProjectile({
            position: {
                x: this.position.x + this.width / 2 ,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 7
            }
        }))

    }
}

// criando hordas inimigas

class Hord{
    constructor(){
        this.position ={
            x:0 ,
            y:0
        }
        this.velocity = {
            x:5,
            y:0
        }
        this.gastlys = []

        const rows =Math.floor( Math.random()*4 + 2)
        const colun =Math.floor( Math.random()*2 + 2)

        this.width = colun * 100

        for (let x = 0; x<colun; x++){
        for (let y = 0; y< rows; y++){
            this.gastlys.push(new Gastly({position:{
                x: x * 70,
                y: y * 70
            }}))
        }}
        gastlys = gastlys.concat(this.gastlys)
        console.log(this.gastlys)
    }
    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 60
        }
    }
}

const player = new Player()
const projectiles = []
const hords = []
const gastlyProjectiles = []
const particles = []
var gastlys = []

// para manter as teclas não pressionadas 

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    click: {
        pressed: false
    },
    s: {
        pressed: false
    },
    w: {
        pressed:false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() *500) + 500 
let game = {
    over: false,
    active: true
}

let score = 0

// função de particulas diferencia as particulas de gastly e as do player

function createParticles({object, color}){
    for(let v = 0; v<15; v++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height /2
            },
            velocity: {
                x: (Math.random() - 0.5)*2,
                y: (Math.random() - 0.5)*2
            },
            radius: Math.random()*5 ,
            color: color || '#570861'
        }))
    }
}

// função de animação

function animate(){
    if (!game.active) return
    requestAnimationFrame(animate)
   
    const fundo = new Image()
    fundo.src = 'Lavender.jpeg'
    ctx.drawImage(fundo, 0, 0, 1200, 600)
   
    player.update()
    particles.forEach((particle, i )=> {
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i,1)
            }, 0)
        } else particle.update()
    })
    gastlyProjectiles.forEach((gastlyProjectile, index) => {
        if (gastlyProjectile.position.y >= canvas.height) {
            setTimeout(() =>{
                gastlyProjectiles.splice(index, 1)
            }, 0 )
        } else gastlyProjectile.update()

        //projetil acerta o player
        if (gastlyProjectile.position.y + gastlyProjectile.radius*2 >= player.position.y 
            && 
            gastlyProjectile.position.x + gastlyProjectile.radius*2 >= player.position.x
            &&
            gastlyProjectile.position.x <= player.position.x + player.width
            &&
            gastlyProjectile.position.y <= player.position.y + player.height
            ){
                console.log('you lose')

                setTimeout(() =>{
                    gastlyProjectiles.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0 )

                setTimeout(() =>{
                    game.active = false
                }, 2000 )

                createParticles({
                    object: player,
                    color: 'red'
                })
            }
    })

    gastlys.forEach((gastly, index) => {
        //inimigo acerta o player
        if (gastly.position.y + gastly.height - 17 >= player.position.y 
            && 
            gastly.position.x + gastly.width - 17 >= player.position.x
            &&
            gastly.position.x - 17 <= player.position.x + player.width
            &&
            gastly.position.y - 17 <= player.position.y + player.height
            ){
                console.log('you lose')

                setTimeout(() =>{
                    gastlys.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0 )

                setTimeout(() =>{
                    game.active = false
                }, 2000 )

                createParticles({
                    object: player,
                    color: 'red'
                })
            }

    })

    projectiles.forEach((projectile, index) => {

        if ( projectile.position.x + projectile.radius <= 0 ){
            setTimeout(() =>{
                projectiles.splice(index, 1)
            }, 0 )
                }
        else{
        projectile.update()
        }
    })

    let k = 0

    hords.forEach((hord, hordIndex) => {
        hord.update()
            // spawn de projeteis
    if (frames % 50 === 0 && hord.gastlys.length>0) {
        hord.gastlys[Math.floor(Math.random() * hord.gastlys.length)].shoot(
            gastlyProjectiles
        )
    }
        hord.gastlys.forEach((gastly, i) =>{
            gastly.update({velocity: hord.velocity})

            //projetil acerta o inimigo

            projectiles.forEach((projectile , j) => {
                if (projectile.position.y - projectile.radius <= 
                    gastly.position.y + gastly.height &&
                    projectile.position.x + projectile.radius >=
                    gastly.position.x && projectile.position.x - 
                    projectile.radius <= gastly.position.x + gastly.width &&
                    projectile.position.y + projectile.radius >= 
                    gastly.position.y
                    ) {

                    setTimeout(() => {
                        const gastlyFound = hord.gastlys.find((gastly2) => 
                            gastly2 === gastly
                            )
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        // remover gastly e projetil
                        if (gastlyFound && projectileFound){
                            score += 100
                            console.log(score)
                            scoreEl.innerHTML = score
                       
                            createParticles({
                                object: gastly
                            })

                        hord.gastlys.splice(i, 1)
                        projectiles.splice(j, 1)

                        if (hord.gastlys.length > 0){
                            const firstGastly = hord.gastlys[0]
                            const lastGastly = hord.gastlys[hord.gastlys.length - 1]

                            hord.width = lastGastly.position.x - firstGastly.position.x + lastGastly.width
                            hord.position.x = firstGastly.position.x
                        } else{
                            hords.splice(hordIndex, 1)
                        }
                        }
                    }, 0)
                }
            })
        })
        k=+1
    })

    // movimentação do jogador

    if(keys.a.pressed && player.position.x >= 0 ){
        player.velocity.x = -6
        player.velocity.y = 0
    }
    else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 6
        player.velocity.y = 0
    }
    else if(keys.w.pressed && player.position.y >= 0){
        player.velocity.y = -6
        player.velocity.x = 0
    }
    else if(keys.s.pressed && player.position.y + player.height <= canvas.height) {
        player.velocity.y = 6
        player.velocity.x = 0
    }
    else{
        player.velocity.x = 0
        player.velocity.y = 0
    }

    //spawn de inimigos em intervalo de tempo "aleatório"
    if (frames % randomInterval ===  0){
        hords.push(new Hord())
        randomInterval = Math.floor(Math.random() * 500 + 150)
        frames = 0
    }


    frames++
}

// movimentação do jogador

addEventListener('click', (event) => {
    if(game.over) return

    console.log('tiro')
    if(event.button == 0){
    let velocityx = mousex-(player.position.x + player.width-20)
    let velocityy = mousey-(player.position.y + 80)
    let ni = ((velocityx**2)+(velocityy**2))**(1/2)
    velocityx = velocityx*16/ni
    velocityy = velocityy*16/ni
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width-20  ,
            y: player.position.y + 80
        },
        velocity:{
            x:velocityx,
            y:velocityy
        }
    }
    ))
}  
})

//movimentação do jogador

addEventListener('keydown', ({key}) => {
    if(game.over) return
    console.log(key)
    switch(key){
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            console.log('right')
            keys.d.pressed = true
            break
        case 'w':
            console.log('up')
            keys.w.pressed = true
            break
        case 's':
            console.log('down')
            keys.s.pressed = true
            break

    }
} )

// movimentação do jogador

addEventListener('keyup', ({key}) => {
    console.log(key)
    switch(key){
        case 'a':
            console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            console.log('right')
            keys.d.pressed = false
            break
        case 'click':
            console.log('tiro')
            break
        case 'w':
            console.log('up')
            keys.w.pressed = false
            break
        case 's':
            console.log('down')
            keys.s.pressed = false
            break

    }

} )

function main(){
    animate();
}