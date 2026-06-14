/// <reference lib="es2025">
/**
 * This toposort uses a 2-pass algorithm:
 * 1. For each vertex, mark each vertice that depends on it
 * 2. Find the direct dependencies of each dependency
 * The result is the vertices sorted by number of dependencies, with the least being first.
 *
 * @param {[number, number][]} graph
 * @returns {number[] | 'cycle'}
 * @example
 *
 */
export default function procode(graph, group = false) {
    /** @type {Map<number, number[]>} */
    const dependencies = new Map()
    const allVertices = new Set(graph.flat())

    // 1. Create the initial dependency map
    for (const vertex of allVertices) dependencies.set(vertex, [])

    // 2. For every `a -> b`, append `a` to `dependencies[b]`
    for (const [dependency, dependent] of graph) {
        dependencies.get(dependent).push(dependency)
    }

    // 3. For every { a: [b, c] }, append the direct dependencies of b and c
    for (const v of allVertices) {
        const dependenciesOfV = dependencies.get(v)
        for (const dep of dependenciesOfV) {
            if (dep === v) return 'cycle' // Cycle: v depends on itself
            dependenciesOfV.push(...dependencies.get(dep))
        }
    }

    // 4. Whichever vertice has the least dependencies goes first.
    if (!group) {
        // Default behaviour
        return [...dependencies.keys()].sort(
            (a, b) => dependencies.get(a).length - dependencies.get(b).length
        )
    }
    // You can group vertices with the same number of dependencies. To test,
    // ensure that vertices with the same number of dependencies don't depend
    // on each other. (In `[[2, 7]]`, `2` and `7` can't depend on each other)
    /* const result = []
    for (const v of allVertices) {
        const depCount = dependencies.get(v).length
        ;(result[depCount] ??= []).push(v)
    }
    return result.filter(Boolean) */
}
