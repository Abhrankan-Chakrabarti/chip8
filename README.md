# CHIP-8 Emulator in Rust

This is a CHIP-8 emulator written in Rust that works both on the desktop and the browser. The desktop version includes a beep sound, while the web version features a clean and user-friendly UI. The emulator is based on the [Chip-8 Emulator Guide](https://aquova.net/chip8/chip8.pdf), and it aims to provide a simple yet accurate simulation of the Chip-8 system.

## Features
- **Desktop**: A Chip-8 emulator with beep sound support for an authentic experience.
- **Web**: A user-friendly UI with smooth gameplay and easy-to-use controls.
- **Cross-platform**: Runs on both desktop (Windows, macOS, Linux) and in modern web browsers.

## Requirements

### Desktop (Local):
- **Operating System**: Windows, macOS, or Linux.
- **Rust Toolchain**: [Install Rust](https://www.rust-lang.org/tools/install) via `rustup`.

### Browser:
- A modern web browser (Chrome, Firefox, Edge, etc.) with WebAssembly (Wasm) support.

## Installation

### For Desktop (Rust):
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chip8-emulator.git
2. Navigate to the project directory:
    ```bash
    cd chip8
3. Build and run the emulator with Cargo:
    ```bash
    cargo run
4. Load a Chip-8 game by placing the file in the project directory and passing the game file path as an argument to the program:
    ```bash
    cargo run -- path/to/game

## For Browser (WebAssembly):
1. Clone the repository
    ```bash
    git clone https://github.com/truthixify/chip8.git
2. Navigate to the project directory
    ```bash
    cd chip8
3. Build the project for WebAssembly:
    ```bash
    wasm-pack build --target web

Or visit the website to play the games in the browser without having to build the project yourself: ([website](https://truthixify.github.io/chip8/))

