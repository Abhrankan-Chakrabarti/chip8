use chip8_core::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, KeyboardEvent};
use js_sys::Uint8Array;

#[wasm_bindgen]
pub struct EmulatorWasm {
    chip8: Emulator,
    ctx: CanvasRenderingContext2d,
}

#[wasm_bindgen]
impl EmulatorWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<EmulatorWasm, JsValue> {
        let chip8 = Emulator::new();
       
        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: HtmlCanvasElement = canvas
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();
        let ctx = canvas.get_context("2d")
            .unwrap().unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .unwrap();

        Ok(EmulatorWasm{ chip8, ctx })
    }

    #[wasm_bindgen]
    pub fn tick(&mut self) {
        self.chip8.tick();
    }

    #[wasm_bindgen]
    pub fn tick_timers(&mut self) {
        self.chip8.tick_timers();
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.chip8.reset();
    }

    #[wasm_bindgen]
    pub fn keypress(&mut self, evt: KeyboardEvent, pressed: bool) {
        let key = evt.key();
        if let Some(k) = key2btn(&key) {
            self.chip8.keypress(k, pressed);
        }
    }

    #[wasm_bindgen]
    pub fn load_game(&mut self, data: Uint8Array) {
        self.chip8.load(&data.to_vec());
    }

    #[wasm_bindgen]
    pub fn draw_screen(&mut self, scale: usize) {
        let disp = self.chip8.get_display();
        for i in 0..(SCREEN_WIDTH * SCREEN_HEIGHT) {
            if disp[i] {
                let x = i % SCREEN_WIDTH;
                let y = i / SCREEN_WIDTH;
                self.ctx.fill_rect(
                    (x * scale) as f64,
                    (y * scale) as f64,
                    scale as f64,
                    scale as f64
                );
            }
        }
    }
}

fn key2btn(key: &str) -> Option<usize> {
    match key {
        "1" => Some(0x1),
        "2" => Some(0x2),
        "3" => Some(0x3),
        "4" => Some(0xC),
        "q" | "Q" => Some(0x4),
        "w" | "W" => Some(0x5),
        "e" | "E" => Some(0x6),
        "r" | "R" => Some(0xD),
        "a" | "A" => Some(0x7),
        "s" | "S" => Some(0x8),
        "d" | "D" => Some(0x9),
        "f" | "F" => Some(0xE),
        "z" | "Z" => Some(0xA),
        "x" | "X" => Some(0x0),
        "c" | "C" => Some(0xB),
        "v" | "V" => Some(0xF),
        _ => None,
    }
}