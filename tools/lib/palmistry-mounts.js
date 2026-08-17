/* Palmistry dataset — mounts and hand shapes. Written per entity. */

const MOUNTS = {
  'mount-of-venus': {
    h1: 'Mount of Venus in Palmistry', kw: 'Mount of Venus', title: 'Mount of Venus Palmistry',
    desc: 'Mount of Venus palmistry: where the thumb mound sits, what full, flat and firm variations traditionally mean, and the limits of reading warmth from a hand.',
    answer: 'The Mount of Venus is the fleshy mound at the base of the thumb, enclosed by the curve of the life line. Traditional palmistry reads it as warmth, physical vitality and appetite for life. Its size largely reflects muscle and hand structure, so read any interpretation as symbolic rather than as a measurement of temperament.',
    where: 'It is the largest mound on the palm, filling the area between the thumb and the arc of the life line. Press it gently; traditional readers consider firmness as well as size.',
    variations: [
      ['Full and firm', 'Read as warmth, physical energy and enjoyment of company.'],
      ['Full and soft', 'Read as warmth expressed comfortably rather than energetically.'],
      ['Flat or low', 'Read as reserve, and a preference for a small circle rather than a wide one.'],
      ['Heavily lined', 'Traditionally read as many attachments and a busy emotional life.'],
      ['Smooth with few lines', 'Traditionally read as a settled, uncomplicated emotional pattern.']
    ],
    limits: 'The size of this mound is mostly the thenar muscle group, which varies with build, grip strength and manual work. Reading temperament from it is symbolic, and it cannot indicate anyone sexual history, appetite or fidelity, despite some sources implying exactly that.',
    faqs: [
      ['Where is the Mount of Venus on the hand?', 'It is the raised, fleshy area at the base of the thumb, bounded by the curve of the life line as it sweeps toward the wrist. It is normally the most prominent mound on the palm. If you make a light fist and release it, the muscle that flexes there is the thenar group, which is what gives the mount its shape.'],
      ['What does a large Mount of Venus mean?', 'Traditional palmistry reads a full, firm mount as warmth, physical energy and enjoyment of other people. It is worth knowing that mound size largely reflects the thenar muscle, which is affected by build, grip strength and manual work, so a labourer and a desk worker may differ for entirely ordinary reasons. Treat the reading as symbolic.'],
      ['What does a flat Mount of Venus mean?', 'It is traditionally read as reserve and a preference for a smaller social circle rather than a wide one. This is presented as a neutral description rather than a fault in classical palmistry, though some modern sources frame it negatively. A flat mount indicates nothing about capacity for affection, and muscle bulk is a poor proxy for warmth.'],
      ['Does the Mount of Venus indicate romantic history?', 'No. Some sources imply that the mount and the lines crossing it reveal relationships or fidelity, and that reading should be rejected. Nothing on a hand records a person past, their relationships or their behaviour. Where a source moves from describing temperament to making claims about someone private life, it has left even the folklore behind.'],
      ['Why is it called Venus?', 'Traditional palmistry assigns each mound a classical planet, and Venus was associated with affection, pleasure and physical vitality. The naming scheme comes from the same astrological framework that names the other mounts, which is why they map to Jupiter, Saturn, Apollo, Mercury, Mars and Luna. The names carry the symbolism rather than any connection to the planets themselves.']
    ]
  },
  'mount-of-jupiter': {
    h1: 'Mount of Jupiter in Palmistry', kw: 'Mount of Jupiter', title: 'Mount of Jupiter Palmistry',
    desc: 'Mount of Jupiter palmistry: the mound below the index finger, what raised and flat variations traditionally mean, and why it does not measure ambition.',
    answer: 'The Mount of Jupiter is the pad at the base of the index finger. Traditional palmistry reads it as confidence, leadership and the wish to be taken seriously. A raised mount is read as self-assurance and a flat one as modesty, though hand shape varies for structural reasons that have nothing to do with character.',
    where: 'Directly below the index finger, above the point where the life line and head line begin. Compare it with the pads under the other fingers rather than judging it alone.',
    variations: [
      ['Raised and well developed', 'Read as confidence and comfort taking responsibility.'],
      ['Flat', 'Read as modesty and a preference for contributing without leading.'],
      ['Overly prominent', 'Traditionally read as a caution about self-importance rather than as praise.'],
      ['Marked with a vertical line', 'Traditionally read as a clear ambition held over time.'],
      ['Marked with a cross', 'Traditionally read as a significant attachment, in some older sources.']
    ],
    limits: 'It cannot indicate leadership ability, career seniority or whether someone should manage people. Confidence is learned and situational, and the pad below your index finger has no bearing on it.',
    faqs: [
      ['Where is the Mount of Jupiter?', 'It is the raised pad directly beneath the index finger, sitting above where the head line and life line begin on the thumb side of the palm. The easiest way to assess it is by comparison: look at the pads beneath all four fingers together and notice which stands highest, rather than trying to judge one in isolation.'],
      ['What does a prominent Mount of Jupiter mean?', 'Traditional palmistry reads it as confidence and comfort with responsibility, sometimes described as a natural inclination to lead. Classical sources also caution that an unusually prominent mount can indicate self-importance, which is a useful reminder that the tradition itself does not treat bigger as better. It is a symbolic reading, not an assessment of ability.'],
      ['What does a flat Mount of Jupiter mean?', 'It is traditionally read as modesty and a preference for contributing without needing to lead. Classical palmistry presents this neutrally rather than as a shortfall. Some modern sources frame flat mounts as lacking something, which reflects the tone of the writer rather than the tradition. Nothing about the pad below your index finger limits what you can do.'],
      ['Does the Mount of Jupiter show leadership ability?', 'No. Leadership depends on experience, training, judgement and how someone treats people, none of which is recorded in hand structure. Traditional palmistry offers a symbolic association with confidence, and confidence itself is learned and situational rather than fixed. Making a decision about someone suitability to lead from a palm would be indefensible.'],
      ['What does a cross on the Mount of Jupiter mean?', 'Older palmistry sources read a cross here as a significant attachment or a meaningful partnership, and it is one of the more frequently cited mount markings. Marks of this kind are creases and skin folds that vary with hand use. The reading is folklore with a long history, offered as entertainment rather than as information about anyone relationships.']
    ]
  },
  'mount-of-saturn': {
    h1: 'Mount of Saturn in Palmistry', kw: 'Mount of Saturn', title: 'Mount of Saturn Palmistry',
    desc: 'Mount of Saturn palmistry: the mound below the middle finger, what raised and flat variations traditionally mean, and why it is usually the least developed.',
    answer: 'The Mount of Saturn sits at the base of the middle finger. Traditional palmistry reads it as seriousness, patience and a private, self-sufficient streak. It is normally the flattest of the four finger mounts, so a low Saturn mount is the usual case rather than an unusual one.',
    where: 'Directly below the middle finger, between the Jupiter mount under the index finger and the Apollo mount under the ring finger.',
    variations: [
      ['Slightly raised', 'Read as patience, steadiness and a willingness to work without applause.'],
      ['Flat, the usual case', 'Read as a balanced outlook rather than an absence of anything.'],
      ['Strongly raised', 'Traditionally read as a cautionary sign of withdrawal rather than as a strength.'],
      ['Vertical line present', 'Traditionally read as sustained study or long specialisation.'],
      ['Grille marking', 'Traditionally read as a period of overthinking rather than anything lasting.']
    ],
    limits: 'Saturn is the mount most often described in gloomy terms, and that framing is a stylistic habit rather than a tradition worth carrying forward. It cannot indicate depression, isolation or any state of mind, and reading it that way risks turning a hand into a diagnosis it can never make.',
    faqs: [
      ['Where is the Mount of Saturn?', 'It sits at the base of the middle finger, between the Jupiter mount below the index finger and the Apollo mount below the ring finger. It is usually the least prominent of the four, so if the area under your middle finger looks flat compared with its neighbours, that is the normal pattern rather than something to note.'],
      ['What does a flat Mount of Saturn mean?', 'It is the common case, and traditional palmistry treats it as balance rather than absence. Because the mount is naturally low in most hands, a flat Saturn tells you very little. Sources that read it as coldness or detachment are over-reading a structural feature that nearly everyone shares, which is a good example of a reading that cannot be distinguished from chance.'],
      ['What does a raised Mount of Saturn mean?', 'Traditional palmistry reads a moderately raised Saturn as patience and willingness to work without recognition. Classical sources treat a strongly raised mount as a caution about withdrawal rather than as a strength, which is unusual among the mounts and worth noting. As always this is symbolic description offered for reflection rather than assessment.'],
      ['Does the Mount of Saturn indicate depression?', 'No, and it must not be read that way. Palmistry cannot identify any mental health condition, and treating a hand feature as evidence of one is both wrong and potentially harmful. Saturn is often written about in gloomy language, which is a stylistic habit inherited from older texts. If low mood is a genuine concern, a GP is the right place to take it.'],
      ['Why is the Saturn mount described so negatively?', 'Older palmistry texts associated Saturn with limitation, duty and hardship, following the astrological symbolism of the period, and modern writing has largely copied that tone without questioning it. The inherited gloom says more about the history of the texts than about anybody hand, which is a reasonable reason to read the traditional description lightly.']
    ]
  },
  'mount-of-apollo': {
    h1: 'Mount of Apollo in Palmistry', kw: 'Mount of Apollo', title: 'Mount of Apollo Palmistry',
    desc: 'Mount of Apollo palmistry: the Sun mount below the ring finger, what raised and flat variations traditionally mean, and why it does not measure creative talent.',
    answer: 'The Mount of Apollo, also called the Mount of the Sun, sits at the base of the ring finger. Traditional palmistry reads it as appreciation of beauty, expressiveness and enjoyment of making things. It does not measure artistic talent, which comes from practice rather than from hand structure.',
    where: 'At the base of the ring finger, between the Saturn mount below the middle finger and the Mercury mount below the little finger. The sun line, where present, runs toward it.',
    variations: [
      ['Well developed', 'Read as an eye for beauty and pleasure in making or arranging things.'],
      ['Flat', 'Read as practicality, with appreciation of beauty expressed less visibly.'],
      ['Very prominent', 'Traditionally read as a caution about display rather than as talent.'],
      ['Single vertical line', 'Traditionally read as a focused creative interest.'],
      ['Several fine lines', 'Traditionally read as many interests rather than one pursued deeply.']
    ],
    limits: 'It cannot indicate artistic ability. Skill in any creative field comes from sustained practice, teaching and time, and none of that is visible in a hand. Reading talent from a mount would discourage exactly the people who would improve fastest by simply starting.',
    faqs: [
      ['Where is the Mount of Apollo on the palm?', 'At the base of the ring finger, sitting between the Saturn mount under the middle finger and the Mercury mount under the little finger. It is also called the Mount of the Sun. Where a sun line is present on the palm, it runs upward toward this mount, which is a useful way to confirm you are looking at the right area.'],
      ['What does a developed Mount of Apollo mean?', 'Traditional palmistry reads it as an eye for beauty and genuine pleasure in making or arranging things, whether that is art, cooking, music or how a room looks. It is one of the more warmly described mounts. Classical sources add a caution that an unusually prominent Apollo can suggest a taste for display, which is worth including for balance.'],
      ['Does the Mount of Apollo show artistic talent?', 'No. Ability in any creative field comes from practice, instruction and persistence, and none of that is recorded in the structure of a hand. This matters more than it might seem: telling someone their hand shows no artistic talent could discourage precisely the person who would improve fastest by simply beginning. Nothing in a palm should be allowed to do that.'],
      ['What does a flat Mount of Apollo mean?', 'Traditional palmistry reads it as a practical outlook, with appreciation of beauty present but expressed less visibly. It is not read as an absence of creativity in classical sources. As with all the mounts, size largely reflects hand structure and muscle, which vary between people for reasons entirely unconnected to temperament or interests.'],
      ['What is the difference between the Apollo mount and the sun line?', 'The mount is the fleshy pad at the base of the ring finger; the sun line is a vertical crease running up toward it. They share a name because the line terminates at the mount. Many hands have the mount and no line, since the sun line is frequently absent. The two are read as related but separate features.']
    ]
  },
  'mount-of-mercury': {
    h1: 'Mount of Mercury in Palmistry', kw: 'Mount of Mercury', title: 'Mount of Mercury Palmistry',
    desc: 'Mount of Mercury palmistry: the mound below the little finger, what raised and flat variations traditionally mean, and its link to the marriage and children lines.',
    answer: 'The Mount of Mercury sits at the base of the little finger. Traditional palmistry reads it as communication, quickness of mind and skill in negotiation or trade. The marriage lines and children lines are found on its outer edge, which is why this small area attracts a disproportionate amount of attention.',
    where: 'At the base of the little finger, the outermost of the four finger mounts. Its outer edge, on the side of the hand, carries the marriage and children lines.',
    variations: [
      ['Well developed', 'Read as ease with words, negotiation and reading a situation quickly.'],
      ['Flat', 'Read as a preference for showing rather than telling.'],
      ['Very prominent', 'Traditionally read as a caution about persuasiveness used carelessly.'],
      ['Vertical lines present', 'Traditionally read as an interest in helping or advising others.'],
      ['Marriage lines on the edge', 'Covered separately; these are read as attachments, not as predictions.']
    ],
    limits: 'It cannot indicate business ability, honesty or how well someone communicates. It is also the area where the least defensible palmistry claims cluster, because the marriage and children lines sit on its edge. Treat anything read from this region with particular care.',
    faqs: [
      ['Where is the Mount of Mercury?', 'At the base of the little finger, the outermost of the four pads beneath the fingers. Its outer edge continues around onto the side of the hand, and that edge is where the marriage lines and the fine children lines sit, which is why this small area of the palm receives more anxious attention than any other.'],
      ['What does a developed Mount of Mercury mean?', 'Traditional palmistry reads it as ease with words, quickness in reading a situation and skill in negotiation or trade. Some older sources connect it to commerce specifically. Classical texts also caution that a very prominent Mercury can indicate persuasiveness used carelessly, so the tradition itself does not treat prominence here as straightforwardly positive.'],
      ['Does the Mount of Mercury show business ability?', 'No. Commercial success depends on judgement, timing, capital, market conditions and a great deal of work. None of that is recorded in the pad below your little finger. Older palmistry associated Mercury with trade because of the classical symbolism attached to the planet, which is a naming convention rather than an observation about anyone commercial aptitude.'],
      ['Why do the marriage lines sit on the Mercury mount?', 'Traditional palmistry placed relationship markings on the outer edge of the Mercury mount, associating that region with connection and exchange. The placement is a convention of the tradition rather than a finding. It matters practically because it means the most searched and least supportable claims in palmistry all cluster in one small area of the hand.'],
      ['What do vertical lines on the Mount of Mercury mean?', 'Traditional readers describe fine vertical lines here as an interest in helping or advising others, and some older sources connect them to healing or medicine specifically. These are sometimes called the medical stigmata. The name sounds authoritative and is not: it is folklore, and it indicates nothing about aptitude for healthcare or anything else.']
    ]
  },
  'mount-of-mars': {
    h1: 'Mounts of Mars in Palmistry', kw: 'Mount of Mars', title: 'Mount of Mars Palmistry',
    desc: 'Mount of Mars palmistry: the two Mars mounts and the plain between them, what each traditionally means, and the limits of reading temperament from a palm.',
    answer: 'Palmistry describes two Mars mounts and a plain between them. Lower Mars sits above the thumb inside the life line and is read as physical courage. Upper Mars sits below the little finger side and is read as endurance. The Plain of Mars is the hollow at the centre of the palm.',
    where: 'Lower Mars sits between the thumb and the start of the life line. Upper Mars sits on the opposite edge, below the Mercury mount and above the Luna mount. The plain is the dip in the middle of the palm.',
    variations: [
      ['Lower Mars developed', 'Read as physical courage and a willingness to act under pressure.'],
      ['Upper Mars developed', 'Read as endurance and the ability to keep going once started.'],
      ['Both flat', 'Read as a preference for avoiding conflict rather than as timidity.'],
      ['Deep Plain of Mars', 'Traditionally read as a considered temperament that does not react quickly.'],
      ['Shallow Plain of Mars', 'Traditionally read as responsiveness and a quick reaction to circumstance.']
    ],
    limits: 'Mars is the only mount split across two locations, and traditions disagree about which is which. It cannot indicate aggression, temper or how someone behaves under stress, and reading a hand for signs of violence would be both baseless and unjust.',
    faqs: [
      ['Why are there two Mounts of Mars?', 'Traditional palmistry divides the Mars symbolism between two areas: Lower Mars, sometimes called Mars Positive, above the thumb inside the life line, and Upper Mars, or Mars Negative, on the opposite edge below the Mercury mount. The hollow between them is the Plain of Mars. Sources disagree about the naming, which is a fair indication of how settled this part of the tradition is.'],
      ['Where is the Plain of Mars?', 'It is the hollow at the centre of the palm, bounded by the mounts around its edges. Traditional readers assess its depth, describing a deep plain as a considered temperament and a shallow one as quick responsiveness. Palm depth at the centre is largely a matter of hand structure and muscle distribution rather than anything about temperament.'],
      ['What does a developed Lower Mars mean?', 'Traditional palmistry reads it as physical courage and a willingness to act under pressure. It sits in the area between the thumb and the beginning of the life line. As with every mount, prominence here reflects the muscle and structure of the hand, which varies with build and with manual work, so the symbolic reading should be held lightly.'],
      ['Does the Mount of Mars show aggression or temper?', 'No, and this reading should be rejected firmly. Nothing on a hand can indicate how someone behaves under stress, whether they are prone to anger, or whether they might be violent. Using a palm feature to form a judgement about a person temperament would be baseless and unjust, and it is exactly the kind of claim palmistry should not be making.'],
      ['What does a flat Mars mount mean?', 'Traditional palmistry reads flat Mars mounts as a preference for avoiding conflict rather than an inability to handle it, which is a meaningfully different framing from timidity. Some modern sources use harsher language. The classical reading is the more measured one, and given that neither has evidence behind it, the kinder and more accurate description is the better one to carry forward.']
    ]
  },
  'mount-of-moon': {
    h1: 'Mount of Moon in Palmistry', kw: 'Mount of Moon', title: 'Mount of Moon Palmistry',
    desc: 'Mount of Moon palmistry: the Luna mount at the base of the palm, what full and flat variations traditionally mean, and its traditional link with imagination and travel.',
    answer: 'The Mount of Moon, also called Luna, is the mound at the base of the palm on the little-finger side, opposite the thumb. Traditional palmistry reads it as imagination, receptiveness and an attraction to travel or water. It sits opposite Venus, and traditional readings often compare the two.',
    where: 'On the outer edge of the palm toward the wrist, opposite the Mount of Venus at the thumb base. It is often the second most prominent mound on the hand.',
    variations: [
      ['Full and rounded', 'Read as a strong imagination and responsiveness to atmosphere.'],
      ['Flat', 'Read as a preference for the concrete over the speculative.'],
      ['Very prominent', 'Traditionally read as a caution about escapism rather than as creativity.'],
      ['Marked with horizontal lines', 'Traditionally called travel lines and read as journeys or a pull toward moving.'],
      ['Crossed by the head line ending here', 'Traditionally read as thinking that runs on imagination.']
    ],
    limits: 'The travel lines on this mount cannot indicate journeys taken or planned, despite being widely presented that way. Nothing on a hand records where someone has been or will go. The imagination reading is a broad description that fits most people, which is part of why it lands.',
    faqs: [
      ['Where is the Mount of Moon on the hand?', 'It is the mound at the base of the palm on the little-finger side, sitting opposite the Mount of Venus at the base of the thumb and above the wrist. It is often the second most prominent mound on the hand after Venus. The two are frequently compared in traditional readings, since they sit at opposite corners of the palm.'],
      ['What does a full Mount of Moon mean?', 'Traditional palmistry reads it as strong imagination and responsiveness to atmosphere, with some sources connecting it to an attraction toward water or travel. Classical texts add a caution that a very prominent Luna can suggest escapism, which is a useful counterweight to the more flattering modern versions of the reading.'],
      ['What are travel lines on the Mount of Moon?', 'They are horizontal lines running in from the outer edge of the mount, traditionally read as journeys taken or a pull toward moving. They cannot indicate travel. Nothing in a hand crease records where someone has been or is going, and the reading persists mainly because it is pleasant and easy to make sound specific.'],
      ['What does a flat Mount of Moon mean?', 'It is traditionally read as a preference for the concrete over the speculative, and a tendency to work from what is in front of you rather than from possibility. Classical palmistry presents this neutrally. As with all the mounts, prominence reflects hand structure rather than temperament, so the description is symbolic in both directions.'],
      ['How is the Mount of Moon read against the Mount of Venus?', 'Traditional palmistry treats them as a pair sitting at opposite corners of the palm: Venus for warmth and physical vitality, Luna for imagination and receptiveness. A reader might compare which is more developed and describe the balance between the two. It is one of the more coherent ideas in the tradition, and still a symbolic one.']
    ]
  }
};

