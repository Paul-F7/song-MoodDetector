EMOTION_COORDINATES = {
    # High Energy / Positive
    "Ecstatic":     (0.92, 0.92),
    "Excited":      (0.88, 0.88),
    "Happy":        (0.80, 0.75),
    "Delighted":    (0.85, 0.70),
    "Amused":       (0.70, 0.65),
    
    # High Energy / Negative
    "Furious":      (0.10, 0.90),
    "Angry":        (0.15, 0.85),
    "Frustrated":   (0.20, 0.80),
    "Tense":        (0.25, 0.85),
    "Afraid":       (0.20, 0.90),
    "Alarmed":      (0.30, 0.92),
    "Distressed":   (0.15, 0.75),
    
    # Low Energy / Negative
    "Miserable":    (0.10, 0.20),
   "Depressed":    (0.15, 0.15),
    "Sad":          (0.20, 0.25),
    "Bored":        (0.30, 0.30),
    "Tired":        (0.35, 0.20),
    "Gloomy":       (0.25, 0.30),
    
    # Low Energy / Positive
    "Serene":       (0.85, 0.30),
    "Relaxed":      (0.80, 0.20),
    "Calm":         (0.70, 0.25),
    "Content":      (0.75, 0.35),
    "Sleepy":       (0.55, 0.15),
    "Peaceful":     (0.75, 0.15),
    
    # Neutral
    "Neutral":      (0.50, 0.50),
    "Astonished":   (0.55, 0.95),
}

