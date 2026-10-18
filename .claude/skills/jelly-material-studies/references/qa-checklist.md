# QA Checklist

Before considering a scene complete:

- [ ] Single HTML file, no external requests
- [ ] WebGPU fallback card present and functional
- [ ] No console errors on load or during normal interaction
- [ ] Editorial layout matches series (paper, italic title, glass panel, how-to-play)
- [ ] Orbit, zoom, and primary interactions work with both mouse and touch
- [ ] Water/jelly responds to stirring or grabbing and settles
- [ ] Key actors (seaplane, boat, soft body, fish) behave as specified
- [ ] Flavour/slider changes take effect
- [ ] Pause and Reset work
- [ ] Mobile bottom sheet and no page scroll
- [ ] Sim stays under ~5 ms/frame on typical hardware
- [ ] Debug hook exposed on window
