// Every money lesson, in learning order. Types and grading live in ./learn.ts.
// Rules for this file: plain text only, no em or en dashes, no emoji, every worked
// number double-checked. Example numbers are examples, never statistics.
import type { Lesson } from './learn';

export const CORE_LESSONS: Lesson[] = [
  // ---------------------------------------------------------------- earn
  {
    id: 'earn',
    art: 'earn',
    category: 'earning',
    versions: {
      little: {
        title: "Money Comes From Work",
        blurb: "Helping out is how you earn coins.",
        pages: [
          { heading: "Work earns money", body: "Grown-ups go to work, and work pays them money. That money buys food, toys and ice cream.", art: 'earn' },
          { heading: "You can earn too", body: "When you finish a quest, like feeding the dog, you earn coins. A grown-up checks it first." },
          { heading: "Bigger jobs, more coins", body: "A quest with more stars is a bigger job. Bigger jobs pay more coins." },
        ],
        quiz: [
          {
            prompt: "How do you earn coins in Kid Kapital?",
            choices: ["By waiting", "By finishing quests"],
            answer: 1,
            why: "Coins come from doing quests, just like grown-ups get paid for their work.",
          },
          {
            prompt: "Which quest pays more coins?",
            choices: ["A quest with 3 stars", "A quest with 1 star"],
            answer: 0,
            why: "More stars means a bigger job, and bigger jobs pay more.",
          },
        ],
        tryIt: { label: "See today's quests", to: 'quests' },
      },
      middle: {
        title: "Earning Your Coins",
        blurb: "Why work pays, and why bigger jobs pay more.",
        pages: [
          { heading: "Money is a thank-you for work", body: "People pay for things that help them. When a grown-up goes to work, they are helping someone, and they get paid for it. Your quests work the same way: you help your family, and you earn coins.", art: 'earn' },
          { heading: "Stars measure effort", body: "Each quest has stars. More stars means the job takes more time or effort, so it pays more. If one star pays $1, a three-star quest pays $3." },
          { heading: "Doing it well matters", body: "A grown-up approves your quest before you get paid. A job done carefully is worth more to the people you help. Some quests become trusted, which means you did them so well that they pay right away." },
          { heading: "Add it up", body: "Say you do a two-star quest worth $2 on Monday and a three-star quest worth $3 on Wednesday. That is $5 you earned with your own effort." },
        ],
        quiz: [
          {
            prompt: "Why do some quests pay more than others?",
            choices: ["They take more effort", "They are done faster", "They have nicer names"],
            answer: 0,
            why: "Bigger jobs take more time and effort, so they pay more.",
          },
          {
            prompt: "If one star pays $1, how much does a four-star quest pay?",
            choices: ["$1", "$5", "$4"],
            answer: 2,
            why: "Four stars times $1 each is $4.",
          },
          {
            prompt: "What does it mean when a quest is trusted?",
            choices: ["It pays nothing", "It pays right away because you do it well", "Anyone can skip it"],
            answer: 1,
            why: "Trusted quests pay right away because you have shown you do them well.",
          },
        ],
        tryIt: { label: "Pick a quest to do", to: 'quests' },
      },
      teen: {
        title: "Earning and Value",
        blurb: "What makes work worth paying for.",
        pages: [
          { heading: "Income is a trade", body: "When you earn money, you trade your time and effort for it. Someone pays you because what you do is worth more to them than the money they give up. That is value.", art: 'earn' },
          { heading: "What sets your pay", body: "Jobs that need more skill, more effort or more responsibility usually pay more. In Kid Kapital, stars do this job: a harder quest has more stars and pays more coins." },
          { heading: "Hourly math", body: "Say you babysit for 3 hours at $12 an hour. That is 3 x $12 = $36. If a neighbor pays $20 for a yard job that takes you 1 hour, that job pays more per hour, even though $20 is less than $36 in total." },
          { heading: "Grow your value", body: "Learning new skills, being reliable and doing careful work all make you more valuable. That is why trusted quests pay right away: you have built a track record. In the real world, that track record is called a reputation." },
        ],
        quiz: [
          {
            prompt: "You earn $36 for 3 hours of babysitting. What is your hourly rate?",
            choices: ["$9", "$12", "$18", "$36"],
            answer: 1,
            why: "$36 divided by 3 hours is $12 an hour.",
          },
          {
            prompt: "Job A pays $20 for 1 hour. Job B pays $36 for 3 hours. Which pays more per hour?",
            choices: ["Job B", "They pay the same", "Job A"],
            answer: 2,
            why: "Job A pays $20 an hour, while Job B pays $12 an hour.",
          },
          {
            prompt: "Which of these is most likely to raise how much you can earn over time?",
            choices: ["Building skills and being reliable", "Doing jobs as fast as possible, even sloppily", "Only doing the easiest jobs"],
            answer: 0,
            why: "Skills and a good track record make your work worth more to the people who pay for it.",
          },
        ],
        tryIt: { label: "Check today's quests", to: 'quests' },
      },
    },
  },

  // ---------------------------------------------------------------- needs-wants
  {
    id: 'needs-wants',
    art: 'needs-wants',
    category: 'spending',
    versions: {
      little: {
        title: "Needs and Wants",
        blurb: "Some things we need, some things we want.",
        pages: [
          { heading: "Needs", body: "A need is something you must have, like food, water, a home and warm clothes.", art: 'needs-wants' },
          { heading: "Wants", body: "A want is something fun that is nice to have, like a toy or ice cream. Wants are good too!" },
          { heading: "Needs come first", body: "Families pay for needs first. Then they can use extra money for wants." },
        ],
        quiz: [
          {
            prompt: "Which one is a need?",
            choices: ["A new toy car", "Water to drink", "A sticker"],
            answer: 1,
            why: "We need water to stay healthy, so it is a need.",
          },
          {
            prompt: "Which one is a want?",
            choices: ["Ice cream", "A warm coat in winter"],
            answer: 0,
            why: "Ice cream is a yummy treat, so it is a want.",
          },
        ],
        tryIt: { label: "Look in the shop", to: 'shop' },
      },
      middle: {
        title: "Needs vs Wants",
        blurb: "Tell the must-haves from the nice-to-haves.",
        pages: [
          { heading: "What is a need?", body: "A need is something you cannot do without: food, water, a safe home, clothes and health care. Grown-ups make sure these get paid for first.", art: 'needs-wants' },
          { heading: "What is a want?", body: "A want is something that makes life more fun but you could live without, like a video game, a new toy or a movie ticket. Wants are fine. The trick is knowing which is which." },
          { heading: "The tricky middle", body: "Shoes are a need. Sparkly light-up shoes that cost twice as much are partly a want. When you shop, ask yourself: do I need this, or do I want this?" },
          { heading: "Try it in the shop", body: "Everything in your family Shop is a want, and that is the fun part. Since your needs are already taken care of, you get to choose which wants are worth your coins." },
        ],
        quiz: [
          {
            prompt: "Which of these is a need?",
            choices: ["A new video game", "A movie ticket", "A healthy dinner"],
            answer: 2,
            why: "Food keeps you healthy and growing, so it is a need.",
          },
          {
            prompt: "Plain sneakers cost $30 and light-up sneakers cost $60. What part of the $60 pair is a want?",
            choices: ["The extra $30 for the lights", "All $60", "None of it"],
            answer: 0,
            why: "You need shoes, so $30 covers the need, and the extra $30 pays for the fun lights.",
          },
          {
            prompt: "What should a family pay for first?",
            choices: ["Toys", "Needs like food and a home", "Treats"],
            answer: 1,
            why: "Needs come first, then extra money can go to wants.",
          },
        ],
        tryIt: { label: "Browse the shop", to: 'shop' },
      },
      teen: {
        title: "Needs, Wants and In-Between",
        blurb: "Sorting spending when the line gets blurry.",
        pages: [
          { heading: "The basic split", body: "Needs are what you must have to live safely and do your responsibilities: food, housing, basic clothing, health care and getting to school or work. Wants are everything that makes life more enjoyable on top of that.", art: 'needs-wants' },
          { heading: "It is a spectrum", body: "Many purchases mix both. Getting to school is a need, but a ride share when the bus works is a want. A phone may be a need for staying in touch, while the newest model is a want. Splitting the cost helps: the basic version is the need, the upgrade is the want." },
          { heading: "Watch for want creep", body: "Ads and friends can make wants feel like needs. A good check is to wait a day or two before buying. If you still want it and can afford it, great. If the feeling fades, you just saved money." },
          { heading: "Wants are allowed", body: "Spending on wants is not bad. A good plan covers needs first, sets some money aside, and then lets you enjoy wants without guilt." },
        ],
        quiz: [
          {
            prompt: "A basic phone plan costs $15 a month and the premium plan costs $40. How much of the premium plan is a want?",
            choices: ["$40", "$15", "$55", "$25"],
            answer: 3,
            why: "The $15 basic plan covers the need, so the extra $25 is the want.",
          },
          {
            prompt: "What is a good way to check if a want is worth it?",
            choices: ["Buy it right away before it sells out", "Wait a day or two and see if you still want it", "Ask what your friends bought"],
            answer: 1,
            why: "Waiting lets the excitement settle so you can decide with a clear head.",
          },
          {
            prompt: "Which statement is true?",
            choices: ["Spending on wants is always a mistake", "Needs and wants never overlap", "A good plan covers needs first, then leaves room for wants"],
            answer: 2,
            why: "Wants are fine once needs and savings are taken care of.",
          },
        ],
        tryIt: { label: "Browse the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- save
  {
    id: 'save',
    art: 'save',
    category: 'saving',
    versions: {
      little: {
        title: "Saving Up",
        blurb: "Wait a little, get something bigger.",
        pages: [
          { heading: "What is saving?", body: "Saving means keeping some coins instead of spending them all right now.", art: 'save' },
          { heading: "Small now or big later", body: "You could buy a small sticker today. Or you could save, and later buy a big toy you really love." },
          { heading: "Pick a dream", body: "A dream goal is something big you save for. Each coin you add gets you closer!" },
        ],
        quiz: [
          {
            prompt: "What does saving mean?",
            choices: ["Spending all your coins", "Keeping some coins for later"],
            answer: 1,
            why: "Saving is keeping coins now so you can use them later.",
          },
          {
            prompt: "Why might you save your coins?",
            choices: ["To buy something big later", "To lose them", "So nobody can see them"],
            answer: 0,
            why: "Saving helps you buy bigger things you really want.",
          },
        ],
        tryIt: { label: "Pick a dream goal", to: 'goal' },
      },
      middle: {
        title: "Saving for a Goal",
        blurb: "How waiting helps you get what you really want.",
        pages: [
          { heading: "Spend now or save for later", body: "Every time you get coins, you have a choice. You can spend them now on something small, or save them for something bigger. Saving means waiting, and waiting can be worth it.", art: 'save' },
          { heading: "Make a plan", body: "Say you want a $30 skateboard and you earn about $5 a week. If you save all of it, $30 divided by $5 is 6 weeks. Knowing the number makes the wait feel shorter." },
          { heading: "Use a dream goal", body: "In Kid Kapital you can set a dream goal. It is like a jar with your goal's name on it. Watching it fill up helps you stick with your plan." },
          { heading: "When it is hard to wait", body: "Everyone feels tempted to spend. Try saving part of your coins, like half, and spending the rest. You still reach your goal, just a little slower." },
        ],
        quiz: [
          {
            prompt: "You want a $20 kite and save $4 a week. How many weeks will it take?",
            choices: ["4 weeks", "5 weeks", "6 weeks"],
            answer: 1,
            why: "$20 divided by $4 a week is 5 weeks.",
          },
          {
            prompt: "What is a dream goal in Kid Kapital?",
            choices: ["A quest", "A shop item", "A savings jar for something big"],
            answer: 2,
            why: "A dream goal is a jar where you save up for something special.",
          },
          {
            prompt: "If you save half your coins instead of all of them, what happens?",
            choices: ["You still reach your goal, just slower", "You can never reach your goal", "You reach it faster"],
            answer: 0,
            why: "Saving less each week still gets you there, it just takes more weeks.",
          },
        ],
        tryIt: { label: "Set a dream goal", to: 'goal' },
      },
      teen: {
        title: "Saving and Goals",
        blurb: "Delayed gratification and a plan that works.",
        pages: [
          { heading: "Delayed gratification", body: "Delayed gratification means choosing a bigger reward later over a smaller one now. It is one of the most useful money skills there is, because almost every big goal needs it.", art: 'save' },
          { heading: "Make goals specific", body: "\"Save more\" is hard to stick to. \"Save $240 for headphones in 12 weeks\" is easy to check: $240 divided by 12 weeks is $20 a week. A clear amount and a date turn a wish into a plan." },
          { heading: "Pay yourself first", body: "Move your savings as soon as you earn, before you spend anything. If savings only gets what is left over, there is often nothing left. In Kid Kapital, put coins in your dream goal or piggy bank right after a quest pays." },
          { heading: "Short-term vs long-term", body: "A short-term goal is weeks or months away, like headphones. A long-term goal is years away, like a car or college. Long-term money has time to grow with interest, which the interest lesson covers." },
        ],
        quiz: [
          {
            prompt: "You want $180 in 9 weeks. How much should you save each week?",
            choices: ["$18", "$20", "$25", "$9"],
            answer: 1,
            why: "$180 divided by 9 weeks is $20 a week.",
          },
          {
            prompt: "What does pay yourself first mean?",
            choices: ["Buy something for yourself every payday", "Spend first, then save what is left", "Move money to savings as soon as you earn it"],
            answer: 2,
            why: "Saving first means your goal gets funded before spending can eat it up.",
          },
          {
            prompt: "Which goal is the most specific?",
            choices: ["Save $150 for a bike by June", "Save more money", "Spend less this year"],
            answer: 0,
            why: "It has an amount and a date, so you can check your progress.",
          },
        ],
        tryIt: { label: "Set a dream goal", to: 'goal' },
      },
    },
  },

  // ---------------------------------------------------------------- budget
  {
    id: 'budget',
    art: 'budget',
    category: 'planning',
    versions: {
      little: {
        title: "Spend, Save, Give",
        blurb: "Three jars for your coins.",
        pages: [
          { heading: "Three jars", body: "Picture three jars: Spend, Save and Give. When you get coins, put some in each one.", art: 'budget' },
          { heading: "What each jar is for", body: "Spend is for treats now. Save is for something big later. Give is for helping others." },
        ],
        quiz: [
          {
            prompt: "Which jar is for something big later?",
            choices: ["Spend", "Save", "Give"],
            answer: 1,
            why: "The Save jar holds coins for something big you want later.",
          },
          {
            prompt: "What is the Give jar for?",
            choices: ["Helping others", "Buying candy"],
            answer: 0,
            why: "The Give jar is for sharing with people who need help.",
          },
        ],
        tryIt: { label: "Visit your piggy bank", to: 'grow' },
      },
      middle: {
        title: "Make a Money Plan",
        blurb: "Tell your coins where to go before you spend.",
        pages: [
          { heading: "What is a budget?", body: "A budget is a plan for your money. Instead of wondering where your coins went, you decide ahead of time where they will go.", art: 'budget' },
          { heading: "Split it up", body: "Say you earn $10 this week. You could plan $6 to spend, $3 to save and $1 to give. That adds up to $10, so every coin has a job." },
          { heading: "Check how it went", body: "At the end of the week, look back. Did you stick to the plan? If you spent more than planned, that is okay. Just adjust next week." },
          { heading: "Your Kid Kapital jars", body: "Your Wallet is for spending in the Shop. Your piggy bank and dream goal are for saving. Moving coins into them is your budget in action." },
        ],
        quiz: [
          {
            prompt: "What is a budget?",
            choices: ["A list of toys", "A plan for your money", "A kind of bank"],
            answer: 1,
            why: "A budget is a plan for where your money will go.",
          },
          {
            prompt: "You earn $10 and plan $5 to spend and $1 to give. How much is left to save?",
            choices: ["$4", "$5", "$6"],
            answer: 0,
            why: "$10 minus $5 minus $1 leaves $4 to save.",
          },
          {
            prompt: "What should you do if you go over your plan one week?",
            choices: ["Give up on budgets", "Hide it", "Adjust your plan next week"],
            answer: 2,
            why: "Budgets get better with practice, so just adjust and keep going.",
          },
        ],
        tryIt: { label: "Move coins to savings", to: 'grow' },
      },
      teen: {
        title: "Building a Budget",
        blurb: "One simple way to plan: 50/30/20.",
        pages: [
          { heading: "A budget is a plan", body: "A budget lists the money coming in and decides where it goes: needs, wants and savings. It is not about saying no to everything. It is about choosing on purpose.", art: 'budget' },
          { heading: "The 50/30/20 idea", body: "One popular approach splits money after taxes into 50% for needs, 30% for wants and 20% for savings or paying down debt. It is a starting point, not a rule. Many people adjust the numbers to fit their life." },
          { heading: "Worked example", body: "Say you bring home $200 a month. 50% for needs is $100, 30% for wants is $60, and 20% for savings is $40. Check: $100 + $60 + $40 = $200. As a teen, your family may cover most needs, so you might save more than 20%." },
          { heading: "Track and adjust", body: "Write down what you actually spend for a few weeks and compare it to the plan. Small, frequent purchases are the usual surprise. Adjust the plan to match reality, then nudge it toward your goals." },
        ],
        quiz: [
          {
            prompt: "With 50/30/20, how much of $300 goes to savings?",
            choices: ["$30", "$90", "$60", "$150"],
            answer: 2,
            why: "20% of $300 is $60.",
          },
          {
            prompt: "In 50/30/20, what does the 30 stand for?",
            choices: ["Wants", "Needs", "Savings"],
            answer: 0,
            why: "30% is for wants, 50% for needs and 20% for savings.",
          },
          {
            prompt: "What is the best description of 50/30/20?",
            choices: ["A law everyone must follow", "A starting point you can adjust", "Only for adults with big salaries"],
            answer: 1,
            why: "It is one helpful approach, and you can change the numbers to fit your situation.",
          },
        ],
        tryIt: { label: "Plan your savings", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- give
  {
    id: 'give',
    art: 'give',
    category: 'basics',
    versions: {
      little: {
        title: "Sharing and Giving",
        blurb: "Giving feels good and helps others.",
        pages: [
          { heading: "What is giving?", body: "Giving means sharing what you have to help someone else.", art: 'give' },
          { heading: "Many ways to give", body: "You can give coins, a toy you have outgrown, or your time, like helping a brother or sister." },
          { heading: "Helper points", body: "When you help a sibling, you can earn helper points. Helping is a kind of giving!" },
        ],
        quiz: [
          {
            prompt: "Which one is a way to give?",
            choices: ["Keeping all your toys", "Helping your sister clean up"],
            answer: 1,
            why: "Helping someone is a kind and generous way to give.",
          },
          {
            prompt: "Can you give without money?",
            choices: ["Yes, you can give time and help", "No, only money counts"],
            answer: 0,
            why: "Your time and kindness are gifts too.",
          },
        ],
        tryIt: { label: "Find a quest to help", to: 'quests' },
      },
      middle: {
        title: "The Power of Giving",
        blurb: "How sharing helps your community.",
        pages: [
          { heading: "Why people give", body: "Giving means using some of your money, time or things to help others. People give to help animals, feed families, protect nature and more. It also feels good.", art: 'give' },
          { heading: "What is a charity?", body: "A charity is a group whose job is to help people or causes. When you give to a charity, they use the money to do that work, like buying food for a food bank." },
          { heading: "A little adds up", body: "If you give $1 out of every $10 you earn, that is 10%. Over 10 weeks of earning $10, you would have given $10. When lots of people give a little, it adds up to a lot." },
          { heading: "Give your time too", body: "Helping a sibling with a chore, donating old toys or making a card for a neighbor are all giving. In Kid Kapital, helping a sibling even earns helper points." },
        ],
        quiz: [
          {
            prompt: "What is a charity?",
            choices: ["A store", "A group that helps people or causes", "A kind of game"],
            answer: 1,
            why: "Charities use donations to help people, animals and causes.",
          },
          {
            prompt: "You earn $20 and give 10%. How much do you give?",
            choices: ["$10", "$1", "$2"],
            answer: 2,
            why: "10% of $20 is $2.",
          },
          {
            prompt: "Which of these is giving without money?",
            choices: ["Donating toys you have outgrown", "Buying a snack for yourself", "Saving coins in your piggy"],
            answer: 0,
            why: "Donating toys shares what you have with someone who can use it.",
          },
        ],
        tryIt: { label: "Help out with a quest", to: 'quests' },
      },
      teen: {
        title: "Giving With Purpose",
        blurb: "Make your generosity count.",
        pages: [
          { heading: "Giving is part of a plan", body: "Many people build giving into their budget, just like saving. Deciding ahead of time means you give on purpose instead of only when someone asks.", art: 'give' },
          { heading: "Choose a cause", body: "Think about what matters to you: animals, hunger, the environment, your school. Then look up groups that work on it. A good charity is clear about what it does and how it uses donations." },
          { heading: "Do the math", body: "Say you earn $50 a month and decide to give 5%. That is $2.50 a month, or $30 over a year. Pick a percentage that feels right. Any amount, given regularly, makes a difference." },
          { heading: "Time and skills count", body: "Volunteering, tutoring a younger kid or helping a neighbor are real gifts. Sometimes your time is worth more to a cause than a small donation." },
        ],
        quiz: [
          {
            prompt: "You earn $50 a month and give 5%. How much do you give in a year?",
            choices: ["$2.50", "$25", "$30", "$60"],
            answer: 2,
            why: "5% of $50 is $2.50 a month, and $2.50 x 12 months is $30.",
          },
          {
            prompt: "What is a sign of a trustworthy charity?",
            choices: ["It is clear about what it does with donations", "It asks you to pay with a gift card", "It pressures you to give right now"],
            answer: 0,
            why: "Good charities are open about how they use money, and never pressure you.",
          },
          {
            prompt: "Why might someone plan giving in their budget?",
            choices: ["So they never give", "So they give on purpose and regularly", "Because it is required by law"],
            answer: 1,
            why: "Planning makes giving steady and intentional instead of random.",
          },
        ],
        tryIt: { label: "Find a way to help", to: 'quests' },
      },
    },
  },

  // ---------------------------------------------------------------- choice
  {
    id: 'choice',
    art: 'choice',
    category: 'economy',
    versions: {
      little: {
        title: "Choosing",
        blurb: "When you pick one thing, you skip another.",
        pages: [
          { heading: "You can't have everything", body: "You have 5 coins. A ball costs 5 coins, and a book costs 5 coins.", art: 'choice' },
          { heading: "Pick one", body: "If you buy the ball, you can't buy the book too. Choosing one means saying no to the other." },
          { heading: "Choose what you love most", body: "So think: which one would make you happiest? Then pick it!" },
        ],
        quiz: [
          {
            prompt: "You have 5 coins. The ball and the book each cost 5. You buy the ball. What happens?",
            choices: ["You get both", "You can't buy the book now"],
            answer: 1,
            why: "Your coins went to the ball, so there are none left for the book.",
          },
          {
            prompt: "What is a good way to choose?",
            choices: ["Pick the one you love most", "Pick without thinking", "Pick the one your friend has"],
            answer: 0,
            why: "Thinking about what you really want helps you make a happy choice.",
          },
        ],
        tryIt: { label: "Look in the shop", to: 'shop' },
      },
      middle: {
        title: "Every Choice Has a Cost",
        blurb: "What you give up when you choose.",
        pages: [
          { heading: "Money can only be spent once", body: "You have $10. A new game costs $10 and a soccer ball costs $10. If you buy the game, you can't also buy the ball with that money.", art: 'choice' },
          { heading: "The thing you give up", body: "The soccer ball is what the game really cost you. Economists call this opportunity cost: the next best thing you gave up when you chose." },
          { heading: "Time works this way too", body: "If you spend Saturday afternoon at the park, you can't spend it doing a quest for coins. Both are fine choices, but each one means giving up the other." },
          { heading: "Think before you choose", body: "Before you buy something, ask: what else could I do with these coins? If the thing you are buying still wins, go for it." },
        ],
        quiz: [
          {
            prompt: "You have $8. You buy a book for $8 instead of a puzzle for $8. What is the opportunity cost?",
            choices: ["The book", "Nothing", "The puzzle"],
            answer: 2,
            why: "The puzzle is the next best thing you gave up to get the book.",
          },
          {
            prompt: "What does opportunity cost mean?",
            choices: ["The price tag", "The next best thing you give up", "A sale at the store"],
            answer: 1,
            why: "Opportunity cost is what you give up when you choose something else.",
          },
          {
            prompt: "Can time have an opportunity cost?",
            choices: ["Yes, time spent on one thing can't be spent on another", "No, only money", "Only on weekends"],
            answer: 0,
            why: "Time is limited like money, so choosing one activity means skipping another.",
          },
        ],
        tryIt: { label: "Compare shop rewards", to: 'shop' },
      },
      teen: {
        title: "Opportunity Cost",
        blurb: "The hidden price of every decision.",
        pages: [
          { heading: "Scarcity", body: "Money and time are scarce: you have a limited amount of each. That means every choice to use them one way is also a choice not to use them another way.", art: 'choice' },
          { heading: "Opportunity cost", body: "Opportunity cost is the value of the next best alternative you give up. Not every alternative, just the best one you passed on. If you choose a $60 concert over a $60 jacket and a $60 game, and the game was your second choice, the game is your opportunity cost." },
          { heading: "Money that could grow", body: "Spending also has a growth cost. Say $50 sits in your piggy at 2% a week. After one week it earns $1. Spend it instead, and that $1, plus the interest it would have earned later, is part of what you gave up." },
          { heading: "Thinking at the margin", body: "Good decisions compare the extra benefit of one more of something to its extra cost. A second slice of pizza is worth less to you than the first. Ask whether the next unit is worth it, not whether the whole category is." },
        ],
        quiz: [
          {
            prompt: "You rank three options: concert first, game second, jacket third. You choose the concert. What is your opportunity cost?",
            choices: ["The jacket", "The game", "The game and the jacket", "Nothing"],
            answer: 1,
            why: "Opportunity cost is only the next best alternative, which is the game.",
          },
          {
            prompt: "$50 in a piggy bank earns 2% a week. What does one week of interest come to?",
            choices: ["$0.50", "$2", "$1", "$5"],
            answer: 2,
            why: "2% of $50 is $1.",
          },
          {
            prompt: "Why do choices have opportunity costs at all?",
            choices: ["Because time and money are limited", "Because stores raise prices", "Because of taxes"],
            answer: 0,
            why: "Scarcity means using a resource one way rules out other uses.",
          },
        ],
        tryIt: { label: "Weigh it in the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- interest
  {
    id: 'interest',
    art: 'interest',
    category: 'saving',
    versions: {
      little: {
        title: "The Piggy Bonus",
        blurb: "Your piggy gives you a tiny bonus for waiting.",
        pages: [
          { heading: "A thank-you from your piggy", body: "When you keep coins in your piggy bank, it gives you a tiny bonus every week.", art: 'interest' },
          { heading: "Waiting pays", body: "The longer your coins stay, the more bonuses you get. That bonus is called interest." },
        ],
        quiz: [
          {
            prompt: "What does your piggy bank give you for waiting?",
            choices: ["A tiny bonus", "Nothing", "A chore"],
            answer: 0,
            why: "Your piggy adds a little interest each week your coins stay inside.",
          },
          {
            prompt: "When do you get more bonuses?",
            choices: ["If you take coins out fast", "If you keep coins in longer"],
            answer: 1,
            why: "Each week your coins stay in, they earn another bonus.",
          },
        ],
        tryIt: { label: "See your piggy bank grow", to: 'grow' },
      },
      middle: {
        title: "How Interest Works",
        blurb: "Money that grows while you wait.",
        pages: [
          { heading: "Money that earns money", body: "Interest is extra money you get for keeping money saved. Banks pay interest to savers, and your Kid Kapital piggy bank does too, every week.", art: 'interest' },
          { heading: "A percent each week", body: "Your family sets the piggy's rate, like 2% a week. 2% means 2 cents for every dollar. So $50 in the piggy earns $1 in one week." },
          { heading: "Interest on interest", body: "Next week, your piggy has $51, so it earns 2% of $51, which is a little more than $1. The interest you earned starts earning interest too. That is why savings grow faster the longer you wait." },
          { heading: "You can always take it out", body: "Your piggy money is still yours. You can take it out whenever you need it. But every week it stays in, it gets a little bonus." },
        ],
        quiz: [
          {
            prompt: "Your piggy pays 2% a week. How much does $100 earn in one week?",
            choices: ["$1", "$20", "$2"],
            answer: 2,
            why: "2% means 2 cents per dollar, so $100 earns $2.",
          },
          {
            prompt: "What is interest?",
            choices: ["Extra money for keeping money saved", "A fee for buying things", "A kind of chore"],
            answer: 0,
            why: "Interest is a reward for letting your money stay saved.",
          },
          {
            prompt: "Why does the second week's interest come out a little bigger?",
            choices: ["The rate went up", "You earn interest on last week's interest too", "Someone added extra by mistake"],
            answer: 1,
            why: "Your balance grew, so the same percent gives a slightly bigger bonus.",
          },
        ],
        tryIt: { label: "See your piggy bank grow", to: 'grow' },
      },
      teen: {
        title: "Compound Interest",
        blurb: "Why time is a saver's best friend.",
        pages: [
          { heading: "Simple vs compound", body: "Simple interest pays only on the money you put in. Compound interest pays on your money plus all the interest already earned. Over time, compounding pulls ahead, and the gap keeps widening.", art: 'interest' },
          { heading: "Worked example", body: "Put $100 in a piggy that pays 2% a week. Week 1: $100 x 1.02 = $102.00. Week 2: $102 x 1.02 = $104.04. Week 3: $106.12. Week 4: $108.24. With simple interest you would have $108.00, so compounding has already added 24 cents." },
          { heading: "Give it time", body: "After 10 weeks, simple interest gives $120.00, while compounding gives about $121.90. The formula is: amount = start x (1 + rate) ^ periods. So 10 weeks is $100 x 1.02^10, which is about $121.90." },
          { heading: "The Rule of 72", body: "A quick way to estimate doubling time: divide 72 by the rate. At 2% a week, 72 / 2 = 36, so your money roughly doubles in about 36 weeks. It is an estimate, and the exact answer is about 35 weeks." },
          { heading: "Real-world rates", body: "Your family's piggy rate is set high so you can watch it work. Real savings accounts pay a yearly rate, usually far smaller than 2% a week. The math is the same, it just plays out over years instead of weeks, so starting early matters." },
        ],
        quiz: [
          {
            prompt: "$200 earns 2% compounded weekly. How much is there after 2 weeks?",
            choices: ["$204.00", "$204.04", "$208.00", "$208.08"],
            answer: 3,
            why: "$200 x 1.02 = $204, then $204 x 1.02 = $208.08.",
          },
          {
            prompt: "What makes compound interest different from simple interest?",
            choices: ["It only works on big amounts", "It pays a lower rate", "It pays interest on past interest too", "It is paid once at the end"],
            answer: 2,
            why: "Compounding adds interest to the balance, so future interest is figured on a bigger number.",
          },
          {
            prompt: "Using the Rule of 72, about how long does money take to double at 6% a year?",
            choices: ["12 years", "6 years", "72 years"],
            answer: 0,
            why: "72 divided by 6 is 12, so about 12 years.",
          },
          {
            prompt: "Why does starting to save early help so much?",
            choices: ["Banks pay kids more", "Compounding has more time to build", "Early money is worth more coins"],
            answer: 1,
            why: "The longer money compounds, the faster it grows on itself.",
          },
        ],
        tryIt: { label: "Watch your piggy compound", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- risk
  {
    id: 'risk',
    art: 'risk',
    category: 'investing',
    versions: {
      middle: {
        title: "Risk and Reward",
        blurb: "Why the rocket goes up and down.",
        pages: [
          { heading: "Two ways to grow", body: "Your piggy bank grows a little bit every week, always. Your rocket fund is different: some weeks it goes up a lot, and some weeks it goes down.", art: 'risk' },
          { heading: "What is risk?", body: "Risk means you don't know for sure what will happen. The rocket might jump up 12% one week and drop 8% the next. That is the risk." },
          { heading: "Why take a risk?", body: "Over many weeks, the rocket might end up ahead of the piggy, or behind it. Nobody knows ahead of time. The chance of a bigger reward is why people take risks, and the chance of a loss is the price." },
          { heading: "Play it smart", body: "Only put coins in the rocket that you won't need soon. If you are saving for something next week, keep it in the piggy or your goal, where it can't drop." },
        ],
        quiz: [
          {
            prompt: "Which one can go down in a week?",
            choices: ["The piggy bank", "The rocket fund", "Neither one"],
            answer: 1,
            why: "The rocket moves up and down, while the piggy grows steadily.",
          },
          {
            prompt: "You have $50 in the rocket and it drops 10% this week. How much is left?",
            choices: ["$40", "$49", "$45"],
            answer: 2,
            why: "10% of $50 is $5, and $50 minus $5 is $45.",
          },
          {
            prompt: "You need your coins next week for a shop reward. Where should they go?",
            choices: ["The piggy bank or your wallet", "The rocket fund", "Split them with a friend"],
            answer: 0,
            why: "Money you need soon should stay somewhere it can't drop.",
          },
        ],
        tryIt: { label: "Check on your rocket", to: 'grow' },
      },
      teen: {
        title: "Risk, Reward, Diversify",
        blurb: "Investing basics with your rocket fund.",
        pages: [
          { heading: "Risk and return", body: "In investing, return is how much your money grows, and risk is how much that growth can swing. Safer choices, like a savings account, usually grow slowly and steadily. Riskier choices, like stocks, can grow more over time but can also drop.", art: 'risk' },
          { heading: "Ups and downs", body: "Your rocket's range might be -8% to +12% a week. Start with $100. A +12% week makes it $112. A -8% week after that makes it $112 x 0.92 = $103.04. You might expect +12% and -8% to make +4%, but you end up only +3.04%, because the 8% drop comes out of the bigger $112." },
          { heading: "Diversification", body: "Diversifying means spreading money across different places so one bad result hurts less. Put $50 in the piggy at 2% and $50 in the rocket. In a -8% week the rocket loses $4 and the piggy gains $1, so you are down $3 total instead of $8 with everything in the rocket. In a +12% week you gain $7 instead of $12. Less risk, less reward." },
          { heading: "Time horizon", body: "Never put money you need soon into something risky. If you need it next month and it just dropped, you have to sell low. Money you won't need for a long time can ride out the dips." },
        ],
        quiz: [
          {
            prompt: "$100 in the rocket goes +12% then -8%. What is it worth?",
            choices: ["$104.00", "$100.00", "$103.04", "$96.00"],
            answer: 2,
            why: "$100 x 1.12 = $112, then $112 x 0.92 = $103.04.",
          },
          {
            prompt: "What is diversification?",
            choices: ["Spreading money across different places", "Putting everything in the riskiest choice", "Taking all your money out", "Only saving in cash"],
            answer: 0,
            why: "Spreading money out means one bad result can't sink everything.",
          },
          {
            prompt: "$50 is in the piggy at 2% and $50 in the rocket. The rocket drops 8%. What is your total change?",
            choices: ["-$8", "-$3", "-$4", "+$1"],
            answer: 1,
            why: "The rocket loses $4 and the piggy gains $1, so the total is -$3.",
          },
          {
            prompt: "You need $40 for a trip in two weeks. Where does it belong?",
            choices: ["In the rocket for a quick boost", "Somewhere steady, like the piggy", "Half in the rocket, half spent now"],
            answer: 1,
            why: "Money you need soon should not be exposed to a drop right before you need it.",
          },
        ],
        tryIt: { label: "Check on your rocket", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- supply-demand
  {
    id: 'supply-demand',
    art: 'supply-demand',
    category: 'economy',
    versions: {
      middle: {
        title: "The Lemonade Stand",
        blurb: "Why prices go up and down.",
        pages: [
          { heading: "Opening day", body: "Mia opens a lemonade stand and charges $1 a cup. She makes 20 cups. On a mild day, about 20 people want one, so she sells out right at closing time.", art: 'supply-demand' },
          { heading: "A hot day", body: "The next day is super hot. Lots more people want lemonade, but Mia still has only 20 cups. When lots of people want something and there isn't much of it, the price can go up. Mia could charge $2 and still sell out." },
          { heading: "A rainy day", body: "On a rainy day, few people want lemonade. If Mia keeps the price at $1, she might have leftover cups. Lowering the price to 50 cents could help her sell them." },
          { heading: "Supply and demand", body: "Supply is how much of something there is. Demand is how much people want it. When demand goes up or supply goes down, prices tend to rise. When demand drops or supply grows, prices tend to fall." },
        ],
        quiz: [
          {
            prompt: "On a hot day, more people want lemonade. What can happen to the price?",
            choices: ["It goes down", "It stays at zero", "It goes up"],
            answer: 2,
            why: "When lots of people want something, sellers can charge more.",
          },
          {
            prompt: "What does demand mean?",
            choices: ["How much people want something", "How much of something there is", "How much it costs to make"],
            answer: 0,
            why: "Demand is how much people want to buy something.",
          },
          {
            prompt: "Mia has lots of leftover cups on a rainy day. What might she do?",
            choices: ["Raise the price", "Lower the price", "Make more cups"],
            answer: 1,
            why: "Lowering the price can help sell extra cups when few people want them.",
          },
        ],
      },
      teen: {
        title: "Supply and Demand",
        blurb: "How markets set prices.",
        pages: [
          { heading: "Two forces", body: "Supply is how much sellers are willing to sell at each price. Demand is how much buyers want to buy at each price. Usually, higher prices mean sellers want to sell more and buyers want to buy less.", art: 'supply-demand' },
          { heading: "Finding the price", body: "The market price tends to settle where the amount people want to buy matches the amount sellers want to sell. Economists call this the equilibrium price. Charge more and you get leftovers, a surplus. Charge less and you run out, a shortage." },
          { heading: "Lemonade example", body: "Say at $1 a cup, 30 people want lemonade but you can only make 20 cups. That is a shortage of 10 cups, a sign your price is low. At $1.50, maybe only 20 people want a cup, matching your supply. That is close to equilibrium." },
          { heading: "When things shift", body: "If a frost ruins a lemon crop, lemons get scarce and cost more. Your costs rise, supply drops, and lemonade prices tend to go up. If a new stand opens next door, supply grows and prices tend to fall. Concert tickets, sneakers and video game consoles all follow these same forces." },
        ],
        quiz: [
          {
            prompt: "At $1, 30 people want lemonade but you have only 20 cups. What is this called?",
            choices: ["A surplus", "Equilibrium", "A shortage", "Inflation"],
            answer: 2,
            why: "When buyers want more than sellers have at a price, that is a shortage.",
          },
          {
            prompt: "A frost destroys half the lemon crop. What likely happens to lemon prices?",
            choices: ["They go up", "They go down", "They stay the same"],
            answer: 0,
            why: "Less supply with the same demand usually pushes prices up.",
          },
          {
            prompt: "What is the equilibrium price?",
            choices: ["The lowest possible price", "The price where the amount wanted matches the amount offered", "The price set by the government", "The price on the first day"],
            answer: 1,
            why: "Equilibrium is where buyers and sellers want the same amount.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- inflation
  {
    id: 'inflation',
    art: 'inflation',
    category: 'economy',
    versions: {
      middle: {
        title: "Why Prices Go Up",
        blurb: "The same coins buy a little less over time.",
        pages: [
          { heading: "Prices change", body: "Ask a grown-up what a candy bar cost when they were your age. It was probably less than today. Over time, most prices slowly go up. This is called inflation.", art: 'inflation' },
          { heading: "What it means for you", body: "Say a toy costs $10 today. If prices go up 3% in a year, next year the same toy costs $10.30. Your $10 bill didn't change, but it buys a little less." },
          { heading: "Growing beats sitting still", body: "Coins hidden in a drawer stay the same while prices rise. Coins in a piggy bank that earns interest grow, so they can keep up. That is one big reason to save in an account that grows." },
        ],
        quiz: [
          {
            prompt: "What is inflation?",
            choices: ["When prices go down", "When prices slowly go up over time", "When you save money"],
            answer: 1,
            why: "Inflation means prices rise, so money buys a bit less over time.",
          },
          {
            prompt: "A $20 game goes up 10% in price. What does it cost now?",
            choices: ["$22", "$30", "$21"],
            answer: 0,
            why: "10% of $20 is $2, so the new price is $22.",
          },
          {
            prompt: "Where do savings keep up with rising prices better?",
            choices: ["In a drawer", "Under the bed", "In an account that earns interest"],
            answer: 2,
            why: "Interest helps your money grow so it keeps its buying power.",
          },
        ],
        tryIt: { label: "Grow your savings", to: 'grow' },
      },
      teen: {
        title: "Inflation",
        blurb: "Why your money's buying power shrinks.",
        pages: [
          { heading: "Rising prices", body: "Inflation is the general rise in prices over time. When there is inflation, each dollar buys a little less than before. Economists say the purchasing power of money goes down.", art: 'inflation' },
          { heading: "It compounds too", body: "Inflation compounds like interest, just in the wrong direction for your cash. As an example, at 3% a year, a $100 item costs $103 after one year, $106.09 after two and about $109.27 after three. Using the Rule of 72, prices at 3% roughly double in about 24 years." },
          { heading: "Real return", body: "What matters is how fast your money grows compared to prices. If your savings earn 1% a year and prices rise 3%, your real return is about -2%: you have more dollars, but they buy less. If savings earn 5% and inflation is 3%, your real return is about +2%." },
          { heading: "What to do about it", body: "Cash in a drawer loses buying power every year there is inflation. Saving in accounts that pay interest, and investing long-term money, helps your money keep up. Money you need soon still belongs somewhere safe, even if it grows slowly." },
        ],
        quiz: [
          {
            prompt: "Prices rise 3% a year. About what does a $100 item cost after 2 years?",
            choices: ["$103.00", "$106.00", "$109.00", "$106.09"],
            answer: 3,
            why: "$100 x 1.03 = $103, then $103 x 1.03 = $106.09.",
          },
          {
            prompt: "Savings earn 2% a year and inflation is 4%. What is the approximate real return?",
            choices: ["-2%", "+2%", "+6%", "0%"],
            answer: 0,
            why: "Real return is roughly the interest rate minus inflation: 2% - 4% = -2%.",
          },
          {
            prompt: "What does losing purchasing power mean?",
            choices: ["Your dollars disappear", "Each dollar buys less than before", "Stores stop taking cash"],
            answer: 1,
            why: "You keep the same dollars, but they cover less stuff as prices rise.",
          },
        ],
        tryIt: { label: "Grow your savings", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- bank
  {
    id: 'bank',
    art: 'bank',
    category: 'banking',
    versions: {
      middle: {
        title: "What Banks Do",
        blurb: "Keeping money safe, and lending it out.",
        pages: [
          { heading: "A safe place for money", body: "A bank is a business that keeps people's money safe. Instead of hiding cash at home, people put it in a bank account. The bank keeps track of every dollar.", art: 'bank' },
          { heading: "Banks pay you interest", body: "Banks don't just hold your money in a vault. They lend some of it to other people. To say thanks for using your money, they pay you interest, like your piggy bank does." },
          { heading: "Borrowing costs money", body: "When someone borrows from a bank, they pay it back plus extra. That extra is interest too, but this time you pay it. If you borrow $10 and must pay back $11, the loan cost you $1." },
          { heading: "How banks make money", body: "Banks charge borrowers more interest than they pay savers. The difference helps pay for the bank to run." },
        ],
        quiz: [
          {
            prompt: "You borrow $20 and pay back $22. How much interest did you pay?",
            choices: ["$20", "$2", "$22"],
            answer: 1,
            why: "$22 minus the $20 you borrowed is $2 of interest.",
          },
          {
            prompt: "Why does a bank pay you interest on your savings?",
            choices: ["It lends your money to others", "It is a gift for your birthday", "It is a mistake"],
            answer: 0,
            why: "The bank uses savings to make loans, so it pays savers for that.",
          },
          {
            prompt: "Who pays interest when someone takes a loan?",
            choices: ["The bank", "Nobody", "The person who borrowed"],
            answer: 2,
            why: "Borrowers pay interest as the cost of using someone else's money.",
          },
        ],
        tryIt: { label: "Visit your piggy bank", to: 'grow' },
      },
      teen: {
        title: "Banks, Loans and Credit",
        blurb: "Borrowing, APR, and building good credit.",
        pages: [
          { heading: "What banks do", body: "Banks take deposits and pay savers interest. They lend that money to borrowers, who pay a higher interest rate. Many countries also protect bank deposits up to a limit, which is part of why banks are a safer place for money than cash at home.", art: 'bank' },
          { heading: "APR", body: "APR, or annual percentage rate, is the yearly cost of borrowing as a percent. A card with 24% APR charges about 2% a month, since 24 / 12 = 2. Leave a $500 balance unpaid for one month and you would owe about $510." },
          { heading: "Credit cards are loans", body: "A credit card lets you buy now and pay later. Paying the full balance each month usually means no interest. Paying only the minimum lets interest pile up, and with compounding the debt can grow faster than people expect." },
          { heading: "Credit scores", body: "Lenders check your credit history to decide whether to lend to you and at what rate. Paying on time, borrowing only what you can repay and keeping balances low build good credit. Good credit can mean lower rates on things like car loans later." },
        ],
        quiz: [
          {
            prompt: "A card has 18% APR. About what is the monthly rate?",
            choices: ["18%", "6%", "1.5%", "0.18%"],
            answer: 2,
            why: "18% divided by 12 months is 1.5% a month.",
          },
          {
            prompt: "You owe $300 at 2% a month. About how much interest is added after one month?",
            choices: ["$6", "$2", "$60"],
            answer: 0,
            why: "2% of $300 is $6.",
          },
          {
            prompt: "Which habit builds good credit?",
            choices: ["Paying only the minimum forever", "Paying bills on time", "Opening many cards at once", "Borrowing as much as you can"],
            answer: 1,
            why: "On-time payments show lenders you are reliable.",
          },
          {
            prompt: "How do banks make money on loans?",
            choices: ["They print it", "They charge borrowers more interest than they pay savers", "They keep all deposits"],
            answer: 1,
            why: "The gap between loan rates and savings rates helps fund the bank.",
          },
        ],
        tryIt: { label: "Visit your piggy bank", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- taxes
  {
    id: 'taxes',
    art: 'taxes',
    category: 'economy',
    versions: {
      middle: {
        title: "What Taxes Pay For",
        blurb: "How we all chip in for things we share.",
        pages: [
          { heading: "Things we share", body: "Roads, parks, libraries, firefighters and public schools are things everyone uses. Nobody could pay for a whole road alone, so everyone chips in. That chip-in money is called taxes.", art: 'taxes' },
          { heading: "Sales tax", body: "In many places, when you buy something at a store, a little extra gets added at the register. That is sales tax. A $10 toy with 5% sales tax costs $10.50." },
          { heading: "Taxes on pay", body: "When grown-ups get paid at work, some of their pay goes to taxes before they even get it. That money helps pay for things the whole community shares." },
        ],
        quiz: [
          {
            prompt: "Which of these do taxes help pay for?",
            choices: ["Your new video game", "Public parks and libraries", "Your friend's birthday party"],
            answer: 1,
            why: "Taxes pay for things everyone shares, like parks and libraries.",
          },
          {
            prompt: "A $20 item has 5% sales tax. What is the total?",
            choices: ["$25", "$20.50", "$21"],
            answer: 2,
            why: "5% of $20 is $1, so the total is $21.",
          },
          {
            prompt: "Why do we pay taxes?",
            choices: ["To share the cost of things we all use", "To make stores richer", "Because prices are too low"],
            answer: 0,
            why: "Everyone chipping in makes big shared things possible.",
          },
        ],
      },
      teen: {
        title: "Understanding Taxes",
        blurb: "Where tax money comes from and goes.",
        pages: [
          { heading: "Why taxes exist", body: "Governments collect taxes to pay for public goods and services: roads, schools, emergency services, parks, courts and programs that support people. Taxes are how a community shares those costs.", art: 'taxes' },
          { heading: "Kinds of taxes", body: "Income tax is taken from money you earn. Sales tax is added when you buy things. Property tax is paid on homes and land. Payroll taxes, taken from paychecks, often fund programs for retirees. Which taxes apply, and their rates, depend on where you live." },
          { heading: "Gross vs net pay", body: "Your gross pay is what you earned. Your net pay, or take-home pay, is what is left after taxes and other deductions. As an example, if you earn $200 and $30 is withheld, your net pay is $170. Budget with net pay, since that is what you can actually spend." },
          { heading: "Sales tax math", body: "Prices on shelves often don't include sales tax. A $40 jacket with 8% sales tax costs $40 + $3.20 = $43.20. Remember to add it when planning a purchase." },
        ],
        quiz: [
          {
            prompt: "You earn $250 and $40 is withheld for taxes. What is your net pay?",
            choices: ["$290", "$250", "$210", "$40"],
            answer: 2,
            why: "Net pay is gross pay minus deductions: $250 - $40 = $210.",
          },
          {
            prompt: "A $50 item has 6% sales tax. What is the total cost?",
            choices: ["$53", "$56", "$50.60"],
            answer: 0,
            why: "6% of $50 is $3, so the total is $53.",
          },
          {
            prompt: "Which amount should you build your budget around?",
            choices: ["Gross pay", "Net pay", "Your best month ever"],
            answer: 1,
            why: "Net pay is what actually reaches you, so it is what you can spend or save.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- scam
  {
    id: 'scam',
    art: 'scam',
    category: 'protection',
    versions: {
      middle: {
        title: "Staying Safe Online",
        blurb: "Spot tricks and keep your stuff safe.",
        pages: [
          { heading: "Some offers are tricks", body: "Online, you might see messages like \"Free game coins! Just click here!\" Some of these are tricks to steal your account or your family's money. If it sounds too good to be true, it probably is.", art: 'scam' },
          { heading: "Keep secrets secret", body: "Never share your password or PIN with anyone online, even if they say they are from a game company. Real companies never ask for your password." },
          { heading: "When in doubt, ask", body: "If a message asks you to click a link, download something, or type in a code, stop and show a grown-up first. Asking is always the smart move, and you will never be in trouble for checking." },
        ],
        quiz: [
          {
            prompt: "A message says \"Click here for 1,000 free game coins!\" What should you do?",
            choices: ["Click fast before it ends", "Share it with friends", "Don't click, and tell a grown-up"],
            answer: 2,
            why: "Offers that sound too good to be true are often tricks.",
          },
          {
            prompt: "Someone online says they work for your game and asks for your password. What should you do?",
            choices: ["Never share it", "Share it because they work there", "Share just half of it"],
            answer: 0,
            why: "Real companies never ask for your password, so keep it to yourself.",
          },
          {
            prompt: "Who should you ask if you are unsure about a message?",
            choices: ["The person who sent it", "A grown-up you trust", "Nobody"],
            answer: 1,
            why: "A trusted grown-up can help you check if something is safe.",
          },
        ],
      },
      teen: {
        title: "Spotting Scams",
        blurb: "Phishing, fake deals and how to stay safe.",
        pages: [
          { heading: "How scams work", body: "Scammers try to trick you into handing over money, passwords or personal info. They often pretend to be someone you trust, like a bank, a game company, a delivery service or even a friend whose account was hacked.", art: 'scam' },
          { heading: "Phishing", body: "Phishing is a fake message designed to get you to click a link or enter your login. Warning signs: urgency (\"Your account will be closed today!\"), links that don't match the real website, spelling mistakes, and requests for passwords or codes." },
          { heading: "Too good to be true", body: "Free money, huge prizes you never entered for, or investments that promise big guaranteed returns are classic scams. Real investments can't guarantee high returns, which is exactly why the rocket fund goes up and down." },
          { heading: "Never share codes", body: "Never share a password or a one-time verification code with anyone. A code texted to you is a key to your account, and real companies won't ask you to read it back. Also be suspicious of anyone who asks you to pay with gift cards." },
          { heading: "What to do", body: "Don't click, don't reply, don't pay. Go to the real website or app yourself instead of using the link. If you already clicked or shared something, tell a trusted adult and change your password right away. Acting fast limits the damage." },
        ],
        quiz: [
          {
            prompt: "A text says your account will be closed in 1 hour unless you log in through its link. What is this most likely?",
            choices: ["A helpful reminder", "Phishing", "A real deadline", "A prize notice"],
            answer: 1,
            why: "Urgent pressure plus a login link is a classic phishing sign.",
          },
          {
            prompt: "Someone messages you asking you to read back a code that was just texted to you. What should you do?",
            choices: ["Read it back quickly", "Send only half the code", "Never share it"],
            answer: 2,
            why: "Verification codes are keys to your account, so they are never shared.",
          },
          {
            prompt: "An app promises to double your money every week, guaranteed. What is the problem?",
            choices: ["Real investments can't guarantee big returns", "Nothing, it sounds great", "Doubling is too slow"],
            answer: 0,
            why: "Guaranteed big returns are a hallmark of investment scams.",
          },
          {
            prompt: "You clicked a suspicious link and typed your password. What is the best next step?",
            choices: ["Ignore it and hope", "Delete the app", "Wait a week to see what happens", "Change your password and tell a trusted adult"],
            answer: 3,
            why: "Acting quickly to secure your account limits what a scammer can do.",
          },
        ],
      },
    },
  },
];