text = {
    "Ecstatic": '{"emoji": "🎉", "description": "You’re craving festival-sized EDM and glittering hyperpop that launch you into the sky—towering saw leads, confetti-cannon drops, and choirs of synths that feel like you just won every prize at once 😄🎉. It sounds like you want music that mirrors your own larger-than-life optimism, the kind that makes you sprint toward the front row because today you’re unstoppable and everyone around you knows it."}',
    "Excited": '{"emoji": "🔥", "description": "Anthemic pop-rock and future bass that sprint at 140 BPM, all bright guitars, laser-cut synth stabs, and choruses you can shout with friends 🎸🔥. You seem ready to dive in headfirst, so the tracks cheer you on with adrenaline-laced buildups and hooks that match your own buzzing, can’t-sit-still energy."}',
    "Happy": '{"emoji": "😊", "description": "Sunlit indie pop with jangly guitars, handclaps, and bouncing basslines that feel like biking downhill with wind in your hair ☀️😊. The music smiles back at you, affirming that you’re the kind of listener who finds joy in every detail—whistled hooks, playful percussion, and lyrics that celebrate the everyday wins you’re already savoring."}',
    "Delighted": '{"emoji": "✨", "description": "Nu-disco and French house with velvet strings, rubbery bass, and glitter-ball percussion that twirls you under the lights 💃✨. These tracks treat you like someone who collects small miracles—a perfectly timed chord change, a sly falsetto line—because you appreciate elegance wrapped in groove and it shows."}',
    "Amused": '{"emoji": "😏", "description": "Left-field funk-pop and art-rock with witty lyrics, offbeat horn stabs, and cartoonish synth bends that wink at you 😏🎶. The music assumes you enjoy the punchline as much as the melody, playing with rhythm and rhyme to match your own playful, raised-eyebrow curiosity."}',

    "Furious": '{"emoji": "😡", "description": "Industrial metal, rage-rap, and blown-out dubstep with serrated guitars, rattling 808s, and distortion that snarls back at the world 😡⚔️. The sound honors your need to vent, matching your clenched fists with blast beats and drop-tuned riffs that say you refuse to swallow this anger quietly."}',
    "Angry": '{"emoji": "🤬", "description": "Hardcore punk and thrash that barrel forward on 16th-note drums, gang vocals, and guitars like a chainsaw through drywall 🔥🤬. These songs know you’re fed up; they hand you the mic to shout it out, channeling your defiance into raw volume so you don’t have to keep it bottled up."}',
    "Frustrated": '{"emoji": "💥", "description": "Post-hardcore and glitchy electro-rock that toggle between tense verse lines and cathartic, feedback-soaked choruses 🎧💥. The music hears the knots in your shoulders and offers release valves—odd time signatures, sudden filter sweeps—mirroring how you pivot from restraint to outburst when you’ve had enough."}',
    "Tense": '{"emoji": "😰", "description": "Cinematic darkwave and minimal techno with creeping pads, ticking hi-hats, and bass pulses that hover at the edge of your heartbeat 😰🎼. These tracks sense you’re on high alert and keep the suspense taut, letting you surf the edge until you decide whether to fight or breathe through it."}',
    "Afraid": '{"emoji": "👻", "description": "Haunted ambient and horror-score strings with distant whispers, bowed metal, and sub-bass rumbles that flicker like shadows in a hallway 👻🕯️. The music understands you’re watching every corner, so it paints the unease you feel while gently guiding you toward a light that might be safety—or another twist."}',
    "Alarmed": '{"emoji": "🚨", "description": "Siren-laced drum and bass and percussive techno that slam on the strobe lights—rattling breaks, alarm-call synths, and sudden drops 🚨🪓. The sound moves as fast as your pulse, matching your snap decisions and reminding you that you’re sharp enough to ride the shock without losing control."}',
    "Distressed": '{"emoji": "😓", "description": "Downtempo trip-hop and alt-R&B steeped in reverb, cracked vinyl hiss, and hushed vocals that sound like late-night confessionals 😓🌧️. These songs wrap around your worry, acknowledging you’re overwhelmed while offering a dark, velvety space to exhale every tangled thought."}',

    "Miserable": '{"emoji": "😔", "description": "Bare-bones piano laments and chamber folk with aching strings, soft brushes on snare, and lyrics that sit heavy like winter air 😔🎻. The music understands you’re carrying weight, so it moves slowly, letting your own voice echo in the quiet until the sadness feels witnessed."}',
    "Depressed": '{"emoji": "💧", "description": "Shoegaze and slowcore draped in swollen reverb, distant vocals, and guitars that bloom like smoke rings in a dim room 🕯️💧. The tracks mirror the fog you’re in, offering a soft wall of sound to lean on when getting up feels impossible, yet still humming with the faint hope you’ll rise."}',
    "Sad": '{"emoji": "🥀", "description": "Intimate singer-songwriter ballads with fingerpicked acoustic lines, brushed drums, and lyrics written like diary entries 🪕🌧️. The music treats you gently, knowing you’re tender right now, and lets you hear your own story echoed back with empathy and rain-on-window sincerity."}',
    "Bored": '{"emoji": "😐", "description": "Lo-fi hip-hop loops, minimal ambient drones, and bedroom beats that repeat like the ceiling fan on a slow afternoon 📻😐. These tracks respect your low-key restlessness, offering subtle chord shifts and tape hiss textures that give your drifting thoughts somewhere to wander."}',
    "Tired": '{"emoji": "😴", "description": "Late-night neo-soul and downtempo R&B with velvety Rhodes chords, sleepy falsettos, and drums that sway like a hammock 💤🎙️. The music hears your fatigue and rocks you gently, matching the heavy eyelids and promising you can finally let go for a while."}',
    "Gloomy": '{"emoji": "🌫️", "description": "Smoke-blue jazz and soul with minor-key piano, brushed cymbals, and a sax that lingers in the doorway 🌫️🎷. The songs see the cloud over you and keep pace, offering slow-burning melodies so you can sit with the gray without feeling rushed to cheer up."}',

    "Serene": '{"emoji": "🌿", "description": "Pastoral modern classical and acoustic new-age pieces with harp plucks, airy strings, and woodwinds that feel like open fields at sunrise 🌿🎼. The music matches your steady breathing, affirming that you’re centered and savoring the quiet you’ve carved out for yourself."}',
    "Relaxed": '{"emoji": "☕", "description": "Chillhop and Balearic lounge with soft electric pianos, palm-muted guitar, and gentle congas that sway like waves against a pier ☕🌙. These tracks assume you’re in no hurry, giving you a warm sonic couch where every bar invites another deep inhale."}',
    "Calm": '{"emoji": "🕊️", "description": "Featherlight ambient guitar loops, soft choir pads, and distant chimes that float like mist over a still lake 🌊🕊️. The music recognizes your tranquility, keeping everything hushed and patient so your thoughts can drift without bumping into sharp corners."}',
    "Content": '{"emoji": "🌻", "description": "Organic folk-pop with cozy harmonies, hand percussion, and upright bass that feels like friends singing on a porch at golden hour 🌻🎶. The songs reflect your quiet satisfaction, celebrating that you’re exactly where you need to be and happy to linger there."}',
    "Sleepy": '{"emoji": "🌙", "description": "Indie lullabies and hushed downtempo with cottony synth pads, whispered vocals, and brushed drums that blur the edges of the room 😴🌙. The music tucks you in, syncing to your slow blink and letting the day dissolve into a soft hum."}',
    "Peaceful": '{"emoji": "🎐", "description": "Nature-woven ambient with field recordings of rain, bamboo flutes, and glassy tones that shimmer like light on calm water 🌲🎐. The tracks honor your inner stillness, giving you space to float, unbothered, as if the world outside finally matched the quiet inside."}',

    "Neutral": '{"emoji": "🤍", "description": "Mid-tempo electro-pop with clean synth lines, four-on-the-floor kicks, and vocals that keep a steady emotional midpoint 🤍🎧. The music mirrors your even keel—unrushed, unshaken—and gives you a reliable groove that neither lifts nor drags your current mood."}',
    "Astonished": '{"emoji": "😮", "description": "Orchestral-pop and maximalist future bass with sudden brass swells, sparkling arps, and cliff-drop choruses that feel like stepping into a planetarium of sound 😮🎇. The tracks treat you like a wide-eyed explorer, matching your awe with crescendos and reverses that keep revealing new stars."}',
}
