import create from 'zustand';

const [useStore, { subscribe, getState }] = create(set => ({
    mouseCoords: [0, 0],
    scrolled: 0,
    exploded: false,
    mouseMove: ([x, y]) => set({mouseCoords: [x, y]}),
    scroll: (scrolled) => set({scrolled}),
    setExploded: (exploded) => set({exploded}),
}));

export {useStore, subscribe, getState}