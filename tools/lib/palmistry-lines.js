/* Palmistry dataset — lines.
   Written per entity, not templated. Each line has its own location, its own
   variation set and its own limits section, because that is what keeps the
   pages distinct enough to index. */

const LINES = {
  'heart-line': {
    h1: 'Heart Line in Palmistry',
    kw: 'heart line',
    title: 'Heart Line Palmistry',
    desc: 'Heart line palmistry: where the line sits, what curved, straight, forked and broken variations traditionally mean, and what a palm cannot tell you about love.',
    answer: 'The heart line is the uppermost horizontal line on the palm, running below the fingers from the edge under the little finger toward the index or middle finger. Traditional palmistry reads it as emotional style: how openly a person shows affection and what they need to feel secure. It reflects nothing measurable and predicts no relationship.',
    where: 'Open your hand flat and find the topmost horizontal crease beneath the fingers. It normally begins at the outer edge below the little finger and travels across toward the index or middle finger. It is usually the easiest of the three major lines to trace, which is why classical readers start with it.',
    variations: [
      ['Long, reaching under the index finger', 'Read as idealism about love and a clear picture of what a relationship should feel like.'],
      ['Ending under the middle finger', 'Read as a more self-directed emotional style, with needs stated plainly rather than hinted at.'],
      ['Curved upward', 'Read as warmth that shows outwardly, and feelings expressed quickly rather than held.'],
      ['Straight and level', 'Read as emotional steadiness and a preference for being shown affection rather than told.'],
      ['Forked at the end', 'Read as balance between feeling and practicality, not as confusion or division.'],
      ['Broken or chained', 'Traditionally linked to periods of emotional change. It marks nothing about a specific relationship, past or future.'],
      ['Faint or barely visible', 'Some hands simply have finer creases overall. Read the whole hand rather than one line in isolation.']
    ],
    limits: 'A heart line cannot tell you whether a relationship will last, whether someone loves you, or whether you will marry. Creases in the palm form before birth and change with age and use, and no study has connected their shape to relationship outcomes. Treat a reading as a prompt for thinking about how you handle closeness, and nothing more than that.',
    faqs: [
      ['Where is the heart line on the palm?', 'It is the topmost horizontal line, sitting just below the base of the fingers. Trace it from the outer edge of the palm under the little finger across toward the index or middle finger. It sits above the head line, which runs roughly parallel to it lower down. If you are unsure which of two upper lines you are looking at, the heart line is the one closer to the fingers.'],
      ['What does a long heart line mean?', 'Traditional palmistry reads a heart line reaching across to below the index finger as idealism about love and a clear sense of what a relationship ought to feel like. Some readers add that it suggests generosity with affection. These are symbolic descriptions rather than findings, and a long line says nothing about how many relationships a person will have or how they will turn out.'],
      ['What does a broken heart line mean?', 'It is traditionally associated with periods of emotional change rather than with heartbreak in a specific relationship. Palm creases are affected by age, hand use, weight change and skin condition, so a break is a physical feature with an unremarkable explanation. No reading of a break can identify an event, a person or a date, and any source claiming to time a breakup from a palm line has invented that precision.'],
      ['Is the heart line the same as the love line?', 'Yes. The two names describe the same crease, and different traditions favour different terms. Indian palmistry also calls it the hriday rekha. The multiple names are a reminder that palmistry is a set of overlapping oral traditions rather than one system, which is also why interpretations of the same line differ noticeably between sources.'],
      ['Which hand should I read the heart line on?', 'Most modern palmists read the dominant hand for current patterns and the non-dominant hand for what they describe as inherited tendencies. This is a convention rather than a rule, and traditions disagree about it. Since the whole framework is symbolic, the useful approach is to look at both, notice where they differ, and treat that difference as something to think about rather than something proved.'],
      ['Can the heart line predict marriage?', 'No. The heart line describes emotional style in the traditional reading, and it is the marriage line, a separate and much smaller crease below the little finger, that folklore associates with partnership. Neither can predict a marriage. Serious hand analysts describe the marriage-prediction claim as one of the least supportable ideas in palmistry, and we agree with them.']
    ]
  },

  'head-line': {
    h1: 'Head Line in Palmistry',
    kw: 'head line',
    title: 'Head Line Palmistry',
    desc: 'Head line palmistry: where to find it, what long, short, straight, sloping and forked variations traditionally mean, and the limits of reading thinking style from a crease.',
    answer: 'The head line runs horizontally across the middle of the palm, below the heart line, usually beginning near the edge between thumb and index finger. Traditional palmistry reads it as thinking style: whether someone reasons in straight lines or associatively, and how long they dwell on a problem. It measures no ability and predicts nothing.',
    where: 'Look for the middle of the three major horizontal creases. It typically starts on the thumb side, between the base of the index finger and the thumb, and travels across the palm. In some hands it begins joined to the life line and separates further along, which traditional readers treat as its own variation.',
    variations: [
      ['Long, crossing most of the palm', 'Read as thorough thinking and a tendency to turn a question over before answering.'],
      ['Short', 'Read as decisive, practical thinking that prefers to act rather than deliberate.'],
      ['Straight', 'Read as literal, structured reasoning that works in sequence.'],
      ['Sloping toward the wrist', 'Read as associative and imaginative thinking that arrives sideways rather than in a line.'],
      ['Joined to the life line at the start', 'Traditionally read as caution and a considered approach to independence.'],
      ['Separated from the life line', 'Traditionally read as early self-reliance and comfort acting alone.'],
      ['Forked at the end, the writer fork', 'Read as the ability to hold a practical view and an imaginative one at once.']
    ],
    limits: 'The head line has nothing to do with intelligence, and any source implying otherwise should be disregarded. It cannot indicate academic ability, mental health, memory, or a learning difficulty. Palm creases form in the womb around the third month of gestation and are shaped by hand movement, not by cognition. Read it as a description of preferred thinking style offered for reflection.',
    faqs: [
      ['Where is the head line on the palm?', 'It is the middle of the three main horizontal lines, sitting below the heart line and above the life line. It usually starts on the thumb side of the palm, somewhere between the base of the index finger and the top of the thumb, then runs across toward the outer edge. If two lines start close together near the thumb, the head line is the upper one and the life line curves down around the thumb.'],
      ['Does the head line show intelligence?', 'No. There is no relationship between palm creases and cognitive ability, and any site suggesting a short head line means limited intelligence is making a claim with nothing behind it. In traditional palmistry the line describes a preferred style of thinking rather than a level of it, and even that is symbolic. Nothing about a palm can assess ability, education or capability.'],
      ['What does a sloping head line mean?', 'A head line curving down toward the wrist is traditionally read as imaginative, associative thinking that reaches conclusions by connection rather than by sequence. A straighter line is read as literal and structured. Neither is presented as better in classical palmistry, and both descriptions are broad enough to feel recognisable to most people, which is worth keeping in mind when a reading feels accurate.'],
      ['What does it mean if the head line and life line are joined?', 'Where the two lines begin joined and separate further along, traditional readers describe caution and a considered approach to independence. Where they start apart, the reading is early self-reliance. This is one of the more commonly cited variations, and like the rest it is a symbolic description rather than a finding about someone upbringing or character.'],
      ['What is the writer fork on the head line?', 'It is a split at the end of the head line, with one branch continuing straight and the other sloping down. Traditional palmistry reads it as the ability to hold a practical view and an imaginative one at the same time, and some sources associate it with writing or storytelling. The name is a later addition rather than a classical term, and it carries no more weight than any other variation.'],
      ['Can the head line indicate a head injury or illness?', 'No, and it should never be read that way. Palm creases cannot indicate any medical condition, past or future, and a break, island or cross on a head line is a physical feature of skin rather than a health signal. If a genuine health concern lies behind the question, that belongs with a doctor. Reading a medical meaning into a palm line risks real harm.']
    ]
  },

  'life-line': {
    h1: 'Life Line in Palmistry',
    kw: 'life line',
    title: 'Life Line Palmistry',
    desc: 'Life line palmistry: where the line runs, what long, short, deep, faint and broken variations traditionally mean, and why it does not predict lifespan.',
    answer: 'The life line curves around the base of the thumb, beginning between thumb and index finger and arcing down toward the wrist. Traditional palmistry reads it as vitality, energy and how someone engages with the world. It does not indicate how long a person will live, and no evidence connects its length to lifespan.',
    where: 'Place your hand flat and find the curved crease that wraps around the ball of the thumb. It starts on the edge between the thumb and index finger and sweeps down toward the wrist. It is often the deepest line on the hand, which is one reason it draws the most attention and the most anxiety.',
    variations: [
      ['Long and sweeping wide', 'Read as steady energy and an outward, engaged approach to life.'],
      ['Short', 'Read in traditional palmistry as energy directed intensely rather than broadly. It says nothing about lifespan.'],
      ['Deep and clear', 'Read as physical resilience and a settled routine.'],
      ['Faint', 'Read as a preference for pacing rather than pushing. Some hands simply have fine creases throughout.'],
      ['Broken, with the line resuming', 'Traditionally read as a change of circumstance or direction, not as an event or an illness.'],
      ['Doubled, with a second line inside it', 'Sometimes called a sister line, traditionally read as extra support or resilience.'],
      ['Chained in places', 'Traditionally read as a period of divided attention rather than anything about health.']
    ],
    limits: 'The life line does not predict lifespan, and this is the single most damaging myth in palmistry. A short life line means nothing about how long you will live. A break means nothing about illness or accident. Palm creases form before birth and are shaped by how the hand folds, and they change gradually with age and use. If a reading somewhere has caused you worry about your health or how long you have, please set it aside; a doctor is the only useful source for that question.',
    faqs: [
      ['Does a short life line mean a short life?', 'No. This is the most persistent myth in palmistry and it is false. No study has connected the length of the life line to lifespan, and the line reflects how the hand folds rather than anything biological about longevity. Traditional palmistry itself reads a short line as energy focused intensely rather than as a shortened life. If a reading has caused worry about this, please disregard it entirely.'],
      ['Where is the life line on the palm?', 'It is the curved line wrapping around the ball of the thumb. Find the point on the edge of your palm between the thumb and index finger, then follow the crease that arcs downward around the thumb mound toward the wrist. It is usually the most deeply marked line on the hand, and it should not be confused with the fate line, which runs vertically up the centre of the palm.'],
      ['What does a break in the life line mean?', 'Traditional palmistry reads a break as a change of circumstance or direction, such as a move, a career shift or a change in how someone lives. It does not indicate illness, accident or death, and sources presenting it that way are causing unnecessary alarm. Breaks are common, most people have some irregularity somewhere on the line, and the skin changes over a lifetime.'],
      ['What is a double life line?', 'Some hands show a second fainter line running inside the life line, sometimes called a sister line or a line of Mars. Traditional readers describe it as additional support, resilience or a protective influence. It is a fairly common feature rather than a rare one, and like every other variation it is a symbolic reading rather than a measurement of anything.'],
      ['Can the life line change over time?', 'The palm creases do change gradually with age, weight, hand use and skin condition, which is worth knowing because it undercuts the idea of a fixed destiny written at birth. Some palmists treat the change as meaningful and re-read hands periodically. Others treat it as simple skin ageing. There is no way to distinguish between those two positions using evidence.'],
      ['Which hand shows the true life line?', 'Convention says the dominant hand shows current life and active choices while the non-dominant hand shows inherited tendencies, though traditions disagree and some reverse it. Because the framework is symbolic, no hand is more true than the other. Comparing the two and noticing differences is more interesting than trying to identify which one is authoritative.']
    ]
  },

  'fate-line': {
    h1: 'Fate Line in Palmistry',
    kw: 'fate line',
    title: 'Fate Line Palmistry',
    desc: 'Fate line palmistry: where the career line runs, what a strong, faint, broken or absent fate line traditionally means, and why many hands have none at all.',
    answer: 'The fate line runs vertically up the centre of the palm, typically from near the wrist toward the base of the middle finger. Traditional palmistry reads it as the sense of direction in work and life, and how much that direction feels chosen. Many hands show no fate line at all, which is common and carries no negative meaning.',
    where: 'Look for a vertical line running up the middle of the palm, roughly from the wrist toward the base of the middle finger. Unlike the three major lines it is often faint, fragmented, or missing entirely. Some hands show it starting partway up rather than at the wrist.',
    variations: [
      ['Deep and unbroken', 'Read as a strong sense of direction, often felt early.'],
      ['Starting partway up the palm', 'Read as direction that arrived later, after a period of trying things.'],
      ['Broken and restarting', 'Read as a change of course rather than a setback.'],
      ['Absent entirely', 'Common and unremarkable. Traditionally read as a life shaped by choice rather than by a settled path.'],
      ['Starting at the life line', 'Read as direction shaped by family or early circumstances.'],
      ['Starting at the outer edge', 'Read as direction shaped by other people, public work or chance meetings.'],
      ['Ending at the head line', 'Traditionally read as a decision point rather than an ending.']
    ],
    limits: 'The fate line is also sold as the money line, and that framing is worth resisting. It cannot indicate income, career success, a suitable profession or whether a business will work. Nothing in a palm can. It is also the line most often absent altogether, which alone should settle how much weight to give it. Treat it as a prompt about how directed you currently feel, not as a forecast.',
    faqs: [
      ['What does it mean if I have no fate line?', 'It is common and it means nothing bad. A substantial proportion of hands show no clear fate line, and traditional palmistry reads its absence as a life shaped by ongoing choice rather than a single settled path. Some readers frame that positively as flexibility. What it certainly does not indicate is a lack of purpose, direction or prospects, and any source suggesting otherwise is stating an opinion.'],
      ['Is the fate line the same as the money line?', 'Some sites market it that way, and the framing should be treated with caution. The traditional reading concerns a sense of direction and vocation rather than income, and renaming it the money line usually precedes an offer to sell a reading. No line on a hand can indicate earnings, wealth or financial outcome, and treating one as though it can is how people end up paying for reassurance.'],
      ['Where does the fate line start and end?', 'Most commonly it runs from near the wrist up the centre of the palm toward the base of the middle finger, though it frequently starts partway up instead. Traditional readers give different meanings to different starting points: at the life line suggests family influence, at the outer edge suggests influence from other people. These are conventions rather than rules and sources disagree about them.'],
      ['What does a broken fate line mean?', 'Traditional palmistry reads a break as a change of direction rather than a failure, with the line resuming where a new course begins. Given how many people change career, location or circumstances several times, this reading applies to almost everyone, which is part of why it feels accurate. It carries no information about whether a particular change will go well.'],
      ['Can the fate line tell me what career to choose?', 'No. Career choice depends on skills, interests, opportunity, training and circumstances, none of which is recorded in a palm crease. Traditional palmistry offers only broad symbolic themes here, and treating those as career guidance would be a poor way to make a significant decision. If the question is genuine, careers advice, work experience and talking to people in the field will serve you far better.'],
      ['Does the fate line appear later in life?', 'Palm creases do change gradually with age and hand use, and some people report a fate line becoming more visible over time. Palmists who work with this describe it as direction becoming clearer. A sceptical reading is that skin and creases simply deepen with use. There is no way to distinguish the two, which is a fair summary of palmistry generally.']
    ]
  },

  'sun-line': {
    h1: 'Sun Line in Palmistry',
    kw: 'sun line',
    title: 'Sun Line Palmistry',
    desc: 'Sun line palmistry: also called the Apollo line, where it runs, what its presence, absence and variations traditionally mean, and why it does not indicate fame.',
    answer: 'The sun line, also called the Apollo line, runs vertically up the palm toward the base of the ring finger, usually in the upper half. Traditional palmistry reads it as satisfaction in what someone does and the visibility of their work. It is frequently absent, and its absence indicates nothing about success or recognition.',
    where: 'Look in the upper portion of the palm for a short vertical line running toward the base of the ring finger, sitting to the little-finger side of the fate line. It is usually shorter and fainter than the fate line, and often appears only in the upper third of the palm.',
    variations: [
      ['Clear and running some distance', 'Read as work that feels satisfying and is noticed by others.'],
      ['Short, near the finger base only', 'Read as recognition arriving later or in a narrower circle.'],
      ['Absent', 'Very common. Traditionally read as satisfaction found privately rather than publicly.'],
      ['Multiple faint lines', 'Traditionally read as several interests rather than one focus.'],
      ['Crossed by a small line', 'Traditionally read as a period where recognition felt interrupted.'],
      ['Starting low on the palm', 'Traditionally read as a creative interest present from early on.']
    ],
    limits: 'The sun line is sometimes sold as the fame line or the success line. It indicates neither. It cannot show whether someone will become well known, whether creative work will sell, or whether a career will be recognised. Its frequent absence in the hands of visibly successful people is a straightforward argument against the claim. Read it, if at all, as a prompt about whether current work feels satisfying.',
    faqs: [
      ['Where is the sun line on the palm?', 'It runs vertically in the upper part of the palm toward the base of the ring finger, positioned on the little-finger side of the fate line. It is typically shorter and lighter than the major lines and often appears only in the top third of the hand. If you cannot find one, that is normal; a large proportion of hands show no sun line at all.'],
      ['Does the sun line mean fame?', 'No. It is marketed as the fame line or success line on some sites, and that framing does not survive scrutiny. Plenty of well-known people have no sun line and plenty of people with a clear one live entirely private lives. Traditional palmistry describes it as satisfaction in work rather than public recognition, and even that is a symbolic reading offered for reflection.'],
      ['What does it mean to have no sun line?', 'It is common and unremarkable. Traditional palmistry reads its absence as satisfaction found privately rather than through visible recognition, which is a neutral description rather than a deficiency. A missing sun line says nothing about talent, prospects, creativity or whether work will be appreciated. Sources that treat its absence as a problem usually have a reading to sell.'],
      ['What is the difference between the sun line and the fate line?', 'The fate line runs toward the base of the middle finger and is traditionally read as direction and vocation. The sun line runs toward the base of the ring finger and is read as satisfaction and visibility in that work. They sit close together and are easily confused. The simplest way to tell them apart is which finger each points toward.'],
      ['What do several sun lines mean?', 'Traditional readers describe multiple faint vertical lines below the ring finger as several interests pulling in different directions rather than one clear focus. Some frame this positively as versatility and others as scatter, which is a good illustration of how the same feature is read differently depending on the source and the tone the reader prefers.'],
      ['Is the sun line also called the Apollo line?', 'Yes. The names are interchangeable, with Apollo referring to the mount below the ring finger where the line terminates. Some traditions also call it the line of success or the line of brilliance. The proliferation of names reflects palmistry being a collection of oral traditions rather than one codified system, which is also why interpretations vary so widely.']
    ]
  },

  'marriage-line': {
    h1: 'Marriage Line in Palmistry',
    kw: 'marriage line',
    title: 'Marriage Line Palmistry',
    desc: 'Marriage line palmistry: where the relationship lines sit, what one, two or no lines traditionally mean, and an honest answer on whether a palm can predict marriage.',
    answer: 'The marriage lines, also called relationship lines, are short horizontal creases on the outer edge of the palm between the base of the little finger and the top of the heart line. Traditional palmistry reads them as significant attachments. They cannot predict marriage, divorce or timing, and experienced hand analysts regard that claim as unsupportable.',
    where: 'Hold your hand edge-on and look at the outer side of the palm, below the little finger and above where the heart line ends. You should see one or more short horizontal creases. Most hands have between one and three visible, and they are often fine enough to need good light.',
    variations: [
      ['One clear line', 'Traditionally read as a single defining attachment. It does not mean one marriage.'],
      ['Two or more lines', 'Traditionally read as several significant bonds across a lifetime, carrying no moral weight either way.'],
      ['No visible line', 'Common. Traditionally read as relationships not being the dominant theme of the hand, not as a life without love.'],
      ['A long line', 'Traditionally read as a bond of long duration.'],
      ['Forked at the end', 'Traditionally read as distance or divergence within a bond, not as a divorce marker.'],
      ['Curving downward', 'Traditionally read as a partner who is emotionally depended upon.'],
      ['Fine vertical lines above', 'These are the children lines, covered on their own page.']
    ],
    limits: 'This is the line most often misused. It cannot tell you whether you will marry, when, how many times, or whether a relationship will end. A working hand analyst describes the marriage-prediction claim as apocryphal and inaccurate when examined empirically, and that assessment is right. Two lines do not mean two marriages. A forked line is not a divorce warning. If a reading has caused worry about a real relationship, that worry belongs in a conversation with the person involved, not in a palm.',
    faqs: [
      ['Can a palm reading predict marriage?', 'No. This is the most overstated claim in palmistry and it does not hold up. Experienced hand analysts describe reading marriage and children from a small crease below the little finger as apocryphal and inaccurate when tested. The lines exist and traditional readings exist, but no reading can identify whether, when or how often someone will marry. Anything presenting otherwise is selling certainty it does not have.'],
      ['What do two marriage lines mean?', 'Traditional palmistry reads multiple lines as several significant attachments across a lifetime, and importantly attaches no judgement to that. Two lines are not a prediction of two marriages, nor a warning of divorce, nor evidence of anything about a current relationship. Many people with two clear lines marry once, and many with one line marry more than once or not at all.'],
      ['What if I have no marriage line?', 'It is common and it means nothing worrying. Traditional readers describe it as relationships not being the dominant theme in that hand, with other lines carrying more weight. Some hands simply have fainter creases overall. Plenty of happily married people have barely visible marriage lines. An absent line is not a sign that you will not marry or will not be loved.'],
      ['Where exactly is the marriage line?', 'On the outer edge of the palm, below the base of the little finger and above the point where the heart line ends. Turn your hand sideways to see the creases more clearly. They are short and horizontal, running in from the edge. They are frequently fine enough that people miss them entirely in ordinary light, which is worth remembering before concluding you have none.'],
      ['Does a forked marriage line mean divorce?', 'No, and this reading causes real distress for no reason. Traditional palmistry describes a fork as distance or divergence within a bond, which is a broad description true of most long relationships at some point. It cannot indicate a separation, a date or a cause. If a specific relationship is genuinely troubling you, that is a conversation to have with the person, or with a counsellor.'],
      ['Which hand shows marriage lines?', 'Convention favours reading the dominant hand for current patterns, with some traditions comparing both. Since no reading here has predictive value, no hand is more authoritative. The more useful question is why the answer feels important, because these lines draw more anxious searching than any other feature of the palm, and that anxiety is usually about something real happening off the page.']
    ]
  },

  'children-lines': {
    h1: 'Children Lines in Palmistry',
    kw: 'children lines',
    title: 'Children Lines Palmistry',
    desc: 'Children lines palmistry: where the fine vertical lines sit, what tradition says about counting them, and a clear statement that they cannot indicate fertility.',
    answer: 'Children lines are fine vertical creases rising above the marriage lines on the outer edge of the palm, below the little finger. Traditional palmistry, particularly in Chinese, Japanese and Korean practice, counts them as children or close nurturing bonds. They cannot indicate fertility, how many children someone will have, or anything medical.',
    where: 'Find the marriage lines on the outer edge of the palm below the little finger, then look directly above them for very fine vertical marks rising toward the finger base. They are often faint enough to need bright light and, honestly, sometimes a magnifying glass, which is itself worth noticing.',
    variations: [
      ['Clear vertical lines', 'Traditionally counted as children or as strong nurturing bonds.'],
      ['Deeply marked lines', 'Traditionally read as a particularly close bond with that person.'],
      ['Faint lines', 'Traditionally read as a bond of lesser prominence. Very often simply fine skin.'],
      ['Straight against slanted', 'Some traditions assign sons to straight lines and daughters to slanted. There is no basis for this whatsoever.'],
      ['No visible lines', 'Common, and carrying no meaning about children or fertility.'],
      ['Many fine lines', 'Modern readers commonly read these as nurturing relationships broadly, including nieces, nephews, stepchildren and mentees.']
    ],
    limits: 'This needs saying directly, because some sites get it badly wrong. Children lines cannot indicate fertility, conception, pregnancy, the sex of a child, or how many children you will have. Some palmistry sources claim particular markings show a woman is unlikely to conceive. That claim has no basis and can cause real distress to people who are trying for a baby or going through fertility treatment. If you have any concern about fertility, a GP or a fertility specialist is the only appropriate source. Nothing on a hand carries that information.',
    faqs: [
      ['How many children will I have according to palm reading?', 'A palm cannot tell you. Traditional palmistry in several Asian traditions counts the fine vertical lines above the marriage line as children, and that is a genuine cultural practice with a long history. It is not a method that works. Family size depends on choice, circumstance, health and timing, none of which is recorded in a hand crease. Treat the counting as folklore, and make family decisions on real information.'],
      ['Can children lines show fertility problems?', 'No, and this is important. Some palmistry sources claim certain markings indicate a woman is unlikely to conceive. There is no basis for that claim and it can cause genuine distress to people trying to conceive or undergoing fertility treatment. The absence of children lines is not a medical indicator of anything. Concerns about fertility belong with a GP or a fertility specialist, who can actually help.'],
      ['Where are the children lines on the palm?', 'They are fine vertical marks rising above the marriage lines on the outer edge of the palm, below the base of the little finger and toward the Mount of Mercury. They are among the faintest markings on the hand and many people cannot see them clearly at all. Bright, angled light helps. Difficulty seeing them is not itself meaningful.'],
      ['Do straight lines mean sons and slanted lines mean daughters?', 'Some traditional sources say so. There is no basis for it, and it is worth stating plainly rather than repeating as neutral tradition. A crease in skin cannot carry information about the sex of a future child. We include the claim here because you will encounter it elsewhere and deserve to know it is unfounded rather than merely unproven.'],
      ['What do children lines mean if I do not want children?', 'Contemporary palmists commonly read them far more broadly, as any relationship where someone takes a nurturing or mentoring role. That includes nieces and nephews, stepchildren, godchildren, students, and in some readings creative work. This broader interpretation makes the lines meaningful for everyone regardless of whether they plan to be a parent, and it avoids treating a chosen life as a deficiency.'],
      ['Why do children lines matter so much in some traditions?', 'In Chinese, Japanese and Korean palmistry the children line has historically been one of the most consulted features, connected to family continuity and, in some periods, to matchmaking. That cultural weight is real and worth understanding on its own terms. Understanding why a tradition emphasised something is different from accepting that the reading works.']
    ]
  },

  'intuition-line': {
    h1: 'Intuition Line in Palmistry',
    kw: 'intuition line',
    title: 'Intuition Line Palmistry',
    desc: 'Intuition line palmistry: the curved line on the outer palm, what its presence and variations traditionally mean, and why most hands do not have one.',
    answer: 'The intuition line is a curved crease on the outer edge of the palm, arcing from near the wrist toward the little finger side. Traditional palmistry reads it as sensitivity to atmosphere and to other people. It is one of the rarer markings, and most hands do not show one, which carries no meaning either way.',
    where: 'Look at the little-finger side of the palm, below the marriage lines and toward the wrist. The intuition line arcs in a shallow curve, bowing outward toward the palm edge. It is distinct from the fate line, which runs straight up the centre, and from the health line, which some traditions place nearby.',
    variations: [
      ['Clear and well formed', 'Traditionally read as strong sensitivity to mood and atmosphere.'],
      ['Broken or partial', 'Traditionally read as sensitivity that comes and goes with circumstances.'],
      ['Absent', 'The most common case by far. Carries no meaning about perceptiveness.'],
      ['Long, reaching toward the little finger', 'Traditionally read as sensitivity that shows in how someone communicates.'],
      ['Joined to the head line', 'Traditionally read as instinct and reasoning working together.']
    ],
    limits: 'The intuition line does not indicate psychic ability, and any source connecting the two has moved from folklore into a sales pitch. Sensitivity to other people is a real human trait and it is not recorded in a palm crease. The line is also inconsistently defined between traditions, with some placing it where others place the health line, which is a reasonable indication of how firm the ground is here.',
    faqs: [
      ['What does the intuition line mean in palmistry?', 'Traditional palmistry reads it as sensitivity to atmosphere, mood and other people, sometimes described as reading a room quickly. It is one of the minor lines and receives far less attention than the three major ones. Like every reading in palmistry it is symbolic, and it describes a trait common enough that most people recognise something of themselves in the description.'],
      ['Where is the intuition line located?', 'On the outer edge of the palm, on the little-finger side, arcing in a shallow curve from near the wrist upward. It bows outward toward the palm edge rather than running straight. Traditions differ on its exact placement, and some sources describe a line in nearly the same position as the health line instead, so identification is genuinely uncertain.'],
      ['Is it rare to have an intuition line?', 'Yes, relatively. Most hands do not show a clear one, which is worth knowing before concluding anything from its absence. Rarity is sometimes used to make a feature sound significant, and that reasoning does not hold: an uncommon crease is uncommon, not meaningful. Its absence says nothing about how perceptive or empathetic someone is.'],
      ['Does the intuition line mean psychic ability?', 'No. Some sources make that connection, usually shortly before offering a paid reading, and there is nothing behind it. Sensitivity to other people is a genuine and useful human trait developed through attention and experience. It is not written into the skin of the hand, and no marking on a palm can indicate an ability that has never been demonstrated to exist.'],
      ['How is the intuition line different from the health line?', 'They sit in a similar region of the palm and traditions disagree about which is which, with some describing a single line under both names. The health line is usually described as running more vertically toward the little finger, while the intuition line curves. Given the disagreement between sources, confident identification is not really possible, and we would rather say so.']
    ]
  }
};

module.exports = { LINES };
