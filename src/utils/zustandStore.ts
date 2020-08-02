import create from 'zustand';

type ScenesType = {
    currentScene: string
    previousScene: string
}

type Store = {
    mouseCoords: number[],
    scrolled: number,
    exploded: boolean,
    explosionPosition: [number, number, number],
    scenes: ScenesType,
    cameraPosition: [number, number, number],
    mouseMove: ([x, y]: number[]) => void,
    scroll: (scrolled: number) => void,
    setExploded: (exploded: boolean) => void,
    setCurrentScene: (scene: ScenesType) => void,
    setCameraPosition: (pos: [number, number, number]) => void,
    setExplosionPosition: (pos: [number, number, number]) => void
}

const [useStore, { subscribe, getState }] = create<Store>(set => ({
    mouseCoords: [0, 0],
    scrolled: 0,
    exploded: false,
    explosionPosition: [0, 0, 0],
    scenes: {currentScene: '', previousScene: ''},
    cameraPosition: [0, 10, 4],
    mouseMove: ([x, y]) => set({mouseCoords: [x, y]}),
    scroll: (scrolled) => set({scrolled}),
    setExploded: (exploded) => set({exploded}),
    setCurrentScene: (scene) => set({scenes: scene}),
    setCameraPosition: (pos) => set({cameraPosition: pos}),
    setExplosionPosition: (pos) => set({explosionPosition: pos})
}));

export {useStore, subscribe, getState}