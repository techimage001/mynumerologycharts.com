// Core number meanings. One well-authored record per number drives the
// Life Path, Expression, Soul Urge and Personality pages via position lenses.
// Distinct by construction: number data + position framing = a distinct page.

export const NUMBERS = {
  1: {
    title: 'The Leader', keyword: 'independence, drive, initiative',
    element: 'fire',
    essence: 'One is the number of the pioneer — self-starting, ambitious, and happiest when it is forging its own path rather than following someone else\u2019s.',
    strengths: ['Original and self-reliant', 'Bold, decisive and driven', 'Natural leadership', 'Innovative and pioneering', 'Strong sense of self'],
    challenges: ['Can become domineering or stubborn', 'Impatience with slower people', 'Struggles to ask for help', 'Ego can override empathy'],
    love: 'In love, Ones need a partner who respects their independence and won\u2019t compete for control; they give loyalty but resist being managed.',
    career: 'Thrives as a founder, manager, or specialist where initiative is rewarded and there is room to lead rather than be led.',
    lens: {
      lifePath: 'As a Life Path, One sets you on a road of self-development and leadership — your growth comes from standing on your own and starting what others only talk about.',
      expression: 'As an Expression number, One shapes your outward talents toward leadership, invention and independent achievement.',
      soulUrge: 'As a Soul Urge, One means your inner craving is autonomy — to be first, to be original, and to answer to yourself.',
      personality: 'As a Personality number, One makes you come across as capable, confident and self-directed — someone others instinctively look to.'
    }
  },
  2: {
    title: 'The Peacemaker', keyword: 'partnership, diplomacy, sensitivity',
    element: 'water',
    essence: 'Two is the number of connection — intuitive, cooperative and attuned to others, it works through relationship rather than force.',
    strengths: ['Diplomatic and tactful', 'Deeply intuitive', 'Patient and supportive', 'Excellent at collaboration', 'Sensitive to atmosphere'],
    challenges: ['Over-sensitivity to criticism', 'Avoids conflict to a fault', 'Can lose itself in others', 'Indecisiveness'],
    love: 'In love, Twos are devoted, romantic partners who thrive in true partnership but must guard against giving so much that they disappear.',
    career: 'Excels in mediation, counselling, design, and any team role where empathy and cooperation matter more than raw dominance.',
    lens: {
      lifePath: 'As a Life Path, Two asks you to grow through relationship, patience and peacemaking — your power is quiet, and it works best beside others.',
      expression: 'As an Expression number, Two channels your talents into cooperation, diplomacy and creating harmony where there was friction.',
      soulUrge: 'As a Soul Urge, Two means your heart longs for closeness, harmony and being deeply understood by someone.',
      personality: 'As a Personality number, Two makes you seem gentle, approachable and warm — people feel safe opening up to you.'
    }
  },
  3: {
    title: 'The Communicator', keyword: 'creativity, expression, joy',
    element: 'air',
    essence: 'Three is the number of expression — creative, sociable and optimistic, it lights up a room and turns feeling into art and words.',
    strengths: ['Creative and expressive', 'Charismatic and sociable', 'Optimistic and uplifting', 'Imaginative', 'Quick-witted'],
    challenges: ['Scatters energy across too much', 'Avoids the hard, dull work', 'Mood can swing to melodrama', 'Struggles with focus'],
    love: 'In love, Threes are playful and affectionate; they need a partner who enjoys their sparkle and doesn\u2019t try to dim it.',
    career: 'Shines in writing, performance, marketing, design and any field that rewards imagination and communication.',
    lens: {
      lifePath: 'As a Life Path, Three sets you on a road of self-expression and joy — your task is to share your voice and not scatter your gifts.',
      expression: 'As an Expression number, Three points your talents toward creativity, words and inspiring others.',
      soulUrge: 'As a Soul Urge, Three means your inner drive is to create, be seen, and express what you feel.',
      personality: 'As a Personality number, Three makes you seem lively, charming and fun — a natural at first impressions.'
    }
  },
  4: {
    title: 'The Builder', keyword: 'stability, discipline, structure',
    element: 'earth',
    essence: 'Four is the number of foundations — practical, disciplined and dependable, it builds slowly and makes things that last.',
    strengths: ['Hard-working and reliable', 'Organised and methodical', 'Loyal and honest', 'Practical problem-solver', 'Patient with detail'],
    challenges: ['Can be rigid or stubborn', 'Resists change', 'Works to the point of burnout', 'Blunt when stressed'],
    love: 'In love, Fours are steady and committed; they show love through dependability rather than grand gestures, and value security.',
    career: 'Excels in engineering, finance, construction, operations and any role built on structure, reliability and follow-through.',
    lens: {
      lifePath: 'As a Life Path, Four asks you to build — through discipline and honest work you create the security others rely on.',
      expression: 'As an Expression number, Four channels your talents into organising, building and bringing order to chaos.',
      soulUrge: 'As a Soul Urge, Four means your heart wants security, order and a life that stands on solid ground.',
      personality: 'As a Personality number, Four makes you seem grounded, capable and trustworthy — the steady one.'
    }
  },
  5: {
    title: 'The Freedom-Seeker', keyword: 'change, adventure, freedom',
    element: 'fire',
    essence: 'Five is the number of freedom — restless, curious and adaptable, it thrives on change, travel and new experience.',
    strengths: ['Adaptable and versatile', 'Adventurous and curious', 'Persuasive communicator', 'Quick learner', 'Magnetic and fun'],
    challenges: ['Restlessness and impatience', 'Struggles to commit', 'Prone to excess', 'Scatters focus chasing novelty'],
    love: 'In love, Fives need freedom and variety; they are exciting partners who resist routine and must choose to stay rather than roam.',
    career: 'Thrives in sales, travel, media, entrepreneurship and any role with variety, movement and few fixed walls.',
    lens: {
      lifePath: 'As a Life Path, Five sets you on a road of freedom and experience — growth comes from embracing change without losing your centre.',
      expression: 'As an Expression number, Five channels your talents into versatility, persuasion and adapting to anything.',
      soulUrge: 'As a Soul Urge, Five means your heart craves freedom, adventure and the next horizon.',
      personality: 'As a Personality number, Five makes you seem exciting, magnetic and full of energy.'
    }
  },
  6: {
    title: 'The Nurturer', keyword: 'responsibility, care, home',
    element: 'water',
    essence: 'Six is the number of care — responsible, loving and devoted to home and community, it carries others and holds things together.',
    strengths: ['Caring and responsible', 'Loyal and protective', 'Creates warmth and harmony', 'Strong sense of duty', 'Natural counsellor'],
    challenges: ['Over-gives and over-worries', 'Can become controlling', 'Takes on others\u2019 burdens', 'Prone to self-sacrifice'],
    love: 'In love, Sixes are devoted, family-minded partners who give deeply — their lesson is to receive care as well as give it.',
    career: 'Excels in teaching, healthcare, counselling, hospitality and any role centred on service and care.',
    lens: {
      lifePath: 'As a Life Path, Six asks you to care and take responsibility — for family, community and the people who depend on you.',
      expression: 'As an Expression number, Six channels your talents into nurturing, healing and creating harmony at home and work.',
      soulUrge: 'As a Soul Urge, Six means your heart longs to love, protect and be needed by those you care for.',
      personality: 'As a Personality number, Six makes you seem warm, dependable and caring — the one people lean on.'
    }
  },
  7: {
    title: 'The Seeker', keyword: 'analysis, spirituality, wisdom',
    element: 'water',
    essence: 'Seven is the number of the seeker — analytical, introspective and drawn to the truth beneath the surface, it values knowledge over noise.',
    strengths: ['Analytical and perceptive', 'Independent thinker', 'Spiritually and intellectually deep', 'Loves research and truth', 'Comfortable alone'],
    challenges: ['Can be aloof or withdrawn', 'Over-thinks and distrusts', 'Struggles to open up emotionally', 'Perfectionism'],
    love: 'In love, Sevens need space and depth; they bond slowly but profoundly with a partner who respects their inner world.',
    career: 'Thrives in research, science, analysis, writing and any field that rewards depth and independent thought.',
    lens: {
      lifePath: 'As a Life Path, Seven sets you on a road of inquiry and inner growth — your task is to seek truth while learning to trust and connect.',
      expression: 'As an Expression number, Seven channels your talents into analysis, research and uncovering what others miss.',
      soulUrge: 'As a Soul Urge, Seven means your heart craves understanding, solitude and meaning beneath the surface.',
      personality: 'As a Personality number, Seven makes you seem thoughtful, private and quietly wise.'
    }
  },
  8: {
    title: 'The Powerhouse', keyword: 'ambition, authority, abundance',
    element: 'earth',
    essence: 'Eight is the number of power — ambitious, capable and results-driven, it understands money, authority and how to build in the material world.',
    strengths: ['Ambitious and driven', 'Excellent with money and strategy', 'Natural executive', 'Resilient under pressure', 'Sees the big picture'],
    challenges: ['Can be controlling or materialistic', 'Workaholism', 'Impatient with weakness', 'Struggles to switch off'],
    love: 'In love, Eights are protective, generous providers who must remember that relationships are not run like businesses.',
    career: 'Excels in business, finance, law, leadership and any arena where ambition and results are rewarded.',
    lens: {
      lifePath: 'As a Life Path, Eight asks you to master the material world — power, money and achievement — while keeping your integrity intact.',
      expression: 'As an Expression number, Eight channels your talents into leadership, strategy and building wealth and influence.',
      soulUrge: 'As a Soul Urge, Eight means your heart wants achievement, recognition and mastery over your world.',
      personality: 'As a Personality number, Eight makes you seem powerful, capable and authoritative.'
    }
  },
  9: {
    title: 'The Humanitarian', keyword: 'compassion, idealism, completion',
    element: 'air',
    essence: 'Nine is the number of completion — compassionate, idealistic and broad-minded, it gives generously and sees the whole of humanity.',
    strengths: ['Compassionate and generous', 'Idealistic and wise', 'Tolerant and broad-minded', 'Artistic and inspiring', 'Sees the bigger picture'],
    challenges: ['Can be self-sacrificing to a fault', 'Holds on to old wounds', 'Moody idealism', 'Struggles to let go'],
    love: 'In love, Nines are warm, giving partners with a wide heart; their lesson is to be as present with one person as they are with the world.',
    career: 'Thrives in the arts, charity, healing, teaching and any cause larger than the self.',
    lens: {
      lifePath: 'As a Life Path, Nine sets you on a road of compassion and letting go — your growth comes from giving without needing to hold on.',
      expression: 'As an Expression number, Nine channels your talents into humanitarian work, art and inspiring others.',
      soulUrge: 'As a Soul Urge, Nine means your heart longs to serve, heal and make a difference beyond yourself.',
      personality: 'As a Personality number, Nine makes you seem gracious, worldly and quietly noble.'
    }
  },
  11: {
    title: 'The Intuitive (Master Number)', keyword: 'inspiration, intuition, illumination',
    element: 'water', master: true,
    essence: 'Eleven is a master number — the visionary channel of Two raised to a higher octave, gifted with intuition, inspiration and spiritual insight, but carrying real nervous tension.',
    strengths: ['Highly intuitive and inspired', 'Visionary and idealistic', 'Deeply empathic', 'Can uplift and illuminate others', 'Spiritually attuned'],
    challenges: ['Nervous tension and anxiety', 'Sensitivity that overwhelms', 'Self-doubt beneath the vision', 'Impractical if ungrounded'],
    love: 'In love, Elevens feel everything intensely and seek a soul-level connection; they need a grounding partner who steadies their sensitivity.',
    career: 'Thrives in teaching, the arts, healing, spirituality and any calling that inspires and elevates people.',
    lens: {
      lifePath: 'As a Life Path, Eleven asks you to become a source of inspiration — to trust your intuition and share your vision, while learning to manage its intensity.',
      expression: 'As an Expression number, Eleven channels your talents into inspiration, insight and spiritual leadership.',
      soulUrge: 'As a Soul Urge, Eleven means your heart craves meaning, illumination and a higher connection.',
      personality: 'As a Personality number, Eleven makes you seem magnetic, sensitive and quietly luminous.'
    }
  },
  22: {
    title: 'The Master Builder (Master Number)', keyword: 'mastery, vision made real',
    element: 'earth', master: true,
    essence: 'Twenty-two is a master number — the Master Builder, Four raised to its highest power, able to turn grand vision into concrete reality on a large scale.',
    strengths: ['Turns big vision into reality', 'Practical and far-sighted', 'Exceptional capability', 'Disciplined and driven', 'Can build lasting institutions'],
    challenges: ['Immense internal pressure', 'Fear of its own potential', 'Can dominate or burn out', 'Struggles to rest'],
    love: 'In love, Twenty-twos are loyal and committed but consumed by their mission; they must make room for a partner beside the work.',
    career: 'Excels in large-scale enterprise, architecture, leadership and any project that builds something enduring.',
    lens: {
      lifePath: 'As a Life Path, Twenty-two asks you to build something significant and lasting — to carry big vision into the material world without being crushed by its weight.',
      expression: 'As an Expression number, Twenty-two channels your talents into large-scale building, leadership and lasting achievement.',
      soulUrge: 'As a Soul Urge, Twenty-two means your heart wants to build something that matters and outlives you.',
      personality: 'As a Personality number, Twenty-two makes you seem capable, substantial and quietly formidable.'
    }
  },
  33: {
    title: 'The Master Teacher (Master Number)', keyword: 'selfless love, healing, guidance',
    element: 'water', master: true,
    essence: 'Thirty-three is the rarest master number — the Master Teacher, devoted to selfless service, healing and raising others through unconditional love.',
    strengths: ['Deeply compassionate', 'Devoted to service and healing', 'Wise and nurturing', 'Uplifts whole communities', 'Selfless and warm'],
    challenges: ['Risk of martyrdom', 'Takes on too much responsibility', 'Can neglect the self', 'Heavy emotional load'],
    love: 'In love, Thirty-threes love without condition and give profoundly; their lesson is to let themselves be cared for in return.',
    career: 'Thrives in teaching, healing, ministry, humanitarian leadership and any life devoted to others.',
    lens: {
      lifePath: 'As a Life Path, Thirty-three asks you to serve and teach through love — to heal and uplift others while guarding against losing yourself in the giving.',
      expression: 'As an Expression number, Thirty-three channels your talents into healing, teaching and selfless service.',
      soulUrge: 'As a Soul Urge, Thirty-three means your heart longs to heal, guide and love without condition.',
      personality: 'As a Personality number, Thirty-three makes you seem warm, wise and quietly saintly.'
    }
  }
};

export const CORE_NUMBERS = [1,2,3,4,5,6,7,8,9,11,22,33];
export const POSITIONS = {
  lifePath:    { slug: 'life-path-number',    label: 'Life Path Number',    short: 'Life Path' },
  expression:  { slug: 'expression-number',   label: 'Expression Number',   short: 'Expression' },
  soulUrge:    { slug: 'soul-urge-number',    label: 'Soul Urge Number',    short: 'Soul Urge' },
  personality: { slug: 'personality-number',  label: 'Personality Number',  short: 'Personality' }
};