const SHAPES = {
  'earth-hand': {
    h1: 'Earth Hand in Palmistry', kw: 'earth hand', title: 'Earth Hand Palmistry',
    desc: 'Earth hand palmistry: square palm with short fingers, what the shape traditionally means, how to identify it, and why hand shape does not determine personality.',
    answer: 'An earth hand has a square palm with short fingers, and usually few but deeply marked lines. Traditional palmistry reads it as practicality, steadiness and a preference for tangible work. Hand proportion is inherited and structural, so the personality reading is symbolic rather than a description of anyone character.',
    identify: 'Measure the palm from wrist crease to the base of the fingers, then compare with the length of the middle finger. On an earth hand the palm is roughly square, as wide as it is long, and the fingers are noticeably shorter than the palm height. The skin is often firmer and the lines fewer and deeper.',
    reads: [
      ['Traditional reading', 'Practicality, reliability and a preference for work with a visible result. Traditional sources connect it to building, growing and making.'],
      ['How the lines usually appear', 'Fewer lines, more deeply marked. This is a structural feature of firmer skin rather than a sign of a simpler inner life, though some sources unhelpfully imply the latter.'],
      ['The honest limit', 'Hand proportion is inherited. It correlates with nothing about interests, aptitude or temperament, and describing someone as a practical type from their hand shape says more about the reader than the person.']
    ],
    faqs: [
      ['How do I know if I have an earth hand?', 'Compare the height of your palm, wrist crease to finger base, with the length of your middle finger. An earth hand has a palm that is roughly square, about as wide as it is tall, with fingers noticeably shorter than the palm height. The skin often feels firmer and the palm typically shows fewer lines, marked more deeply than on other hand types.'],
      ['What does an earth hand say about personality?', 'Traditional palmistry reads it as practicality, steadiness and a preference for work with a tangible result. That description is broad enough to fit a great many people. Hand proportion is inherited and structural, so any personality reading drawn from it is symbolic. It cannot indicate what someone is good at or what they should do.'],
      ['Why do earth hands have fewer lines?', 'Firmer, thicker skin tends to crease less finely, which is a straightforward physical explanation. Some sources present fewer lines as indicating a simpler or less complicated nature, and that reading is both unsupported and rather insulting. Line density reflects skin type and hand use rather than anything about the person inner life.'],
      ['Can hand shape change over time?', 'The underlying proportion of palm to fingers is set by bone structure and does not change after growth finishes. Skin, flexibility and line depth do change with age and use. This is worth knowing because it means the hand shape classification is fixed, unlike the lines, which some palmists re-read over a lifetime.'],
      ['What is the difference between an earth hand and a fire hand?', 'Both have a distinctive palm-to-finger ratio but in different directions. An earth hand has a square palm with short fingers. A fire hand has a longer, rectangular palm with short fingers. The palm shape is the deciding feature: square points to earth, oblong points to fire, with the finger length short in both cases.']
    ]
  },
  'air-hand': {
    h1: 'Air Hand in Palmistry', kw: 'air hand', title: 'Air Hand Palmistry',
    desc: 'Air hand palmistry: square palm with long fingers, how to identify the shape, what it traditionally means, and the limits of reading character from proportion.',
    answer: 'An air hand has a square palm with long fingers and often many fine lines. Traditional palmistry reads it as curiosity, analysis and a need to talk things through. As with every hand shape, the proportion is inherited, so the reading is a symbolic description rather than an assessment of how anyone thinks.',
    identify: 'The palm is roughly square, as on an earth hand, but the fingers are long, close to or exceeding the palm height. The skin is often finer and the palm carries more lines, frequently light ones.',
    reads: [
      ['Traditional reading', 'Curiosity, communication and a tendency to understand something by explaining it. Traditional sources connect it to writing, teaching and analysis.'],
      ['How the lines usually appear', 'More numerous and finer. Thinner skin creases more readily, which is the practical explanation for a feature often read as a busy mind.'],
      ['The honest limit', 'Finger length is determined before birth by bone growth. It does not correlate with intelligence, verbal ability or curiosity, and any source implying it does is overreaching considerably.']
    ],
    faqs: [
      ['How do I identify an air hand?', 'Look for a palm that is roughly square, about as wide as it is tall, combined with long fingers that approach or exceed the height of the palm. Air hands often show more lines than earth hands, and those lines are typically finer. If your palm is square but your fingers are clearly short, that is an earth hand rather than an air hand.'],
      ['What does an air hand mean in palmistry?', 'Traditional palmistry reads it as curiosity, communication and a tendency to think out loud, with older sources connecting it to writing and teaching. It is a flattering description and a broad one, which is worth noting when it feels accurate. Finger length is set by bone growth before birth and reflects nothing about how a person thinks.'],
      ['Do air hands mean high intelligence?', 'No. There is no relationship between finger length, palm shape and cognitive ability, and sources implying otherwise are making a claim with nothing behind it. Traditional palmistry describes a style of engaging with ideas rather than a level of ability, and even that is symbolic. Nothing in a hand can assess intelligence, education or capability.'],
      ['Why do air hands have so many lines?', 'Finer skin creases more readily than thick skin, which is the practical explanation. Palmistry reads numerous fine lines as a busy or active mind, and while that is an appealing interpretation, skin type accounts for the observation without needing it. Hand use, hydration and age all affect how finely a palm creases.'],
      ['What is the difference between an air hand and a water hand?', 'Both types have long fingers, so the palm decides it. An air hand has a square palm; a water hand has a longer, oval or rectangular palm. Look at the palm outline first and the fingers second, since palm shape is the primary distinction across all four types and finger length is the secondary one.']
    ]
  },
  'fire-hand': {
    h1: 'Fire Hand in Palmistry', kw: 'fire hand', title: 'Fire Hand Palmistry',
    desc: 'Fire hand palmistry: rectangular palm with short fingers, how to identify it, what the shape traditionally means, and why the reading is symbolic.',
    answer: 'A fire hand has a longer, rectangular palm with short fingers, and usually clear well-marked lines. Traditional palmistry reads it as energy, enthusiasm and a preference for acting rather than deliberating. Hand proportion is inherited and structural, so treat the reading as symbolic description rather than measurement.',
    identify: 'The palm is noticeably longer than it is wide, giving an oblong rather than square outline, while the fingers remain short relative to the palm height. The lines are usually clear and well defined.',
    reads: [
      ['Traditional reading', 'Energy, enthusiasm and momentum, with a preference for starting and for visible progress. Older sources connect it to leadership and enterprise.'],
      ['How the lines usually appear', 'Clear and well marked rather than either very fine or very sparse, sitting between the earth and air patterns.'],
      ['The honest limit', 'The palm-to-finger ratio is fixed by bone growth and inherited. It says nothing about energy levels, drive, or whether someone acts quickly, all of which vary with health, sleep, circumstance and mood.']
    ],
    faqs: [
      ['How do I know if I have a fire hand?', 'Look at the outline of the palm alone, ignoring the fingers. If it is clearly longer than it is wide, forming an oblong rather than a square, and the fingers are short relative to the palm height, that is a fire hand. If the palm is oblong but the fingers are long, that is a water hand instead.'],
      ['What does a fire hand mean in palmistry?', 'Traditional palmistry reads it as energy, enthusiasm and a preference for acting rather than deliberating, with older sources connecting it to enterprise and leadership. The description is broad and flattering, which is worth bearing in mind. Palm proportion is inherited and cannot indicate anyone energy or drive, both of which vary daily.'],
      ['Are fire hands common?', 'No reliable figures exist for the distribution of the four hand types across a population, and any site quoting percentages has invented them. The four-type system is also applied inconsistently between traditions, with some sources using different measurement thresholds, so even a careful count would depend heavily on which definition was used.'],
      ['Does a fire hand mean someone is impulsive?', 'No. Traditional palmistry describes a preference for action over deliberation, which is a gentler framing than impulsiveness and is the more accurate rendering of the classical reading. How someone actually makes decisions depends on experience, stakes, tiredness and temperament, and none of it is recorded in the proportions of a hand.'],
      ['What is the difference between a fire hand and an earth hand?', 'Both have short fingers, so the palm shape decides it. An earth hand has a square palm, roughly as wide as it is tall. A fire hand has an oblong palm, clearly longer than it is wide. Measuring rather than eyeballing helps here, since the difference is often less obvious than descriptions suggest.']
    ]
  },
  'water-hand': {
    h1: 'Water Hand in Palmistry', kw: 'water hand', title: 'Water Hand Palmistry',
    desc: 'Water hand palmistry: long oval palm with long fingers, how to identify the shape, what it traditionally means, and why the sensitivity reading is symbolic.',
    answer: 'A water hand has a long, oval palm with long fingers, and typically many fine lines. Traditional palmistry reads it as sensitivity, receptiveness and an emotionally attuned nature. The proportion is inherited and structural, so the reading describes a symbolic type rather than a real assessment of anyone temperament.',
    identify: 'The palm is longer than it is wide, often oval rather than strictly rectangular, and the fingers are long, frequently exceeding the palm height. The skin tends to be finer and the palm carries many light lines.',
    reads: [
      ['Traditional reading', 'Sensitivity, receptiveness and attention to mood and atmosphere. Older sources connect it to caring work and to the arts.'],
      ['How the lines usually appear', 'Numerous and fine, sometimes with a network of very light creases. Thin skin explains this without needing an emotional interpretation.'],
      ['The honest limit', 'Sensitivity is a real and valuable trait, and it is not written into hand proportion. Describing someone as sensitive from their hand risks flattering or wounding on no basis at all, which is a reason to hold this reading particularly lightly.']
    ],
    faqs: [
      ['How do I identify a water hand?', 'Look for a palm that is longer than it is wide, often with an oval rather than a strictly rectangular outline, combined with long fingers that frequently exceed the palm height. Water hands typically show many fine lines. If the palm is long but the fingers are short, that is a fire hand rather than a water hand.'],
      ['What does a water hand mean in palmistry?', 'Traditional palmistry reads it as sensitivity, receptiveness and attention to mood, with older sources connecting it to caring work and to the arts. It is among the more flattering readings in the system, which is worth noticing. Hand proportion is inherited before birth and reflects nothing about emotional temperament.'],
      ['Does a water hand mean someone is emotional?', 'Traditional palmistry describes attunement to mood and atmosphere, which is different from being emotional in the sense the question usually implies. It is worth separating the two, because reading a hand as evidence that someone is oversensitive would be both baseless and unkind. Sensitivity is real, valuable, and not visible in hand proportion.'],
      ['Why do water hands have so many fine lines?', 'Thinner, more flexible skin creases more readily and in finer patterns, which explains the observation without needing an emotional interpretation. Palmistry reads a network of light lines as emotional complexity. Skin type, hydration, age and hand use account for line density perfectly well on their own.'],
      ['What is the difference between a water hand and an air hand?', 'Both have long fingers, so the palm outline is what distinguishes them. A water hand has a long, often oval palm. An air hand has a square palm, roughly as wide as it is tall. Measuring the palm from the wrist crease to the finger base and comparing with its width is the clearest way to decide.']
    ]
  }
};

module.exports = { MOUNTS, SHAPES };
