// Expansion pack A: money basics, earning and spending. Same rules as
// lessons-content.ts: plain text only, no em or en dashes, no emoji, every worked
// number double-checked. Example numbers are examples, never statistics.
import type { Lesson } from './learn';

export const PACK_A: Lesson[] = [
  // ---------------------------------------------------------------- what-is-money
  {
    id: 'what-is-money',
    art: 'money-basics',
    category: 'basics',
    versions: {
      little: {
        title: "What Is Money?",
        blurb: "Money helps us trade for the things we want.",
        pages: [
          { heading: "Money is for trading", body: "Money is something everyone agrees to trade with. You give the baker money, and the baker gives you bread.", art: 'money-basics' },
          { heading: "Money keeps", body: "A banana goes brown in a few days. Money does not go bad, so you can keep it and use it another day." },
          { heading: "Prices tell us how much", body: "Every thing has a price. A big bike costs more money than a small sticker." },
        ],
        quiz: [
          {
            prompt: "What can you do with money?",
            choices: ["Plant it in the garden", "Trade it for things you want"],
            answer: 1,
            why: "Money is for trading: you give money and get something back.",
          },
          {
            prompt: "Which one costs more money?",
            choices: ["A big bike", "A small sticker"],
            answer: 0,
            why: "Bigger things usually have a bigger price.",
          },
        ],
        tryIt: { label: "See prices in the shop", to: 'shop' },
      },
      middle: {
        title: "The Three Jobs of Money",
        blurb: "Trading, keeping and measuring, all in one.",
        pages: [
          { heading: "Job one: trading", body: "Money is something people agree to accept in a trade. A farmer takes money for apples because she knows she can spend it on shoes later. Without money, she would have to find a shoemaker who wants apples.", art: 'money-basics' },
          { heading: "Job two: keeping value", body: "Apples go bad in a few weeks, but a $5 bill still works next month. Money lets you hold on to what you earned until you are ready to use it. That is what lets you save." },
          { heading: "Job three: measuring", body: "Prices are written in money, so you can compare very different things. If a book costs $8 and a game costs $24, the game costs 3 times as much, because $24 divided by $8 is 3." },
          { heading: "Your coins do all three", body: "In Kid Kapital, you trade coins for rewards in the Shop, keep them in your Wallet or piggy bank, and use prices to see what each reward is worth." },
        ],
        quiz: [
          {
            prompt: "Why is money better than apples for saving?",
            choices: ["Apples are heavier", "Money does not go bad", "Money is always shiny"],
            answer: 1,
            why: "Money keeps its value for later, while apples spoil.",
          },
          {
            prompt: "A puzzle costs $6 and a board game costs $18. How many times as much is the board game?",
            choices: ["2 times", "12 times", "3 times"],
            answer: 2,
            why: "$18 divided by $6 is 3, so the board game costs 3 times as much.",
          },
          {
            prompt: "Which is one of money's jobs?",
            choices: ["Making trades easy", "Making food taste better", "Telling the time"],
            answer: 0,
            why: "Money makes trading easy because almost everyone accepts it.",
          },
        ],
        tryIt: { label: "Compare prices in the shop", to: 'shop' },
      },
      teen: {
        title: "The Functions of Money",
        blurb: "Medium of exchange, store of value, unit of account.",
        pages: [
          { heading: "Medium of exchange", body: "Money is anything people widely accept in exchange for goods and services. Because everyone takes it, you can sell your work to one person and spend the money with someone completely different.", art: 'money-basics' },
          { heading: "Store of value", body: "Money lets you move buying power from today to later. It is not perfect: inflation slowly shrinks what each dollar buys, which is why long-term savings belong somewhere that grows. Still, it keeps far better than milk or bread." },
          { heading: "Unit of account", body: "Money is a common measuring stick. Prices let you compare a $60 pair of sneakers to a $15 movie night: the sneakers cost 4 movie nights. If you earn $12 an hour, the sneakers also cost 5 hours of work, since $60 / $12 = 5." },
          { heading: "What makes good money", body: "Good money is durable, easy to carry, easy to split into small amounts, hard to fake and accepted by lots of people. Shells, salt and metal coins have all been used as money because they had some of these traits." },
          { heading: "Money runs on trust", body: "Most money today is not gold or even paper. It is mostly numbers in bank accounts. It works because people trust that others will accept it tomorrow. Your Kid Kapital coins work the same way: your family agrees on what they are worth." },
        ],
        quiz: [
          {
            prompt: "You compare a $45 jacket to a $9 lunch and see the jacket costs 5 lunches. Which function of money are you using?",
            choices: ["Medium of exchange", "Store of value", "Unit of account", "Durability"],
            answer: 2,
            why: "Using money as a measuring stick to compare prices is its job as a unit of account.",
          },
          {
            prompt: "You earn $15 an hour. How many hours of work does a $120 game console cost you?",
            choices: ["8 hours", "6 hours", "12 hours", "10 hours"],
            answer: 0,
            why: "$120 divided by $15 an hour is 8 hours of work.",
          },
          {
            prompt: "Why is money only an imperfect store of value?",
            choices: ["Coins rust in a year", "Inflation slowly lowers what it can buy", "Banks change its color"],
            answer: 1,
            why: "With inflation, the same dollar buys a little less over time.",
          },
          {
            prompt: "Which trait makes something bad as money?",
            choices: ["Easy to carry", "Hard to fake", "Accepted by many people", "Spoils in a week"],
            answer: 3,
            why: "Good money has to last, so something that spoils fails as a store of value.",
          },
        ],
        tryIt: { label: "Compare prices in the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- counting-money
  {
    id: 'counting-money',
    art: 'money-basics',
    category: 'basics',
    versions: {
      little: {
        title: "Counting Money",
        blurb: "Little coins add up to big amounts.",
        pages: [
          { heading: "Look at the number", body: "Coins and bills have numbers on them. The number tells you what it is worth, not the size.", art: 'money-basics' },
          { heading: "Coins add up", body: "Two 5-cent coins make 10 cents. And 100 cents make 1 dollar." },
          { heading: "Getting change", body: "If a treat costs 75 cents and you pay 1 dollar, you get 25 cents back. That is called change." },
        ],
        quiz: [
          {
            prompt: "How many 5-cent coins make 10 cents?",
            choices: ["5 coins", "2 coins", "10 coins"],
            answer: 1,
            why: "5 cents plus 5 cents is 10 cents, so 2 coins.",
          },
          {
            prompt: "How many cents make 1 dollar?",
            choices: ["100 cents", "10 cents"],
            answer: 0,
            why: "One dollar is the same as 100 cents.",
          },
        ],
      },
      middle: {
        title: "Adding Prices and Change",
        blurb: "Add up a purchase and count your change.",
        pages: [
          { heading: "Coins and bills", body: "Coins are often worth 1, 5, 10 or 25 cents. Bills are often $1, $5, $10 or $20. Remember the key fact: 100 cents make $1.", art: 'money-basics' },
          { heading: "Adding prices", body: "Lily buys a $2.50 notebook and a $1.25 pen. Add the dollars: $2 + $1 = $3. Add the cents: 50 + 25 = 75 cents. Her total is $3.75." },
          { heading: "Making change", body: "Lily pays with a $5 bill. Count up from the price: add 25 cents to get from $3.75 to $4.00, then $1 to get to $5.00. Her change is $1.25." },
          { heading: "Always check", body: "Cashiers are people, and people make honest mistakes. Counting your change before you walk away is a smart habit, and it is polite to give back extra if they gave you too much." },
        ],
        quiz: [
          {
            prompt: "A ball costs $1.40 and a yo-yo costs $2.35. What is the total?",
            choices: ["$3.65", "$4.75", "$3.75"],
            answer: 2,
            why: "$1 + $2 is $3, and 40 + 35 cents is 75 cents, so $3.75.",
          },
          {
            prompt: "A snack costs $2.60 and you pay with a $5 bill. How much change do you get?",
            choices: ["$2.40", "$3.40", "$2.60"],
            answer: 0,
            why: "Count up: 40 cents gets you to $3.00, then $2 more gets you to $5.00, so $2.40.",
          },
          {
            prompt: "What is a smart habit after paying at a store?",
            choices: ["Leave the change on the counter", "Count your change", "Ask for a bigger bill"],
            answer: 1,
            why: "Counting your change catches honest mistakes right away.",
          },
        ],
        tryIt: { label: "Add up prices in the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- barter
  {
    id: 'barter',
    art: 'barter',
    category: 'basics',
    versions: {
      little: {
        title: "Trading Long Ago",
        blurb: "Before money, people swapped things.",
        pages: [
          { heading: "Swapping", body: "Long ago, there was no money. People swapped things. A farmer could trade eggs for a fish.", art: 'barter' },
          { heading: "A tricky problem", body: "But what if the fisher did not want eggs? Then there was no swap, and the farmer got no fish." },
          { heading: "Money makes it easy", body: "With money, the farmer sells eggs to anyone who wants them. Then she uses the money to buy a fish." },
        ],
        quiz: [
          {
            prompt: "What did people do before there was money?",
            choices: ["Used cards", "Swapped things"],
            answer: 1,
            why: "Long ago, people traded one thing for another thing.",
          },
          {
            prompt: "Why is money easier than swapping?",
            choices: ["Almost everyone takes money", "Money is heavier", "Money is a toy"],
            answer: 0,
            why: "Since almost everyone takes money, you do not need to find someone who wants your eggs.",
          },
        ],
      },
      middle: {
        title: "Barter and Trade",
        blurb: "Why swapping things got replaced by money.",
        pages: [
          { heading: "What is barter?", body: "Barter means trading things directly, with no money. Sam has a stack of baseball cards and wants a comic book. If his friend has the comic and wants cards, they can swap.", art: 'barter' },
          { heading: "When it gets stuck", body: "But what if the friend with the comic wants a puzzle, not cards? Now Sam has to find someone who will trade a puzzle for cards, then trade the puzzle for the comic. Every extra step makes the deal harder." },
          { heading: "How many eggs is a cow?", body: "Barter has no prices, so every swap is a new argument. Money fixes that. If a dozen eggs costs $3 and a cow costs $600, you can see a cow is worth 200 dozen eggs, because $600 divided by $3 is 200." },
          { heading: "Barter today", body: "People still barter sometimes, like swapping snacks at lunch or trading a chore with a sibling. It works best between friends who each have what the other wants." },
        ],
        quiz: [
          {
            prompt: "What is barter?",
            choices: ["Paying with a card", "Saving coins in a jar", "Trading things without money"],
            answer: 2,
            why: "Barter is a direct swap of one thing for another.",
          },
          {
            prompt: "A bike costs $90 and a book costs $9. How many books is one bike worth?",
            choices: ["10 books", "9 books", "81 books"],
            answer: 0,
            why: "$90 divided by $9 is 10, so one bike is worth 10 books.",
          },
          {
            prompt: "Why is barter hard?",
            choices: ["Trades are always unfair", "You must find someone who wants what you have", "Nobody likes swapping"],
            answer: 1,
            why: "A swap only works if the other person wants exactly what you are offering.",
          },
        ],
      },
      teen: {
        title: "From Barter to Money",
        blurb: "The double coincidence of wants, explained.",
        pages: [
          { heading: "Barter", body: "Barter is the direct exchange of goods or services without money. It sounds simple, and between two people with matching needs it is. The trouble starts when needs do not line up.", art: 'barter' },
          { heading: "Double coincidence of wants", body: "For a barter trade to happen, each side must want what the other has, at the same time. Economists call this the double coincidence of wants. A guitar teacher who wants a haircut cannot easily trade lessons with you if all you can offer is help with math." },
          { heading: "Too many prices", body: "Without money, every pair of goods needs its own exchange rate. With 10 goods, that is 10 x 9 / 2 = 45 rates to keep track of. With 100 goods, it is 100 x 99 / 2 = 4,950. With money, each good needs just one price: 10 prices or 100 prices." },
          { heading: "Splitting is hard", body: "Some things do not divide well. If a cow is worth 20 chickens and you only want 5 chickens, you cannot hand over a quarter of a cow. Money splits into small amounts, so any trade can be the right size." },
          { heading: "Barter still exists", body: "People still trade skills or swap items online, and it can be a great deal when wants match. Money did not replace barter by force. It won because it solves the matching, pricing and splitting problems at once." },
        ],
        quiz: [
          {
            prompt: "What does double coincidence of wants mean?",
            choices: ["Two people want the same item", "Each side wants what the other side has, at the same time", "Prices double over time", "You want something twice as much"],
            answer: 1,
            why: "Barter only works when both people want exactly what the other is offering.",
          },
          {
            prompt: "In a barter economy with 6 goods, how many exchange rates are needed between every pair?",
            choices: ["6", "12", "36", "15"],
            answer: 3,
            why: "6 x 5 / 2 is 15 pairs, while money would need only 6 prices.",
          },
          {
            prompt: "Which barter problem does money solve by splitting into small amounts?",
            choices: ["Goods that do not divide well", "Not wanting to trade", "Goods that are too light"],
            answer: 0,
            why: "Money divides into small units, so you can pay exactly the amount a trade is worth.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- jobs
  {
    id: 'jobs',
    art: 'jobs',
    category: 'earning',
    versions: {
      little: {
        title: "Jobs Help People",
        blurb: "People earn money by helping others.",
        pages: [
          { heading: "Every job helps someone", body: "A doctor helps sick people. A baker makes bread. A bus driver takes people where they need to go.", art: 'jobs' },
          { heading: "Helping earns money", body: "The people they help pay them. That pay buys food and keeps the lights on at home." },
          { heading: "What do you like?", body: "Do you like drawing, building or caring for animals? There are grown-up jobs for all of those." },
        ],
        quiz: [
          {
            prompt: "How does a baker help people?",
            choices: ["By driving a bus", "By fixing teeth", "By making bread"],
            answer: 2,
            why: "Bakers make bread, and people pay them for it.",
          },
          {
            prompt: "Why do people get paid at their jobs?",
            choices: ["Because they help others", "Because they sit still"],
            answer: 0,
            why: "Jobs pay because the work helps someone.",
          },
        ],
        tryIt: { label: "Find a helping quest", to: 'quests' },
      },
      middle: {
        title: "Jobs and Skills",
        blurb: "Different jobs need different skills.",
        pages: [
          { heading: "Every job solves a problem", body: "A plumber fixes leaks. A teacher helps kids learn. A programmer builds apps. People pay for jobs that solve their problems, and that is how workers earn money.", art: 'jobs' },
          { heading: "Skills are your tools", body: "Each job needs skills. A nurse needs to know about the body and how to stay calm. A carpenter needs to measure and build carefully. You learn skills at school, from practice and from people who already know how." },
          { heading: "Skills can raise your pay", body: "Jake mows lawns for $10 each. He learns to trim the edges too, and neighbors start paying $15 for the full job. With 4 lawns a week, he goes from $40 to $60, just by learning one more skill." },
          { heading: "Practice starts now", body: "Your quests are practice for real work. Notice which ones you enjoy and which ones you are good at. That is how people start finding the kind of work they love." },
        ],
        quiz: [
          {
            prompt: "Why do people pay a plumber?",
            choices: ["To teach a class", "To fix a problem like a leak", "To bake a cake"],
            answer: 1,
            why: "People pay for work that solves a problem they have.",
          },
          {
            prompt: "Mia walks 3 dogs a week for $6 each. How much does she earn in a week?",
            choices: ["$18", "$9", "$12"],
            answer: 0,
            why: "3 dogs times $6 each is $18.",
          },
          {
            prompt: "What can help you earn more for the same kind of job?",
            choices: ["Doing it more slowly", "Skipping the hard parts", "Learning new skills"],
            answer: 2,
            why: "More skills let you do a bigger or better job, which people will pay more for.",
          },
        ],
        tryIt: { label: "Try a new quest", to: 'quests' },
      },
      teen: {
        title: "Skills, Training and Pay",
        blurb: "Why some jobs pay more than others.",
        pages: [
          { heading: "What sets pay", body: "Wages follow supply and demand too. Pay tends to be higher when work is very valuable to others and few people can do it. When lots of people can do a job, employers do not need to pay as much to find someone.", art: 'jobs' },
          { heading: "Human capital", body: "Economists call your skills, knowledge and experience human capital. Like money in a piggy bank, it builds up over time, and it is the one asset that always goes with you from job to job." },
          { heading: "Training as an investment", body: "Say a certification course costs $600 and raises your pay from $15 to $18 an hour. That is $3 more an hour. At 10 hours a week, you earn $30 more each week, so the course pays for itself in $600 / $30 = 20 weeks. After that, the extra is a gain." },
          { heading: "More than the paycheck", body: "Pay matters, but so do the hours, the people, how much you can learn and whether the work suits you. A lower-paying job that teaches valuable skills can lead to better pay later." },
          { heading: "Soft skills count", body: "Showing up on time, communicating clearly and finishing what you start matter in every job. Employers often say these are as important as technical skills, and you can practice them right now with your quests." },
        ],
        quiz: [
          {
            prompt: "A $400 course raises your pay by $2 an hour, and you work 10 hours a week. How many weeks until it pays for itself?",
            choices: ["10 weeks", "40 weeks", "20 weeks", "200 weeks"],
            answer: 2,
            why: "$2 x 10 hours is $20 a week, and $400 / $20 is 20 weeks.",
          },
          {
            prompt: "What is human capital?",
            choices: ["Money kept at home", "Your skills, knowledge and experience", "The city where a company is based"],
            answer: 1,
            why: "Human capital is what you know and can do, and it shapes what you can earn.",
          },
          {
            prompt: "Why do jobs that few people can do often pay more?",
            choices: ["Employers compete for the few workers who can do them", "Those jobs are always easier", "The government sets every wage", "They have shorter hours"],
            answer: 0,
            why: "When a skill is scarce, employers offer more to attract the people who have it.",
          },
        ],
        tryIt: { label: "Build skills with quests", to: 'quests' },
      },
    },
  },

  // ---------------------------------------------------------------- starting-a-business
  {
    id: 'starting-a-business',
    art: 'business',
    category: 'earning',
    versions: {
      little: {
        title: "Start a Business",
        blurb: "Make something people want, then sell it.",
        pages: [
          { heading: "What is a business?", body: "A business makes or does something people want, and sells it to them.", art: 'business' },
          { heading: "First you buy supplies", body: "Say you make bracelets. First you spend some money on string and beads." },
          { heading: "Then you sell", body: "If you sell the bracelets for more than the string and beads cost, you made money. That extra is called profit." },
        ],
        quiz: [
          {
            prompt: "What does a business do?",
            choices: ["Sells things people want", "Only gives things away"],
            answer: 0,
            why: "A business sells something that people want to buy.",
          },
          {
            prompt: "Beads cost 2 coins. You sell the bracelet for 5 coins. Did you make a profit?",
            choices: ["No", "Yes"],
            answer: 1,
            why: "You got more coins than you spent, so you made a profit.",
          },
        ],
      },
      middle: {
        title: "Running a Small Business",
        blurb: "Costs, prices and profit.",
        pages: [
          { heading: "Find something people want", body: "Leo notices his classmates love bookmarks with funny drawings. A good business starts with something people want and will pay for.", art: 'business' },
          { heading: "Count your costs", body: "Leo buys card stock and markers for $6. That is enough for 12 bookmarks, so each one costs him 50 cents to make, because $6 divided by 12 is 50 cents." },
          { heading: "Set a price", body: "Leo sells each bookmark for $1. If he sells all 12, he takes in $12. His profit is what is left after costs: $12 minus $6 is $6." },
          { heading: "Not every day is a sellout", body: "If Leo only sells 5 bookmarks, he takes in $5 but still spent $6. That is a loss of $1. Business owners take a risk: they pay costs first and hope enough people buy." },
        ],
        quiz: [
          {
            prompt: "Leo sells 9 bookmarks at $1 each and spent $6 on supplies. What is his profit?",
            choices: ["$9", "$15", "$3"],
            answer: 2,
            why: "He took in $9 and spent $6, so his profit is $9 minus $6, which is $3.",
          },
          {
            prompt: "What is profit?",
            choices: ["The money left after paying costs", "All the money you take in", "The price of supplies"],
            answer: 0,
            why: "Profit is what you take in minus what you spent.",
          },
          {
            prompt: "Why should the price be higher than the cost to make each item?",
            choices: ["So the item looks fancy", "So you make money on each sale", "So nobody buys it"],
            answer: 1,
            why: "If each item sells for more than it costs, every sale adds to your profit.",
          },
        ],
      },
      teen: {
        title: "Revenue, Costs and Profit",
        blurb: "The math behind a small business.",
        pages: [
          { heading: "Start with value", body: "A business works when it offers something people value more than the price. Before spending anything, ask: who will buy this, and why would they pick mine?", art: 'business' },
          { heading: "Fixed and variable costs", body: "Fixed costs stay the same no matter how much you sell, like a table rental or a sign. Variable costs grow with each sale, like ingredients. Revenue is price times quantity sold. Profit = revenue minus all costs." },
          { heading: "Worked example", body: "You sell cookies for $2 each. Ingredients cost 50 cents a cookie, and the table and sign cost $24. Sell 40 cookies: revenue is 40 x $2 = $80. Costs are $24 + 40 x $0.50 = $44. Profit is $80 - $44 = $36." },
          { heading: "Break-even point", body: "Each cookie brings in $2 and costs 50 cents, so it adds $1.50 toward the fixed costs. To cover $24, you need $24 / $1.50 = 16 cookies. That is your break-even point. Every cookie after the 16th is profit." },
          { heading: "Count your time", body: "If the bake sale took you 4 hours, $36 of profit is $9 an hour. That is a good way to compare a business idea to a regular job, or to decide whether a higher price would be worth trying." },
        ],
        quiz: [
          {
            prompt: "Using the cookie example, you sell 30 cookies. What is your profit?",
            choices: ["$36", "$21", "$60", "$45"],
            answer: 1,
            why: "Revenue is $60 and costs are $24 + $15 = $39, so profit is $60 - $39 = $21.",
          },
          {
            prompt: "Bracelets sell for $5, materials cost $2 each, and fixed costs are $30. How many must you sell to break even?",
            choices: ["6", "15", "30", "10"],
            answer: 3,
            why: "Each bracelet adds $5 - $2 = $3 toward fixed costs, and $30 / $3 is 10.",
          },
          {
            prompt: "Which of these is a fixed cost for a lemonade stand?",
            choices: ["A one-time sign", "Lemons for each cup", "Cups"],
            answer: 0,
            why: "The sign costs the same whether you sell 5 cups or 50.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- paychecks
  {
    id: 'paychecks',
    art: 'paycheck',
    category: 'earning',
    versions: {
      middle: {
        title: "Your First Paycheck",
        blurb: "Why a paycheck can be smaller than you expect.",
        pages: [
          { heading: "The hourly math", body: "Maya's big cousin works at a cafe for $12 an hour. Last week she worked 10 hours. 10 x $12 = $120, so she expected $120.", art: 'paycheck' },
          { heading: "The paycheck says less", body: "Her paycheck was only $105. Where did $15 go? Some pay is taken out before the worker ever gets it, mostly for taxes." },
          { heading: "Where it goes", body: "Taxes help pay for roads, schools and firefighters. Some jobs also take out money for things like health care or saving for when you are older. The exact amounts depend on where you live and the job." },
          { heading: "Plan with what arrives", body: "The smart move is to plan your spending with the amount you actually get, not the bigger number from the hourly math. That way there are no surprises." },
        ],
        quiz: [
          {
            prompt: "Tom works 8 hours at $10 an hour. Before anything is taken out, how much did he earn?",
            choices: ["$18", "$80", "$100"],
            answer: 1,
            why: "8 hours times $10 an hour is $80.",
          },
          {
            prompt: "Tom earned $80, and $12 was taken out for taxes. How much is his paycheck?",
            choices: ["$68", "$92", "$72"],
            answer: 0,
            why: "$80 minus $12 is $68.",
          },
          {
            prompt: "Which number should you plan your spending with?",
            choices: ["The hourly math", "The biggest number you can think of", "The amount you actually get"],
            answer: 2,
            why: "You can only spend the money that actually arrives.",
          },
        ],
        tryIt: { label: "Earn coins with a quest", to: 'quests' },
      },
      teen: {
        title: "Reading a Pay Stub",
        blurb: "Gross pay, withholding and net pay.",
        pages: [
          { heading: "Gross pay", body: "Gross pay is what you earned before anything is taken out: your hours times your hourly rate, or your salary for the pay period. If you work 15 hours at $14 an hour, your gross pay is $210.", art: 'paycheck' },
          { heading: "Withholding", body: "Employers often withhold, or hold back, part of each paycheck and send it straight to the government for income tax and payroll taxes. Withholding is usually an estimate. In many places, when you file a tax return you get a refund if too much was held back, or owe more if too little was." },
          { heading: "Other deductions", body: "A pay stub can also show deductions you chose or that come with the job, like money put into a retirement account or a share of health insurance. Which deductions apply, and how big they are, depends on where you live and your employer." },
          { heading: "Worked example", body: "Gross pay is $210. Say the stub shows $21.00 withheld for income tax, $16.07 for payroll taxes and $10.00 to retirement savings. Deductions total $47.07, so net pay is $210.00 - $47.07 = $162.93. That is the amount that lands in your account." },
          { heading: "Pay periods", body: "Paid weekly means 52 paychecks a year. Every two weeks means 26. Twice a month means 24. Two-week and twice-a-month sound alike, but the 26-check schedule gives you two extra paydays a year, which matters when you plan monthly bills." },
        ],
        quiz: [
          {
            prompt: "You work 20 hours at $13 an hour. What is your gross pay?",
            choices: ["$33", "$200", "$230", "$260"],
            answer: 3,
            why: "20 hours times $13 an hour is $260 before deductions.",
          },
          {
            prompt: "Gross pay is $300 and deductions total $54. What is net pay?",
            choices: ["$246", "$354", "$254", "$300"],
            answer: 0,
            why: "Net pay is gross minus deductions: $300 - $54 = $246.",
          },
          {
            prompt: "What usually happens if too much tax was withheld during the year?",
            choices: ["The money is gone for good", "You may get a refund after filing", "Your pay rate goes up"],
            answer: 1,
            why: "Withholding is an estimate, and filing a return settles the difference.",
          },
          {
            prompt: "How many paychecks a year come with pay every two weeks?",
            choices: ["24", "12", "26", "52"],
            answer: 2,
            why: "A year has 52 weeks, and 52 / 2 is 26 paychecks.",
          },
        ],
        tryIt: { label: "Earn coins with a quest", to: 'quests' },
      },
    },
  },

  // ---------------------------------------------------------------- compare-prices
  {
    id: 'compare-prices',
    art: 'compare',
    category: 'spending',
    versions: {
      little: {
        title: "Look Before You Buy",
        blurb: "The same thing can have different prices.",
        pages: [
          { heading: "Two stores, two prices", body: "A ball costs 5 coins at one store. The same ball costs 3 coins at another store.", art: 'compare' },
          { heading: "Pick the better deal", body: "If you buy the 3-coin ball, you keep 2 coins. It is the same ball, and you have coins left over." },
          { heading: "Look around first", body: "Before you buy, take a look at other prices. A little looking can save coins." },
        ],
        quiz: [
          {
            prompt: "The same toy costs 4 coins here and 6 coins there. Which is the better deal?",
            choices: ["6 coins", "4 coins"],
            answer: 1,
            why: "It is the same toy, so paying fewer coins is the better deal.",
          },
          {
            prompt: "What should you do before you buy?",
            choices: ["Look at other prices", "Close your eyes", "Buy two"],
            answer: 0,
            why: "Looking around helps you find the best price.",
          },
        ],
        tryIt: { label: "Compare prices in the shop", to: 'shop' },
      },
      middle: {
        title: "Comparing Prices",
        blurb: "Find the better deal on the same thing.",
        pages: [
          { heading: "Shop around", body: "Emma wants a jump rope. Store A sells it for $8. Store B sells the same rope for $6. Online it is $5, but shipping costs $3, so the total is $8. Store B is the best deal.", art: 'compare' },
          { heading: "Count the extras", body: "The price on the tag is not always the whole cost. Shipping, fees and a trip across town all add up. Compare the total you will really pay." },
          { heading: "Cheaper is not always better", body: "A $4 ball that pops in a week is not a better deal than a $7 ball that lasts all summer. Think about how long something will last, not only the price." },
          { heading: "Compare in quests", body: "If your quests pay about $2 each, a $6 reward costs you 3 quests and a $10 reward costs 5 quests. Thinking in quests helps you decide what is worth it." },
        ],
        quiz: [
          {
            prompt: "A game is $15 at a store, or $12 online plus $4 shipping. Which costs less in total?",
            choices: ["The store", "Online", "They cost the same"],
            answer: 0,
            why: "Online is $12 + $4 = $16, which is more than the $15 store price.",
          },
          {
            prompt: "Quests pay $3 each. How many quests does a $12 reward cost?",
            choices: ["3 quests", "9 quests", "4 quests"],
            answer: 2,
            why: "$12 divided by $3 a quest is 4 quests.",
          },
          {
            prompt: "Why might the cheaper item not be the better deal?",
            choices: ["Cheap things are always bad", "It might break much sooner", "Expensive things are always better"],
            answer: 1,
            why: "Something that lasts longer can be worth paying a little more for.",
          },
        ],
        tryIt: { label: "Compare prices in the shop", to: 'shop' },
      },
      teen: {
        title: "Unit Prices",
        blurb: "Divide to find the real best deal.",
        pages: [
          { heading: "What is a unit price?", body: "A unit price is the cost per unit: per gram, per liter, per item or per use. You find it by dividing the price by the quantity. It lets you compare packages of different sizes fairly.", art: 'compare' },
          { heading: "Worked example", body: "A 400-gram box of cereal costs $3.60, and a 600-gram box costs $4.80. Per 100 grams, the small box is $3.60 / 4 = $0.90 and the big box is $4.80 / 6 = $0.80. The big box is cheaper per gram." },
          { heading: "Watch the deal tags", body: "A sign that says 3 for $5 sounds like a deal, but $5 / 3 is about $1.67 each. If singles cost $1.50, the bundle actually costs more. Do the division before you trust the sign." },
          { heading: "Cost per use", body: "For things you use over and over, divide the price by how often you will use it. $60 shoes worn 120 times cost 50 cents a wear. $30 shoes that fall apart after 20 wears cost $1.50 a wear." },
          { heading: "When bigger is not better", body: "A lower unit price only helps if you use it all. A giant bag that goes stale before you finish it can cost more in the end than a small one you eat completely." },
        ],
        quiz: [
          {
            prompt: "Juice A is 2 liters for $3.00. Juice B is 3 liters for $4.20. Which has the lower price per liter?",
            choices: ["Juice A", "They are the same", "Juice B"],
            answer: 2,
            why: "Juice A is $1.50 a liter and Juice B is $4.20 / 3 = $1.40 a liter.",
          },
          {
            prompt: "Granola bars are 4 for $6 or $1.40 each. Which is cheaper per bar?",
            choices: ["Buying them one at a time", "The 4 pack", "They cost the same"],
            answer: 0,
            why: "The 4 pack is $6 / 4 = $1.50 a bar, which is more than $1.40.",
          },
          {
            prompt: "A $90 jacket is worn 150 times. What is its cost per wear?",
            choices: ["$0.90", "$1.50", "$0.60", "$0.06"],
            answer: 2,
            why: "$90 divided by 150 wears is $0.60 a wear.",
          },
          {
            prompt: "When is the lower unit price a worse choice?",
            choices: ["When you will throw away what you do not use", "When the store is busy", "When the package is a nice color"],
            answer: 0,
            why: "Wasted product means you paid for something you never used.",
          },
        ],
        tryIt: { label: "Compare prices in the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- sales-and-discounts
  {
    id: 'sales-and-discounts',
    art: 'compare',
    category: 'spending',
    versions: {
      middle: {
        title: "Sales and Discounts",
        blurb: "What percent off really means.",
        pages: [
          { heading: "Percent off", body: "A sale sign might say 25% off. Percent means out of 100, so 25% off a $20 game takes off $5, because a quarter of $20 is $5. You pay $15.", art: 'compare' },
          { heading: "Quick tricks", body: "50% off means half price. 10% off is easy too: move the decimal point one place left. 10% of $30 is $3, so you would pay $27." },
          { heading: "Is it really saving?", body: "A sale only saves money if you planned to buy the thing anyway. If you buy a $15 sale toy you did not want, you did not save $5. You spent $15." },
          { heading: "Waiting for a sale", body: "If you are saving up for something, watching for a sale can get you there sooner. That is a sale working for you, not the other way around." },
        ],
        quiz: [
          {
            prompt: "A $16 book is 50% off. What do you pay?",
            choices: ["$6", "$12", "$8"],
            answer: 2,
            why: "50% off means half price, and half of $16 is $8.",
          },
          {
            prompt: "A $40 scooter is 10% off. What is the sale price?",
            choices: ["$36", "$30", "$4"],
            answer: 0,
            why: "10% of $40 is $4, and $40 minus $4 is $36.",
          },
          {
            prompt: "When does a sale really save you money?",
            choices: ["Whenever the sign is big", "When you planned to buy the item anyway", "When you buy lots of things"],
            answer: 1,
            why: "If you did not plan to buy it, a sale just helps you spend money.",
          },
        ],
        tryIt: { label: "Check the shop", to: 'shop' },
      },
      teen: {
        title: "Discount Math",
        blurb: "Percent off, stacked deals and real savings.",
        pages: [
          { heading: "The fast formula", body: "To find a sale price, multiply by what is left. 30% off means you pay 70%, so an $80 hoodie costs $80 x 0.70 = $56. One multiplication instead of two steps.", art: 'compare' },
          { heading: "Stacked discounts", body: "20% off plus an extra 10% off is not 30% off. The second discount comes off the already lower price: $100 x 0.80 = $80, then $80 x 0.90 = $72. That is 28% off in total, not 30%." },
          { heading: "Compare-at prices", body: "A tag might say \"Was $90, now $45.\" The \"was\" price is a comparison the seller picked, and the item may rarely have sold for that. Compare the sale price to what other stores charge, not to the old tag." },
          { heading: "Spending to save", body: "Free shipping over $50 is a common nudge. With a $42 cart and $6 shipping, you would pay $48. Adding a $10 item gets free shipping but costs $52. That is only a good move if you already wanted the extra item." },
          { heading: "The real rule", body: "A discount is a reason to buy something sooner or cheaper, never a reason to buy it at all. The best sale is one on a thing that was already on your list." },
        ],
        quiz: [
          {
            prompt: "An $80 hoodie is 30% off. What is the sale price?",
            choices: ["$24", "$56", "$50", "$60"],
            answer: 1,
            why: "You pay 70% of the price, and $80 x 0.70 is $56.",
          },
          {
            prompt: "A $40 game is 25% off, then an extra 20% off the sale price. What do you pay?",
            choices: ["$18", "$22", "$26", "$24"],
            answer: 3,
            why: "$40 x 0.75 is $30, then $30 x 0.80 is $24.",
          },
          {
            prompt: "Your cart is $45 with $7 shipping. Free shipping starts at $50, and you add a $6 item you did not need. What happened?",
            choices: ["You saved $7, so it was a great deal", "The extra item was free", "You paid $1 less in total, but $6 went to something you did not need"],
            answer: 2,
            why: "You spent $1 less in total, but $6 of it bought something you did not need.",
          },
          {
            prompt: "When is a sale a good reason to buy?",
            choices: ["When the item was already on your list", "When the countdown timer is almost done", "When the sign shows a big \"was\" price"],
            answer: 0,
            why: "A sale saves real money only on things you planned to buy.",
          },
        ],
        tryIt: { label: "Check the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- ads
  {
    id: 'ads',
    art: 'ads',
    category: 'spending',
    versions: {
      little: {
        title: "What Ads Do",
        blurb: "Ads try to make you want things.",
        pages: [
          { heading: "What is an ad?", body: "An ad is a short show or picture made to sell you something.", art: 'ads' },
          { heading: "Ads make things look extra fun", body: "Ads use bright colors, happy music and smiling kids. A toy can look bigger and more fun than it really is." },
          { heading: "Ask yourself", body: "Do I really want this, or did the ad make me want it? It is okay to stop and think." },
        ],
        quiz: [
          {
            prompt: "What is an ad trying to do?",
            choices: ["Tell a bedtime story", "Get you to buy something"],
            answer: 1,
            why: "Ads are made to make you want to buy things.",
          },
          {
            prompt: "Does a toy always look the same in real life as in the ad?",
            choices: ["Not always", "Yes, always"],
            answer: 0,
            why: "Ads can make toys look bigger and more fun than they really are.",
          },
        ],
      },
      middle: {
        title: "How Ads Work",
        blurb: "The tricks ads use to make you want stuff.",
        pages: [
          { heading: "An ad has one job", body: "Companies pay to make ads so you will buy what they sell. That is not bad, it is how people learn about new things. But it helps to remember the ad is on the seller's side, not yours.", art: 'ads' },
          { heading: "Common tricks", body: "Catchy songs stick in your head. Happy kids make it look like fun is guaranteed. Lines like \"everyone has one\" or \"only for a limited time\" make you feel you have to hurry." },
          { heading: "Ads are everywhere", body: "Ads show up before videos, inside games and apps, on cereal boxes and on billboards. Some games even put ads in the middle of play to tempt you to buy extras." },
          { heading: "Be an ad detective", body: "Ask three questions. Who made this ad? What do they want me to buy? What are they not showing me, like batteries not included or a part that costs extra?" },
        ],
        quiz: [
          {
            prompt: "Who pays for an ad?",
            choices: ["The company selling the product", "The people watching it", "Nobody"],
            answer: 0,
            why: "Companies pay for ads because they want you to buy what they sell.",
          },
          {
            prompt: "An ad says \"Only for a limited time!\" What is it trying to do?",
            choices: ["Help you save money", "Tell you the time", "Make you hurry to buy"],
            answer: 2,
            why: "Making you feel rushed can stop you from thinking it over.",
          },
          {
            prompt: "Which is a good ad detective question?",
            choices: ["How loud is the music?", "What are they not showing me?", "Is the actor my age?"],
            answer: 1,
            why: "Ads leave out things like extra costs, so it pays to ask what is missing.",
          },
        ],
      },
      teen: {
        title: "Ads, Influencers, Sponsors",
        blurb: "How marketing works, and how to see through it.",
        pages: [
          { heading: "Your attention is the product", body: "Many apps and videos are free because ads pay for them. The service sells advertisers a chance to reach you. When something online is free, your time and attention are often what is being sold.", art: 'ads' },
          { heading: "Targeted ads", body: "Platforms track what you watch, click and search, then show ads picked for you. That is why an ad for the shoes you looked at once can follow you around for days. It is not a sign the universe wants you to buy them." },
          { heading: "Influencers and sponsors", body: "Creators are often paid in money or free products to show something off. In many places, these posts should be labeled with words like ad, sponsored or paid partnership. A review from someone who was paid is not a neutral review, even if they really do like the product." },
          { heading: "Persuasion tricks", body: "Watch for scarcity (\"only 3 left\"), countdown timers, social proof (\"10,000 people bought this\") and anchoring, where a high first price makes the next one look cheap. Each one is built to make you decide fast." },
          { heading: "Your defense", body: "Slow down. Look for reviews from people who were not paid, compare prices elsewhere, and ask whether you wanted this before you saw the ad. If you still want it after that, you are choosing, not being sold." },
        ],
        quiz: [
          {
            prompt: "Why are many apps free to use?",
            choices: ["The developers do not need money", "Ads pay for them by selling access to your attention", "The government pays for every app", "Free apps never collect data"],
            answer: 1,
            why: "Advertisers pay to reach users, which funds the free app.",
          },
          {
            prompt: "A creator raves about headphones in a post marked \"paid partnership.\" What should you keep in mind?",
            choices: ["They were paid, so look for reviews from people who were not", "Paid posts are always lies", "It must be the best product available"],
            answer: 0,
            why: "Being paid does not make it false, but it means the review is not neutral.",
          },
          {
            prompt: "A site shows a countdown timer and \"only 2 left.\" Which trick is this?",
            choices: ["Unit pricing", "A refund policy", "Diversification", "Creating urgency and scarcity"],
            answer: 3,
            why: "Timers and low stock warnings push you to decide before you think it through.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- impulse-buys
  {
    id: 'impulse-buys',
    art: 'impulse',
    category: 'spending',
    versions: {
      little: {
        title: "Wait Before You Buy",
        blurb: "A little wait helps you choose well.",
        pages: [
          { heading: "I want it now!", body: "Sometimes you see a toy and want it right away. That feeling is normal. Everyone gets it.", art: 'impulse' },
          { heading: "Take a wait", body: "Try waiting until tomorrow. Then ask yourself: do I still want it?" },
          { heading: "Either way you win", body: "If you still want it, great, you can choose it. If not, your coins are still yours for something better." },
        ],
        quiz: [
          {
            prompt: "You see a toy and want it right now. What is a smart thing to do?",
            choices: ["Buy it fast", "Wait a day and think", "Cry"],
            answer: 1,
            why: "Waiting a day helps you know if you really want it.",
          },
          {
            prompt: "You waited, and now you do not want the toy anymore. What happened to your coins?",
            choices: ["You still have them", "They are gone"],
            answer: 0,
            why: "You did not spend them, so they are still yours.",
          },
        ],
        tryIt: { label: "Save for a dream goal", to: 'goal' },
      },
      middle: {
        title: "Impulse Buys",
        blurb: "Why waiting a day keeps more coins with you.",
        pages: [
          { heading: "What is an impulse buy?", body: "An impulse buy is something you buy without planning, just because you saw it. Noah sees a $4 slime at the checkout, buys it, and forgets about it in a week.", art: 'impulse' },
          { heading: "Why stores do it", body: "Stores put candy and small toys right by the register on purpose. You are standing there waiting, and they are cheap enough that it feels like no big deal." },
          { heading: "The wait-a-day rule", body: "When you want something you did not plan for, wait one day. If you still want it tomorrow, it is probably worth it. Noah skipped 3 impulse buys of $4 each and kept $12. Saving $6 a week, that put him 2 weeks closer to his goal." },
          { heading: "Feelings and spending", body: "People often want to buy things when they are bored, sad or super excited. Notice the feeling. Sometimes what you really want is something to do, not something to buy." },
        ],
        quiz: [
          {
            prompt: "Which one is an impulse buy?",
            choices: ["Saving up for a bike for a month", "Buying a candy bar at checkout without planning to", "Buying school shoes on a list"],
            answer: 1,
            why: "An impulse buy is unplanned, decided in the moment.",
          },
          {
            prompt: "You skip 5 impulse buys of $2 each. How much do you keep?",
            choices: ["$7", "$5", "$10"],
            answer: 2,
            why: "5 times $2 is $10 that stays with you.",
          },
          {
            prompt: "You feel bored and want to buy something. What could you try first?",
            choices: ["Find something fun to do instead", "Buy two things", "Buy it before the feeling goes away"],
            answer: 0,
            why: "When the feeling is boredom, an activity can help more than a purchase.",
          },
        ],
        tryIt: { label: "Save for a dream goal", to: 'goal' },
      },
      teen: {
        title: "Impulse Spending",
        blurb: "Feelings, triggers and the 24-hour rule.",
        pages: [
          { heading: "Triggers", body: "Impulse spending is buying on the spot, without a plan. Common triggers include emotions like stress or boredom, sales timers, one-click checkout and saved card details that make paying feel effortless.", art: 'impulse' },
          { heading: "The 24-hour rule", body: "For anything you did not plan to buy, wait 24 hours. For bigger purchases, try a 30-day list: write it down and check back in a month. If you still want it and it fits your budget, buy it without guilt." },
          { heading: "Small leaks add up", body: "A $5 impulse buy twice a week is $10 a week. Over 52 weeks that is $520. At $12 an hour, that is about 43 hours of work, since $520 / $12 is about 43.3, spent on things you did not plan." },
          { heading: "Add some friction", body: "Make impulse spending a little harder. Remove saved cards from apps, unsubscribe from store emails, and shop with a list. Every extra step gives your thinking brain time to catch up." },
          { heading: "Plan for fun", body: "The goal is not to never buy fun things. Set aside some fun money in your budget. Spending it is a choice you already made, so there is nothing to regret." },
        ],
        quiz: [
          {
            prompt: "You spend $3 on impulse snacks 4 times a week. How much is that in a year of 52 weeks?",
            choices: ["$156", "$624", "$208", "$12"],
            answer: 1,
            why: "$3 x 4 is $12 a week, and $12 x 52 is $624.",
          },
          {
            prompt: "What is the 24-hour rule?",
            choices: ["Shop only during the day", "Return items within 24 hours", "Wait a day before an unplanned purchase"],
            answer: 2,
            why: "Waiting lets the urge fade so you can decide with a clear head.",
          },
          {
            prompt: "Which change adds helpful friction to spending?",
            choices: ["Saving your card in every app", "Turning on one-click checkout", "Removing saved cards from shopping apps", "Following more store accounts"],
            answer: 2,
            why: "Typing in your card each time gives you a moment to rethink.",
          },
        ],
        tryIt: { label: "Set a dream goal", to: 'goal' },
      },
    },
  },

  // ---------------------------------------------------------------- subscriptions
  {
    id: 'subscriptions',
    art: 'subscriptions',
    category: 'spending',
    versions: {
      middle: {
        title: "Little Charges Add Up",
        blurb: "Monthly payments that keep on going.",
        pages: [
          { heading: "What is a subscription?", body: "A subscription is something you pay for every month, like a game pass, a music app or a video service. It keeps charging until someone cancels it.", art: 'subscriptions' },
          { heading: "Do the yearly math", body: "A $5 a month game pass sounds small. But 12 months times $5 is $60 a year. Three subscriptions at $5, $8 and $3 are $16 a month, and $16 x 12 is $192 a year." },
          { heading: "Free trials", body: "A free trial lets you try something free for a while. When it ends, it often starts charging on its own unless you cancel. Ask a grown-up to set a reminder before the trial ends." },
          { heading: "Is it worth it?", body: "A subscription you use every day can be a good deal. One you forgot about is money leaking away each month. Check every so often which ones you still use." },
        ],
        quiz: [
          {
            prompt: "A music app costs $4 a month. How much is that in a year?",
            choices: ["$48", "$16", "$40"],
            answer: 0,
            why: "12 months times $4 is $48.",
          },
          {
            prompt: "What often happens when a free trial ends?",
            choices: ["It turns off by itself", "It starts charging unless you cancel", "You get paid"],
            answer: 1,
            why: "Many free trials turn into paid subscriptions automatically.",
          },
          {
            prompt: "Which subscription is probably not worth keeping?",
            choices: ["One you use every day", "One the whole family shares and loves", "One you forgot you had"],
            answer: 2,
            why: "Paying every month for something you do not use is money leaking away.",
          },
        ],
      },
      teen: {
        title: "Subscriptions and Trials",
        blurb: "The real yearly cost of small monthly charges.",
        pages: [
          { heading: "Recurring charges", body: "A subscription is a recurring charge: it bills you automatically every month or year until you cancel. Companies like them because people often keep paying long after they stop using the service.", art: 'subscriptions' },
          { heading: "Worked example", body: "Music $11, video $16, a game pass $10 and cloud storage $3 a month. That is $11 + $16 + $10 + $3 = $40 a month, and $40 x 12 = $480 a year. Seen as one yearly number, the total looks very different." },
          { heading: "Monthly or yearly?", body: "A $10 a month plan costs $120 a year. If the yearly plan costs $96, you save $24, which is 20%. But it only saves money if you would really keep it the whole year, since you pay it all up front." },
          { heading: "Free trial traps", body: "Many trials need a card and switch to paid automatically. Before you start one, put a reminder on your calendar a day or two before it ends, and check how to cancel. Some services make canceling harder than signing up." },
          { heading: "Do an audit", body: "List every subscription and divide its cost by how often you use it. A $16 video service watched 4 times a month costs $4 a watch. Cancel what you rarely use. You can usually sign up again later if you miss it." },
        ],
        quiz: [
          {
            prompt: "Subscriptions of $7, $12 and $6 a month cost how much per year?",
            choices: ["$25", "$250", "$300", "$325"],
            answer: 2,
            why: "$7 + $12 + $6 is $25 a month, and $25 x 12 is $300.",
          },
          {
            prompt: "A plan is $8 a month or $72 a year. How much does the yearly plan save if you keep it all year?",
            choices: ["$24", "$8", "$72", "$96"],
            answer: 0,
            why: "Monthly costs $8 x 12 = $96, and $96 - $72 is $24 saved.",
          },
          {
            prompt: "What is the best move before starting a free trial?",
            choices: ["Use a fake name", "Set a reminder before it ends and learn how to cancel", "Sign up for several at once"],
            answer: 1,
            why: "A reminder lets you decide before the first charge hits.",
          },
          {
            prompt: "A $15 subscription is used 3 times a month. What is its cost per use?",
            choices: ["$3", "$45", "$12", "$5"],
            answer: 3,
            why: "$15 divided by 3 uses is $5 a use.",
          },
        ],
      },
    },
  },
];
