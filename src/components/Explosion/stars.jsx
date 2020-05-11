import React, { useMemo, useState } from "react"
import { useFrame } from "react-three-fiber"

const lerp = (start, end, alpha) => start * (1 - alpha) + end * alpha

const Stars = ({ count = 1000, xOff = 0, yOff = 0, zOff = 50 }) => {

    const [starOpacity, setStarOpacity] = useState(0.2)

    useFrame(() => {
        if (starOpacity < 1) setStarOpacity(lerp(starOpacity, 1.05, 0.05))
    })

    const starPositionArray = useMemo(() => {
        const positions = []
        for (let i = 0; i < count; i++) {
            positions.push((xOff + Math.random() * 1000) * (Math.round(Math.random()) ? -1 : 1))
            positions.push((yOff + Math.random() * 1000) * (Math.round(Math.random()) ? -1 : 1))
            positions.push((zOff + Math.random() * 1000) * (Math.round(Math.random()) ? -1 : 1))
        }
        return new Float32Array(positions)
    }, [count, xOff, yOff, zOff])

    return (
        <points>
            <bufferGeometry attach="geometry">
                <bufferAttribute attachObject={["attributes", "position"]} count={count} array={starPositionArray} itemSize={3} />
            </bufferGeometry>

            <pointsMaterial attach="material" size={1.5} sizeAttenuation color="white" transparent opacity={starOpacity} fog={false} />
        </points>
    )
}

export default Stars
