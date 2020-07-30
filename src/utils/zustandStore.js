import create from 'zustand';

const [useStore, { subscribe, getState }] = create(set => ({
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