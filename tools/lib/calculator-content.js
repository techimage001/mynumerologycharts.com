/* Calculator rewrite dataset.
   Each calculator genuinely differs: different input, different arithmetic,
   different worked example. The v25 pages were keyword-swapped templates
   scoring 0.98 against each other. This gives each page its own substance. */

const CALCS = {
  'life-path-calculator': {
    h1: 'Life Path Number Calculator', kw: 'life path number calculator',
    desc: 'Life path number calculator: enter your birth date and see every reduction step, including how master numbers 11, 22 and 33 are handled. Free, no sign-up to use.',
    answer: 'The life path number is calculated from your full date of birth. Month, day and year are each reduced to a single digit, then those three results are added and reduced again. Totals of 11, 22 and 33 are kept unreduced as master numbers. It is the most widely used number in numerology.',
    input: 'Full date of birth. No name needed.',
    formula: 'Reduce month, day and year separately, add the three results, reduce again unless the total is 11, 22 or 33.',
    example: [
      'Take 25 November 1975.',
      'Month: November is 11. As a master number it is held at 11.',
      'Day: 25 becomes 2 + 5 = 7.',
      'Year: 1975 becomes 1 + 9 + 7 + 5 = 22, held as a master number.',
      'Add the three: 11 + 7 + 22 = 40.',
      'Reduce: 4 + 0 = 4. The life path is 4.'
    ],
    differs: 'The commonest disagreement is whether to reduce the whole date in one string or reduce each part first. Adding every digit of 25/11/1975 straight through gives 4 as well here, but the two methods disagree on other dates, particularly where a master number appears in one component. This calculator reduces each part separately, which is the method most classical sources use, and shows every step so you can compare.',
    faqs: [
      ['How do I calculate my life path number?', 'Reduce the month, the day and the year each to a single digit, add those three results together, then reduce the total unless it is 11, 22 or 33. For 25 November 1975 that is month 11, day 7, year 22, totalling 40, which reduces to a life path of 4. The calculator shows every intermediate total so you can check the arithmetic yourself.'],
      ['Why do different sites give me different life path numbers?', 'Because they use different reduction methods. Some add every digit of the date in one long string, others reduce month, day and year separately first. The two approaches agree on many dates and disagree on others, particularly where a component reduces to 11 or 22. Neither is authoritative. This calculator reduces each part separately and shows the working so you can see which method produced your result.'],
      ['What happens if my life path is 11, 22 or 33?', 'Those totals are held unreduced as master numbers rather than becoming 2, 4 and 6. Traditional numerology reads them as intensified versions of the number they would reduce to. The convention is not universal and some practitioners reduce everything, so a site giving you 2 where this one gives 11 is applying a different rule rather than making an error.'],
      ['Can my life path number change?', 'No. It comes from your date of birth, which is fixed, so it never changes. Name-based numbers such as the Expression and Soul Urge do change if you change your name, which is why some numerologists calculate both a birth-name and current-name version of those. The life path has no equivalent, and any service offering to change it is selling something that does not exist.'],
      ['Is the life path number the same as the destiny number?', 'No, though the terms get confused. The life path comes from the date of birth. The destiny number, more usually called the Expression number, comes from the letters of the full birth name. Some sources swap the labels, which is why results appear to conflict between sites. Check which input a calculator asks for and you will know which number it is producing.']
    ]
  },

  'soul-urge-calculator': {
    h1: 'Soul Urge Number Calculator', kw: 'soul urge number calculator',
    desc: 'Soul urge number calculator: enter your full birth name and see how the vowels convert to numbers, with every letter value shown and the Y rule explained. Free.',
    answer: 'The soul urge number, also called the heart desire number, is calculated from the vowels in your full birth name only. Each vowel takes a Pythagorean value from 1 to 9, the values are added, and the total reduces unless it is 11, 22 or 33. Consonants are ignored entirely.',
    input: 'Full birth name. No date needed.',
    formula: 'Take only the vowels, convert each with the Pythagorean table, add and reduce.',
    example: [
      'Take the name JANE ELIZABETH SMITH.',
      'Vowels only: A, E, E, I, A, E, I.',
      'Values: A=1, E=5, E=5, I=9, A=1, E=5, I=9.',
      'Add: 1 + 5 + 5 + 9 + 1 + 5 + 9 = 35.',
      'Reduce: 3 + 5 = 8. The soul urge is 8.'
    ],
    differs: 'The largest source of disagreement is the letter Y. Some systems treat it as a vowel always, some never, and some only where it carries the vowel sound, as in Lynn but not in Yolanda. This calculator applies the sound-based rule and marks each Y it counted, so you can see exactly which decision produced your number. The Chaldean system also assigns different values to letters entirely, which is a separate reason results differ between sites.',
    faqs: [
      ['How is the soul urge number calculated?', 'Take only the vowels from your full birth name, convert each to its Pythagorean value from 1 to 9, add them and reduce the total unless it is 11, 22 or 33. Consonants play no part. For JANE ELIZABETH SMITH the vowels give 35, which reduces to a soul urge of 8. The calculator lists each vowel and its value so the arithmetic is visible.'],
      ['Is Y a vowel in soul urge calculations?', 'It depends on the system, and this is the biggest reason two sites give different answers. Some count Y always, some never, and some only where it carries the vowel sound, so counted in Lynn but not in Yolanda. This calculator uses the sound-based rule and marks every Y it counted, so you can see which decision produced your result and recalculate by hand if you prefer another rule.'],
      ['What is the difference between soul urge and heart desire?', 'They are two names for the same number, calculated the same way from the vowels of the birth name. Different traditions and different books favour different terms, and some sources add inner self as a third name. The multiplicity of names is a feature of numerology generally rather than a sign that different numbers are being described.'],
      ['Should I use my birth name or my current name?', 'Traditional practice uses the full name as first recorded, on the basis that it is the name given rather than one adopted later. Some numerologists calculate the current name separately and compare the two, treating differences as a change in emphasis. Neither approach is authoritative, and our page on birth name against current name sets out both without picking one.'],
      ['What if my name has no vowels or very few?', 'Short names simply give a smaller total, which reduces normally. No name in practice has no vowels at all once Y is considered, but names with few vowels produce a soul urge from a very small sample, which is worth knowing when weighing how much the result means. The calculation is arithmetically valid either way.']
    ]
  },

  'expression-number-calculator': {
    h1: 'Expression Number Calculator', kw: 'expression number calculator',
    desc: 'Expression number calculator: enter your full birth name and see every letter converted to its Pythagorean value, with the running total and reduction shown. Free.',
    answer: 'The expression number, also called the destiny number, uses every letter of your full birth name. Each letter takes a Pythagorean value from 1 to 9, all values are added, and the total reduces unless it is 11, 22 or 33. It differs from the soul urge, which uses vowels only.',
    input: 'Full birth name. No date needed.',
    formula: 'Convert every letter with the Pythagorean table, add them all, and reduce.',
    example: [
      'The Pythagorean table runs A to I as 1 to 9, J to R as 1 to 9 again, and S to Z as 1 to 8.',
      'Take the name ANNA LEE.',
      'A=1, N=5, N=5, A=1, L=3, E=5, E=5.',
      'Add: 1 + 5 + 5 + 1 + 3 + 5 + 5 = 25.',
      'Reduce: 2 + 5 = 7. The expression number is 7.'
    ],
    differs: 'Two systems assign different values. Pythagorean runs letters 1 to 9 in sequence; Chaldean assigns values by sound and never uses 9, on the basis that it was treated as sacred. A name will usually produce different numbers under the two systems, which is the main reason a result here may not match another site. This calculator uses Pythagorean and says so on every result.',
    faqs: [
      ['How do I calculate my expression number?', 'Convert every letter of your full birth name to its Pythagorean value, add them all together and reduce the total unless it is 11, 22 or 33. In the table A to I run 1 to 9, J to R run 1 to 9 again, and S to Z run 1 to 8. ANNA LEE gives 25, which reduces to an expression number of 7.'],
      ['What is the difference between expression and destiny number?', 'They are the same number under two names, both calculated from every letter of the full birth name. Some books prefer destiny and others expression. Confusingly, a minority of sources use destiny to mean the life path number from the birth date instead, which is why results appear to conflict. Checking which input a calculator asks for resolves it.'],
      ['Why does Chaldean numerology give a different expression number?', 'Because it assigns different values to the letters. Pythagorean runs 1 to 9 in alphabetical sequence. Chaldean assigns by sound, uses values 1 to 8 only and treats 9 as sacred and unassigned. The same name therefore produces different totals in each system. Neither is more correct; they are separate traditions, and a site should tell you which it uses.'],
      ['Do middle names count in the expression number?', 'Traditional practice uses the complete name as recorded at birth, including all middle names, because the calculation is understood to work from the full name given. Leaving a middle name out will usually change the result. Some practitioners also calculate a version from the everyday name for comparison, treating the difference as a change in emphasis rather than a correction.'],
      ['What about suffixes like Jr or hyphenated surnames?', 'Conventions vary and none is authoritative. Most practitioners include hyphenated surnames in full and exclude generational suffixes such as Jr or III, on the basis that they are legal distinctions rather than part of the name given. The important thing is applying one rule consistently, because switching between conventions makes any comparison meaningless.']
    ]
  },

  'personality-number-calculator': {
    h1: 'Personality Number Calculator', kw: 'personality number calculator',
    desc: 'Personality number calculator: enter your full birth name and see the consonants converted to numbers, with each letter value and the reduction shown. Free to use.',
    answer: 'The personality number is calculated from the consonants in your full birth name only. Each consonant takes a Pythagorean value, the values are added, and the total reduces unless it is 11, 22 or 33. Traditional numerology reads it as the impression a person makes before being known well.',
    input: 'Full birth name. No date needed.',
    formula: 'Take only the consonants, convert each with the Pythagorean table, add and reduce.',
    example: [
      'Take the name ANNA LEE.',
      'Consonants only: N, N, L.',
      'Values: N=5, N=5, L=3.',
      'Add: 5 + 5 + 3 = 13.',
      'Reduce: 1 + 3 = 4. The personality number is 4.'
    ],
    differs: 'The Y question cuts the opposite way here from the soul urge. If Y is treated as a vowel it leaves the consonant set, changing the personality number; if treated as a consonant it stays and changes it the other way. A site using a different Y rule will give a different personality number for the same name. The Pythagorean and Chaldean value tables also differ, as they do for every name-based number.',
    faqs: [
      ['How is the personality number calculated?', 'Take only the consonants from your full birth name, convert each to its Pythagorean value, add them and reduce unless the total is 11, 22 or 33. Vowels are excluded. For ANNA LEE the consonants N, N and L give 13, reducing to a personality number of 4. The calculator lists each consonant and its value so the working is visible.'],
      ['How does the personality number relate to the soul urge?', 'They are complements. The soul urge uses only the vowels and the personality number only the consonants, and together they account for every letter, which is exactly the expression number. So soul urge plus personality, before reduction, equals the expression total. Traditional readings treat the pair as inner motivation against outward impression.'],
      ['Is Y a consonant for the personality number?', 'It depends on which rule the calculator applies, and it matters more here than people expect. If Y counts as a vowel it leaves the consonant set and lowers the personality total; if it counts as a consonant it stays and raises it. This calculator applies the sound-based rule and marks each Y, so you can see the decision that produced your number.'],
      ['What does the personality number mean in a reading?', 'Traditional numerology reads it as the impression someone makes on first meeting, before they are known well, and contrasts that with the soul urge as private motivation. It is a symbolic description offered as entertainment. It cannot assess how someone actually comes across, which depends on context, familiarity and who is doing the perceiving.'],
      ['Does a nickname change the personality number?', 'It would produce a different result, since the calculation depends on which letters are included. Traditional practice uses the full birth name. Some numerologists calculate a nickname version separately, treating it as the impression made in casual settings. That is a convention rather than a rule, and comparing the two is only meaningful if the same Y rule is used for both.']
    ]
  },

  'birthday-number-calculator': {
    h1: 'Birthday Number Calculator', kw: 'birthday number calculator',
    desc: 'Birthday number calculator: uses only the day of the month you were born, from 1 to 31, with master numbers held unreduced. Free, with the working shown.',
    answer: 'The birthday number is the simplest calculation in numerology: it uses only the day of the month you were born, ignoring month and year entirely. Days 1 to 9 stand as they are. Days 10 to 31 reduce to a single digit, except 11 and 22, which are held as master numbers.',
    input: 'Day of the month only, 1 to 31.',
    formula: 'Take the day of birth. Reduce it to a single digit unless it is 11 or 22.',
    example: [
      'Born on the 3rd: the birthday number is 3, no reduction needed.',
      'Born on the 25th: 2 + 5 = 7. The birthday number is 7.',
      'Born on the 11th: held as the master number 11, not reduced to 2.',
      'Born on the 29th: 2 + 9 = 11, which is held as 11 rather than reduced further to 2.'
    ],
    differs: 'Some practitioners reduce everything, so an 11th becomes 2 and a 29th becomes 2, which produces a different result from this calculator. Others keep the unreduced day itself as meaningful, reading a 25 differently from a 7 arrived at another way, which is why there are separate pages for each day from 1 to 31 rather than only nine. Neither convention is authoritative.',
    faqs: [
      ['What is my birthday number in numerology?', 'It is simply the day of the month you were born, reduced to a single digit if necessary. Born on the 3rd gives 3. Born on the 25th gives 2 plus 5, which is 7. The month and year play no part at all, which makes it the simplest calculation in numerology and the only one you can usually do in your head.'],
      ['Is the birthday number the same as the life path?', 'No. The birthday number uses only the day of the month. The life path uses the complete date including month and year, reducing each part and adding them. Two people born on the 25th share a birthday number of 7 but will usually have entirely different life paths, because their months and years differ.'],
      ['Why are there separate pages for the 11th and the 2nd?', 'Because 11 is held as a master number rather than reduced to 2, and traditional numerology reads it as a distinct and intensified theme. The same applies to 22. This convention is not universal and some practitioners reduce everything, in which case an 11th birthday would simply read as 2.'],
      ['Does the birthday number matter less than the other numbers?', 'Traditional numerology treats it as a supporting number rather than a core one, describing a particular talent or emphasis rather than a whole life theme. It is usually read alongside the life path rather than on its own. Since all of it is symbolic, the ranking reflects convention rather than any measured difference in significance.'],
      ['What if I was born on the 31st?', 'It reduces to 3 plus 1, which is 4. Traditional readings sometimes distinguish a 4 reached from 31 from a 4 reached from 13 or 22, treating the route as carrying some meaning of its own. This is the same logic that produces the karmic debt numbers, where an intermediate total of 13 is read differently from other routes to 4.']
    ]
  },

  'personal-year-calculator': {
    h1: 'Personal Year Number Calculator', kw: 'personal year number calculator',
    desc: 'Personal year number calculator: add your birth day and month to any calendar year to find the cycle you are in, for this year or any year you choose. Free.',
    answer: 'The personal year number is calculated by adding your birth day and birth month to the calendar year in question, then reducing to a single digit. It moves through a nine-year cycle, changing on 1 January in most systems. It can be calculated for any year, past or future.',
    input: 'Birth day and month, plus the calendar year you want.',
    formula: 'Add birth day plus birth month plus the target year, then reduce to a single digit.',
    example: [
      'Take someone born on 25 November, calculating for 2026.',
      'Day: 25 becomes 2 + 5 = 7.',
      'Month: November is 11, becoming 1 + 1 = 2.',
      'Year: 2026 becomes 2 + 0 + 2 + 6 = 10, then 1 + 0 = 1.',
      'Add: 7 + 2 + 1 = 10.',
      'Reduce: 1 + 0 = 1. The personal year for 2026 is 1.'
    ],
    differs: 'Systems disagree about when the personal year turns over. Most use 1 January. A significant minority use your birthday instead, on the basis that the cycle is personal rather than calendrical. That difference means two sites can give you different personal years for the same date, particularly in the months between January and your birthday. This calculator uses 1 January and states so with the result.',
    faqs: [
      ['How do I calculate my personal year number?', 'Reduce your birth day, reduce your birth month, reduce the calendar year you are interested in, then add those three results and reduce again. For 25 November in 2026 that is 7 plus 2 plus 1, totalling 10, which reduces to a personal year of 1. Unlike the life path, this changes every year.'],
      ['When does the personal year change?', 'Most systems change it on 1 January, and this calculator uses that convention. A significant minority change it on your birthday instead, arguing that a personal cycle should follow the person rather than the calendar. The disagreement matters most between January and your birthday, where the two methods give different answers, so check which rule a site uses.'],
      ['Can I calculate my personal year for a future year?', 'Yes. Any calendar year works, past or future, because the calculation simply adds your birth day and month to the year in question. People commonly look ahead one or two years. Since the result is symbolic rather than predictive, a future personal year is a description of a theme in the tradition rather than information about what will happen.'],
      ['What is a personal year 1?', 'Traditional numerology reads the 1 year as the start of a nine-year cycle, describing beginnings, new direction and initiative. The nine-year sequence then runs through building, expression, consolidation, change, responsibility, reflection, effort and completion before returning to 1. It is a symbolic framework offered for reflection, not a forecast of events.'],
      ['How does the personal year relate to the personal month and day?', 'They nest inside each other. The personal month adds the calendar month to the personal year, and the personal day adds the date to the personal month. So the personal year sets the theme, the month narrows it and the day narrows it further. Each is calculated from the one above it rather than independently.']
    ]
  },

  'personal-month-calculator': {
    h1: 'Personal Month Number Calculator', kw: 'personal month number calculator',
    desc: 'Personal month number calculator: adds the calendar month to your personal year to give the cycle within the year, with each step of the working shown. Free.',
    answer: 'The personal month number is calculated by adding the calendar month to your personal year number and reducing the total. It sits inside the personal year, so the year must be worked out first. It changes on the first of each month and completes its own nine-step sequence within the year.',
    input: 'Birth day and month, plus the month and year you want.',
    formula: 'Work out the personal year first, add the calendar month number, then reduce.',
    example: [
      'Continuing the personal year 1 for 2026 from a 25 November birth date.',
      'For March, the calendar month number is 3.',
      'Add: personal year 1 + month 3 = 4.',
      'The personal month for March 2026 is 4.',
      'For December: 1 + 12 = 13, then 1 + 3 = 4 as well, which is why different months can share a number.'
    ],
    differs: 'Because the personal month is built on the personal year, any disagreement about when the personal year turns over carries straight through. A site that changes the personal year on your birthday rather than 1 January will give a different personal month for every month between those two dates. There is also minor disagreement over whether to reduce the calendar month before adding it.',
    faqs: [
      ['How do I work out my personal month number?', 'Calculate your personal year first, then add the number of the calendar month and reduce. If your personal year is 1 and you want March, that is 1 plus 3, giving a personal month of 4. December would be 1 plus 12, which is 13, reducing to 4 as well. Different months can share a number within the same year.'],
      ['Why do two months in the same year have the same number?', 'Because reduction collapses different totals to the same digit. In a personal year 1, both March and December give 4, since 1 plus 3 is 4 and 1 plus 12 reduces to 4. This happens in every personal year and is a straightforward consequence of the arithmetic rather than a special significance.'],
      ['Does the personal month change on the first of the month?', 'In the standard method, yes. The month number changes with the calendar month, so the personal month turns over at midnight on the first. Practitioners who run the personal year from a birthday rather than 1 January sometimes run months from the same anniversary date instead, which shifts every month by however many days that is.'],
      ['Do I need my personal year to calculate the personal month?', 'Yes, because the personal month is built on it rather than calculated independently. The sequence is that the personal year comes from your birth day, birth month and the calendar year, and the personal month adds the calendar month to that result. Skipping the first step will give a number that is not a personal month at all.'],
      ['Is the personal month more useful than the personal year?', 'Traditional numerology treats the year as setting the theme and the month as narrowing it, so they are read together rather than ranked. Some people find the shorter cycle more engaging simply because it changes more often. Since neither predicts anything, usefulness here means how helpful the prompt is for reflection.']
    ]
  },

  'personal-day-calculator': {
    h1: 'Personal Day Number Calculator', kw: 'personal day number calculator',
    desc: 'Personal day number calculator: adds the date to your personal month to give the shortest numerology cycle, with the full working shown for any day you choose. Free.',
    answer: 'The personal day number is calculated by adding the date of the month to your personal month number and reducing. It is the shortest cycle in numerology, changing daily, and it sits inside the personal month, which sits inside the personal year. All three must be calculated in sequence.',
    input: 'Birth day and month, plus the full date you want.',
    formula: 'Work out the personal year, then the personal month, then add the date and reduce.',
    example: [
      'Continuing the personal month 4 for March 2026.',
      'For the 9th of March, the date number is 9.',
      'Add: personal month 4 + date 9 = 13.',
      'Reduce: 1 + 3 = 4. The personal day is 4.',
      'The next day, the 10th: 4 + 10 = 14, then 1 + 4 = 5.'
    ],
    differs: 'The personal day inherits every disagreement above it, since it is built on the personal month which is built on the personal year. A site using a birthday-based year will differ from this one for most of the calendar. Some practitioners also hold master numbers at the daily level and others reduce everything, which changes roughly one day in nine.',
    faqs: [
      ['How is the personal day number calculated?', 'Work out your personal year, then your personal month, then add the date of the month and reduce. If your personal month is 4 and the date is the 9th, that is 4 plus 9, giving 13, which reduces to a personal day of 4. The three cycles nest inside each other and must be calculated in that order.'],
      ['Does the personal day number repeat?', 'Yes, in a nine-step sequence within each personal month, so the same number recurs roughly every nine days. Because the personal month changes on the first, the sequence restarts from a different point each month rather than running continuously. That is why the pattern does not simply repeat every nine days across a whole year.'],
      ['Is the personal day useful for planning?', 'Traditional numerology offers day themes as prompts for reflection, and some people enjoy checking them. It cannot indicate whether a particular day will go well, whether to sign a contract, or when to make a decision. Treating a symbolic number as scheduling advice would be a poor basis for anything that actually matters.'],
      ['What is the difference between a personal day and a universal day?', 'The personal day includes your birth day and month, so it differs between people. The universal day is calculated from the calendar date alone, so everyone shares it. Some practitioners read the two together, treating the universal day as a general atmosphere and the personal day as your own position within it.'],
      ['Why does my personal day differ from another calculator?', 'Almost always because of the personal year underneath it. If the other site changes the personal year on your birthday rather than 1 January, every personal month and day will differ for part of the year. Master number handling at the daily level is a second, smaller source of difference. Checking the year first usually explains it.']
    ]
  },

  'attitude-number-calculator': {
    h1: 'Attitude Number Calculator', kw: 'attitude number calculator',
    desc: 'Attitude number calculator: adds your birth month and birth day only, ignoring the year, to give the number traditionally read as first impression. Free.',
    answer: 'The attitude number, sometimes called the sun number, is calculated by adding your birth month and birth day and reducing the total. The year is not used at all. Traditional numerology reads it as the manner someone shows in an unfamiliar situation, before they settle.',
    input: 'Birth month and birth day only. No year.',
    formula: 'Add the birth month to the birth day, then reduce to a single digit.',
    example: [
      'Take 25 November.',
      'Month: November is 11.',
      'Day: 25.',
      'Add: 11 + 25 = 36.',
      'Reduce: 3 + 6 = 9. The attitude number is 9.'
    ],
    differs: 'The main variation is whether to reduce month and day before adding them or add them raw and reduce once. Adding raw, as above, gives 36 then 9. Reducing first gives 2 plus 7, which is also 9 here but disagrees on other dates. Some sources also hold a master total of 11 or 22 rather than reducing it, which this calculator does and states with the result.',
    faqs: [
      ['How do I find my attitude number?', 'Add your birth month to your birth day and reduce the total to a single digit. For 25 November that is 11 plus 25, which is 36, reducing to an attitude number of 9. The birth year is not used at all, which is what distinguishes this calculation from the life path.'],
      ['What is the attitude number used for?', 'Traditional numerology reads it as the manner someone shows in unfamiliar situations, before they relax into being themselves, and contrasts it with the life path as the longer theme. It is treated as a supporting number rather than a core one. Like every reading in numerology, it is symbolic and offered as entertainment.'],
      ['Is the attitude number the same as the sun number?', 'Some sources use the terms interchangeably for this month plus day calculation. Others use sun number for a different calculation entirely, or confuse it with the astrological sun sign, which comes from the position of the sun rather than from arithmetic. Checking which inputs a calculator asks for is the reliable way to tell what you are being given.'],
      ['Why does the attitude number ignore the birth year?', 'Because the tradition treats month and day as the personal, recurring part of a birth date, with the year marking a generational cohort instead. That reasoning is a convention within numerology rather than a finding. It does mean everyone born on the same day of the same month shares an attitude number regardless of age.'],
      ['Can the attitude number contradict the life path?', 'Traditional readings expect them to differ and describe the difference as first impression against longer pattern. Where the two numbers have very different themes, a reading might frame it as someone coming across quite differently from how they are once known. That is a narrative device rather than a measurement of anything.']
    ]
  },

  'maturity-number-calculator': {
    h1: 'Maturity Number Calculator', kw: 'maturity number calculator',
    desc: 'Maturity number calculator: adds your life path and expression numbers to give the number traditionally read as a later-life theme, with the working shown. Free.',
    answer: 'The maturity number is calculated by adding your life path number to your expression number and reducing the total. It therefore needs both a birth date and a full birth name. Traditional numerology reads it as a theme said to emerge more strongly from around the middle of life.',
    input: 'Full birth date and full birth name.',
    formula: 'Add the life path number to the expression number, then reduce.',
    example: [
      'Take a life path of 4 and an expression number of 7.',
      'Add: 4 + 7 = 11.',
      'As a master number, 11 is held rather than reduced to 2.',
      'The maturity number is 11.',
      'A life path 4 with expression 5 would give 9, reduced normally.'
    ],
    differs: 'Because it is built from two other numbers, the maturity number inherits every disagreement in both. A different life path reduction method or a different Y rule in the expression number will change it. Sources also differ on the age at which the maturity number is said to become relevant, with figures from the mid thirties to the mid fifties given, none with any basis.',
    faqs: [
      ['How is the maturity number calculated?', 'Add your life path number to your expression number and reduce the total unless it is 11, 22 or 33. A life path of 4 with an expression of 7 gives 11, which is held as a master number. Because it is derived from two other numbers, both must be calculated correctly first.'],
      ['At what age does the maturity number apply?', 'Sources give figures ranging from the mid thirties to the mid fifties, and none of them has any basis beyond convention. The vagueness is itself informative: a system that cannot agree on when its own number takes effect is not describing something measurable. Treat the age framing as narrative rather than as a threshold.'],
      ['Why does my maturity number need both my name and birth date?', 'Because it is the sum of the life path, which comes from the birth date, and the expression number, which comes from the full birth name. It is the only common numerology number requiring both inputs to be calculated first, which is why calculators asking for only one cannot produce it.'],
      ['What if my maturity number is the same as my life path?', 'It happens, and traditional readings describe it as an emphasis reinforcing rather than adding to the existing theme. Arithmetically it simply means the expression number reduced to a value that brought the total back round to the same digit. It is a coincidence of the reduction rather than anything requiring special interpretation.'],
      ['Can the maturity number change if I change my name?', 'It would recalculate differently, since the expression number half of it depends on the name used. Traditional practice uses the full birth name throughout, which keeps it fixed. Practitioners who calculate a current-name version produce a second maturity number and read the difference as a shift in emphasis, which is a convention rather than a rule.']
    ]
  },

  'balance-number-calculator': {
    h1: 'Balance Number Calculator', kw: 'balance number calculator',
    desc: 'Balance number calculator: uses only the initials of your full birth name, giving the number traditionally read as a resource under pressure. Free, working shown.',
    answer: 'The balance number is calculated from the initials of your full birth name only. Each initial takes a Pythagorean value, those values are added and the total reduces. Traditional numerology reads it as what someone reaches for under strain, rather than as a general character theme.',
    input: 'The first letter of each part of your full birth name.',
    formula: 'Convert each initial with the Pythagorean table, add them, and reduce.',
    example: [
      'Take the name JANE ELIZABETH SMITH.',
      'Initials: J, E, S.',
      'Values: J=1, E=5, S=1.',
      'Add: 1 + 5 + 1 = 7.',
      'The balance number is 7, no further reduction needed.'
    ],
    differs: 'Because it uses only two or three letters, the balance number is the most sensitive of all the name-based numbers to how many names are included. Adding or omitting a middle name changes it outright, where the expression number would shift only slightly. Practitioners also disagree about whether to include a name someone never uses, which affects this number more than any other.',
    faqs: [
      ['How do I calculate my balance number?', 'Take the first letter of each part of your full birth name, convert each to its Pythagorean value and add them, then reduce if the total is above 9. For JANE ELIZABETH SMITH the initials J, E and S give 1 plus 5 plus 1, which is a balance number of 7.'],
      ['Why does the balance number use only initials?', 'The tradition treats initials as the most compressed form of a name, standing for the whole, and reads the resulting number as what someone falls back on rather than how they generally are. That reasoning is symbolic rather than derived from anything. It does make this the quickest name-based number to work out by hand.'],
      ['Does a middle name change the balance number?', 'Yes, and more dramatically than for any other number, because the calculation uses so few letters. Adding a middle name adds a whole value to a total of two or three, which will usually change the result outright. For the expression number the same change shifts a much larger total by a proportionally smaller amount.'],
      ['What is the balance number used for in a reading?', 'Traditional numerology reads it as a resource drawn on under strain rather than as a general character description, which distinguishes it from the expression and soul urge. It is treated as a minor supporting number. Nothing about it can indicate how someone actually copes with difficulty, which depends on circumstances and support rather than on initials.'],
      ['What if I only have two names?', 'Then the calculation uses two initials rather than three, which is perfectly valid arithmetically. It does mean the number rests on an even smaller sample, which is worth bearing in mind when weighing the result. The same applies at the other end for people with several middle names, where the total is built from more letters.']
    ]
  },

  'hidden-passion-calculator': {
    h1: 'Hidden Passion Number Calculator', kw: 'hidden passion number calculator',
    desc: 'Hidden passion number calculator: finds the digit appearing most often in your name, with the full letter frequency count shown and ties explained. Free.',
    answer: 'The hidden passion number is the digit that appears most frequently when every letter of your full birth name is converted to its Pythagorean value. It is a frequency count rather than a sum, which makes it the only common numerology number not produced by adding and reducing.',
    input: 'Full birth name. No date needed.',
    formula: 'Convert every letter to its value, count how often each digit 1 to 9 appears, and take the most frequent.',
    example: [
      'Take the name ANNA LEE.',
      'Values: A=1, N=5, N=5, A=1, L=3, E=5, E=5.',
      'Count: the digit 1 appears twice, 3 appears once, 5 appears four times.',
      'The most frequent digit is 5.',
      'The hidden passion number is 5.'
    ],
    differs: 'Ties are the main source of variation. Where two digits appear equally often, some practitioners report both as a shared hidden passion, others take the higher digit, and others treat the tie as meaningful in itself. This calculator reports every tied digit rather than choosing between them, and shows the full frequency count so you can see how close the result was.',
    faqs: [
      ['How do I find my hidden passion number?', 'Convert every letter of your full birth name to its Pythagorean value, then count how many times each digit from 1 to 9 appears. The most frequent digit is the hidden passion number. For ANNA LEE the digit 5 appears four times, more than any other, giving a hidden passion of 5.'],
      ['What if two numbers tie in my name?', 'Practitioners handle it differently. Some report both digits as a shared hidden passion, some take the higher of the two, and some read the tie itself as significant. There is no authoritative rule. This calculator reports every tied digit and shows the full frequency count, so you can see how close the result was rather than being given a single answer.'],
      ['How is the hidden passion different from the other name numbers?', 'It is the only common numerology number produced by counting rather than by adding and reducing. The expression, soul urge and personality numbers all sum letter values. The hidden passion looks at which value occurs most often, which means a long name and a short name are assessed quite differently by it.'],
      ['What are karmic lessons and how do they relate?', 'They are the mirror image of the hidden passion: the digits that do not appear in your name at all. Where the hidden passion is the most frequent value, karmic lessons are the missing ones. The two are usually calculated together from the same frequency count, which is why they appear side by side in a full chart.'],
      ['Can a name have no hidden passion number?', 'Not in practice, since any name produces some frequency distribution and something will be most common. Very short names can produce several digits appearing once each, which is a complete tie across the whole set, and in that case the number carries no useful distinction. The frequency count makes this visible immediately.']
    ]
  },

  'karmic-lessons-calculator': {
    h1: 'Karmic Lessons Calculator', kw: 'karmic lessons calculator',
    desc: 'Karmic lessons calculator: finds which digits from 1 to 9 are missing from your full birth name, with the complete letter frequency shown. Free to use.',
    answer: 'Karmic lessons are the digits from 1 to 9 that do not appear at all when every letter of your full birth name is converted to its Pythagorean value. It is a check for absence rather than a sum, which is why some names produce several karmic lessons and others none.',
    input: 'Full birth name. No date needed.',
    formula: 'Convert every letter to its value, then list which digits from 1 to 9 never appear.',
    example: [
      'Take the name ANNA LEE.',
      'Values present: 1, 5, 3.',
      'Digits from 1 to 9 that never appear: 2, 4, 6, 7, 8, 9.',
      'Those six digits are the karmic lessons for this name.',
      'A longer name usually produces fewer, because more letters cover more values.'
    ],
    differs: 'Karmic lessons are entirely dependent on name length, which is worth stating plainly. A short name will produce many, a long one few or none, and that is arithmetic rather than a statement about the person. Practitioners also disagree over whether to use the birth name only or to check the current name as well, which changes the result for anyone who has changed their name.',
    faqs: [
      ['What are karmic lessons in numerology?', 'They are the digits from 1 to 9 that never appear when every letter of your full birth name is converted to its Pythagorean value. Traditional numerology reads a missing digit as an area needing attention. It is a check for absence rather than a calculation, which makes it different from every other number in a chart.'],
      ['Are karmic lessons the same as karmic debt?', 'No, and they are frequently confused. Karmic lessons come from letters missing in a name. Karmic debt comes from an intermediate total of 13, 14, 16 or 19 appearing during a reduction. They share a word and nothing else, using different inputs and different methods entirely.'],
      ['Why do I have so many karmic lessons?', 'Almost certainly because your name is short. A name with few letters covers few of the nine values, so most digits are absent by simple arithmetic. A long name with several middle names will usually produce few karmic lessons or none. This dependency on name length is worth knowing before reading anything into the count.'],
      ['Can you have no karmic lessons?', 'Yes, and it is common with longer names. All nine digits appearing at least once means no digit is missing, so there are no karmic lessons to report. Traditional readings describe this as a balanced name rather than an absence of anything to work on. Arithmetically it just means the name is long enough to cover the range.'],
      ['Does changing my name remove a karmic lesson?', 'The calculation on a new name will give a different result, and some practitioners treat that as meaningful while traditional practice uses the birth name throughout. Services offering to remove karmic lessons by choosing a name have no basis for the claim. The framework is symbolic entertainment, and nothing sold to alter it changes anything real.']
    ]
  },

  'pinnacles-calculator': {
    h1: 'Pinnacles Calculator', kw: 'pinnacles calculator',
    desc: 'Pinnacles calculator: works out the four pinnacle numbers and the age ranges they cover, calculated from your birth date with every step shown. Free.',
    answer: 'The four pinnacles are calculated from the reduced month, day and year of your birth date. The first pinnacle is month plus day, the second day plus year, the third the first plus the second, and the fourth month plus year. Each covers a period of life set by the life path number.',
    input: 'Full date of birth.',
    formula: 'Reduce month, day and year. First pinnacle is month plus day; second is day plus year; third is first plus second; fourth is month plus year.',
    example: [
      'Take 25 November 1975: month 11 becomes 2, day 25 becomes 7, year 1975 becomes 22 then 4.',
      'First pinnacle: 2 + 7 = 9.',
      'Second pinnacle: 7 + 4 = 11, held as a master number.',
      'Third pinnacle: 9 + 11 = 20, reducing to 2.',
      'Fourth pinnacle: 2 + 4 = 6.'
    ],
    differs: 'The age ranges vary more between sources than the numbers do. The commonest rule sets the first pinnacle to end at 36 minus the life path number, with the next two lasting nine years each and the fourth running to the end of life. Other sources use 35 or a fixed 27. This calculator uses the 36 minus life path rule and prints the resulting ages so you can compare.',
    faqs: [
      ['How are the four pinnacles calculated?', 'Reduce your birth month, day and year to single digits first. The first pinnacle is month plus day, the second is day plus year, the third is the first pinnacle plus the second, and the fourth is month plus year. Each is reduced unless it produces 11, 22 or 33, which are held as master numbers.'],
      ['What ages do the pinnacles cover?', 'The commonest rule ends the first pinnacle at 36 minus your life path number, with the second and third lasting nine years each and the fourth running from there onward. Other sources use 35 or a fixed age of 27 instead. The disagreement is larger for the age ranges than for the numbers themselves, so check which rule a site applies.'],
      ['What is the difference between pinnacles and challenges?', 'They are calculated from the same three reduced components but with different arithmetic: pinnacles add them and challenges subtract them. Traditional numerology reads pinnacles as opportunities in a period and challenges as the difficulty running alongside. They are usually presented together as pairs covering the same age ranges.'],
      ['Can two pinnacles have the same number?', 'Yes, and it happens fairly often given that only nine digits and three master numbers are available. Traditional readings describe a repeated pinnacle as an extended emphasis on the same theme rather than as two separate periods. Arithmetically it is a consequence of reduction bringing different totals to the same digit.'],
      ['What happens when a pinnacle is a master number?', 'It is held at 11, 22 or 33 rather than reduced, and traditional readings treat it as an intensified form of the digit it would reduce to. The second pinnacle in the worked example is 11 for this reason. Practitioners who reduce everything would read it as 2 instead, which is a difference in convention rather than an error.']
    ]
  },

  'challenge-numbers-calculator': {
    h1: 'Challenge Numbers Calculator', kw: 'challenge numbers calculator',
    desc: 'Challenge numbers calculator: subtracts the reduced parts of your birth date to give the four challenge numbers, including why zero is a valid result. Free.',
    answer: 'The challenge numbers are calculated by subtracting the reduced parts of your birth date from one another and taking the absolute difference. The first is day minus month, the second year minus day, the third the difference between the first two, and the fourth year minus month. Zero is a valid result.',
    input: 'Full date of birth.',
    formula: 'Reduce month, day and year. Take absolute differences: day minus month, year minus day, then the first two differences, then year minus month.',
    example: [
      'Take 25 November 1975: month 2, day 7, year 4.',
      'First challenge: the difference between 7 and 2 is 5.',
      'Second challenge: the difference between 4 and 7 is 3.',
      'Third challenge: the difference between 5 and 3 is 2.',
      'Fourth challenge: the difference between 4 and 2 is 2.'
    ],
    differs: 'The distinctive feature is that challenges can be zero, which no other numerology number can. A zero occurs whenever two reduced components are equal, and traditional readings treat it as a challenge of choice rather than an absence of one. Master numbers are also reduced here rather than held, because the arithmetic is subtraction, which some sources apply inconsistently.',
    faqs: [
      ['How are challenge numbers calculated?', 'Reduce your birth month, day and year to single digits, then take absolute differences. The first challenge is the difference between day and month, the second between year and day, the third between those two results, and the fourth between year and month. Always take the positive difference regardless of which is larger.'],
      ['What does a challenge number of zero mean?', 'Zero occurs when two reduced components of your birth date are equal, and it is the only place in numerology where zero is a valid result. Traditional readings describe it as a challenge of choice rather than an absence of difficulty, sometimes called the zero challenge. It is arithmetically ordinary and appears in a substantial share of dates.'],
      ['How do challenges relate to pinnacles?', 'They use the same three reduced components with opposite arithmetic: pinnacles add and challenges subtract. They cover the same age ranges and are usually read as pairs, with the pinnacle describing the opportunity in a period and the challenge the difficulty running alongside it. A full chart presents them together for that reason.'],
      ['Are master numbers used in challenge numbers?', 'No. Because the arithmetic is subtraction, a difference of 11 or 22 cannot arise from single-digit components, so master numbers do not appear at this stage. Some sources hold master numbers when reducing the birth date components first, which changes the differences. This calculator reduces fully before subtracting and shows each step.'],
      ['Can a challenge number be negative?', 'No. The calculation takes the absolute difference, meaning the positive gap between two numbers regardless of order. Subtracting 7 from 2 and 2 from 7 both give 5. This is worth stating because working it out by hand and keeping a negative sign is one of the commonest arithmetic mistakes people make with this calculation.']
    ]
  }
};

module.exports = { CALCS };
