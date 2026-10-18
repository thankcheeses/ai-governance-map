# Physics Notes

## Shallow Water (Dioramas)

- Linear shallow-water simulation on a staggered grid
- Heights at cell centers, velocities on faces
- Wave speed ≈ √(g · depth)
- Small surface tension term for jelly feel
- Damping + foam field (white water that fades and laces)
- Finger stirring injects velocity
- Block tilt produces slosh
- Floating objects displace volume back into the grid and generate wakes/foam
- Shoreline lace and meniscus on cut faces

## Soft Bodies (Specimens)

- XPBD with co-rotational shape matching (warm-started quaternions) + volume constraints
- Tetrahedral or lattice discretization
- Grab with bounded reach so stretching feels strong but controlled
- Edge damping and floor contact with friction
- Embedded particles (seeds, bubbles, fur) ride via barycentric weights

## Shared

- Fixed timestep (water ~1/120 s, bodies ~1/240 s)
- Accumulator + max catch-up
- Reset on NaN
