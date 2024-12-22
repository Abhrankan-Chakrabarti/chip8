import init, * as wasm from "./wasm.js"

// Original dimensions
const originalWidth = 64
const originalHeight = 32

// Target dimensions (window size)
const targetWidth = window.innerWidth * 0.9
const targetHeight = window.innerHeight

// Calculate scale factors for both width and height
const scaleX = targetWidth / originalWidth
const scaleY = targetHeight / originalHeight

// Use the smaller scale factor to maintain aspect ratio
const SCALE = Math.min(scaleX, scaleY)

// Calculate new dimensions
const WIDTH = originalWidth * SCALE
const HEIGHT = originalHeight * SCALE

const TICKS_PER_FRAME = 10
let anim_frame = 0

const canvas = document.getElementById("canvas")
canvas.width = WIDTH
canvas.height = HEIGHT

const ctx = canvas.getContext("2d")
ctx.fillStyle = "black"
ctx.fillRect(0, 0, WIDTH, HEIGHT)

const input = document.getElementById("fileinput")
const dropdown = document.getElementById("dropdown")
const dropdownContent = document.getElementById("dropdown-content")
const infoBtn = document.querySelector(".info")
const deleteBtn = document.querySelector(".delete")
const msg = document.querySelector(".message")
const keypadCells = document.querySelectorAll("footer .cell")

infoBtn.addEventListener("click", () => {
    msg.classList.toggle("is-hidden")
})

deleteBtn.addEventListener("click", () => {
    msg.classList.add("is-hidden")
})

const games = [
    {
        name: "15PUZZLE",
        src: "/15PUZZLE"
    },
    {
        name: "BLINKY",
        src: "/BLINKY"
    },
    {
        name: "BLITZ",
        src: "/BLITZ"
    },
    {
        name: "BRIX",
        src: "/BRIX"
    },
    {
        name: "CONNECT4",
        src: "/CONNECT4"
    },
    {
        name: "GUESS",
        src: "/GUESS"
    },
    {
        name: "HIDDEN",
        src: "/HIDDEN"
    },
    {
        name: "INVADERS",
        src: "/INVADERS"
    },
    {
        name: "KALEID",
        src: "/KALEID"
    },
    {
        name: "MAZE",
        src: "/MAZE"
    },
    {
        name: "MERLIN",
        src: "/MERLIN"
    },
    {
        name: "MISSILE",
        src: "/MISSILE"
    },
    {
        name: "PONG",
        src: "/PONG"
    },
    {
        name: "PONG2",
        src: "/PONG2"
    },
    {
        name: "PUZZLE",
        src: "/PUZZLE"
    },
    {
        name: "SYZYGY",
        src: "/SYZYGY"
    },
    {
        name: "TANK",
        src: "/TANK"
    },
    {
        name: "TETRIS",
        src: "/TETRIS"
    },
    {
        name: "TICTAC",
        src: "/TICTAC"
    },
    {
        name: "UFO",
        src: "/UFO"
    },
    {
        name: "VBRIX",
        src: "/VBRIX"
    },
    {
        name: "VERS",
        src: "/VERS"
    },
    {
        name: "WIPEOFF",
        src: "/WIPEOFF"
    },
]

async function run() {
    await init()
    let chip8 = new wasm.EmulatorWasm()

    dropdown.addEventListener("click", () => {
        dropdown.classList.toggle("is-active")
    })

    document.addEventListener("keydown", (event) => {
        chip8.keypress(event, true)
    })

    document.addEventListener("keyup", (event) => {
        chip8.keypress(event, false)
    })

    keypadCells.forEach(keypad => {
        keypad.addEventListener("click", (event) => {
            const key = event.target.dataset.key
            const keyDownEvent = new KeyboardEvent("keydown", { key });
            document.dispatchEvent(keyDownEvent)
            setTimeout(() => {
                const keyUpEvent = new KeyboardEvent("keyup", { key });
                document.dispatchEvent(keyUpEvent)
            }, 100);
        })
    })

    games.forEach(game => {
        const content = document.createElement("a")
        content.textContent = game.name
        content.classList.add("dropdown-item")
        content.href = "#"
    
        dropdownContent.appendChild(content)
    })

    const dropdownItems = document.querySelectorAll(".dropdown-item")

    dropdownItems.forEach((item, i) => {
        item.addEventListener("click", () => {
            // Fetch the file content
            fetch("/chip8" + games[i].src)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching file: ${response.statusText}`)
                }

                return response.arrayBuffer()
            })
            .then(buffer => {
                // Stop previous game from rendering, if one exists
                if (anim_frame != 0) {
                    window.cancelAnimationFrame(anim_frame)
                }

                const rom = new Uint8Array(buffer)
                chip8.reset()
                chip8.load_game(rom)
                mainloop(chip8)
            })
            .catch(error => {
                console.error('Error reading file:', error)
            })
        })
    })
}
run().catch(console.error)

function mainloop(chip8) {
    // Only draw every few ticks
    for (let i = 0; i < TICKS_PER_FRAME; i++) {
        chip8.tick()
    }
    chip8.tick_timers()

    // Clear the canvas before drawing
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Set the draw color back to white before we render our frame
    ctx.fillStyle = "white"
    chip8.draw_screen(SCALE)

    anim_frame = window.requestAnimationFrame(() => {
        mainloop(chip8)
    })
}