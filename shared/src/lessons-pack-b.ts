// Expansion pack B: saving, banking, borrowing and protection.
// Same rules as lessons-content.ts: plain text only, no em or en dashes, no emoji,
// every worked number double-checked. Example numbers are examples, never statistics.
import type { Lesson } from './learn';

export const PACK_B: Lesson[] = [
  // ---------------------------------------------------------------- emergency-fund
  {
    id: 'emergency-fund',
    art: 'emergency',
    category: 'saving',
    versions: {
      little: {
        title: "Rainy-Day Coins",
        blurb: "Save a few coins for surprises.",
        pages: [
          { heading: "Surprises happen", body: "Sometimes things break or get lost, like a ball that pops or a water bottle left at the park. Surprises like that can cost money.", art: 'emergency' },
          { heading: "A rainy-day jar", body: "Rainy-day coins are coins you keep just for surprises. You don't spend them on treats." },
          { heading: "Ready for anything", body: "When a surprise comes, your rainy-day coins can fix it. No need to worry!" },
        ],
        quiz: [
          {
            prompt: "What are rainy-day coins for?",
            choices: ["Surprises, like fixing something broken", "Candy every day"],
            answer: 0,
            why: "Rainy-day coins wait for surprises, so you are ready when one comes.",
          },
          {
            prompt: "Your ball pops. What can help you get a new one?",
            choices: ["Hiding the ball", "Your rainy-day coins", "Waiting for it to fix itself"],
            answer: 1,
            why: "That is exactly what rainy-day coins are saved for.",
          },
        ],
        tryIt: { label: "Start a rainy-day piggy", to: 'grow' },
      },
      middle: {
        title: "The Rainy-Day Fund",
        blurb: "Money set aside for when things go wrong.",
        pages: [
          { heading: "What is an emergency fund?", body: "An emergency fund is money you save only for surprises you did not plan for. Grown-ups use one for things like a broken car or a leaky roof. Some people call it a rainy-day fund.", art: 'emergency' },
          { heading: "Sam's story", body: "Sam saved $15 for a new game. Then his bike tire went flat, and a new tube cost $8. Because Sam also had $10 in a separate rainy-day fund, he fixed his bike and still had all $15 for his game." },
          { heading: "Keep it separate", body: "If rainy-day money sits with your spending money, it is easy to spend by accident. Keeping it in its own spot, like your piggy bank, keeps it ready. Bonus: in the piggy it earns interest while it waits." },
          { heading: "Refill it", body: "After Sam fixed his bike, his fund had $2 left. He puts $1 back each week, so it takes 8 weeks to fill it back up to $10." },
        ],
        quiz: [
          {
            prompt: "Which of these is an emergency?",
            choices: ["A new video game comes out", "Your glasses break and need fixing", "A friend has a cool hat"],
            answer: 1,
            why: "Broken glasses are a surprise you need to fix, which is what an emergency fund is for.",
          },
          {
            prompt: "You have $12 in your rainy-day fund and spend $9 to fix your headphones. How much is left?",
            choices: ["$3", "$21", "$9"],
            answer: 0,
            why: "$12 minus $9 is $3.",
          },
          {
            prompt: "Why keep rainy-day money apart from spending money?",
            choices: ["So it looks bigger", "So nobody can ever use it", "So you don't spend it by accident"],
            answer: 2,
            why: "Money in its own spot stays ready for a real surprise.",
          },
        ],
        tryIt: { label: "Start a rainy-day piggy", to: 'grow' },
      },
      teen: {
        title: "Building an Emergency Fund",
        blurb: "A cushion so surprises don't turn into debt.",
        pages: [
          { heading: "Why a cushion", body: "An emergency fund is money set aside only for unexpected costs: a cracked phone screen, a car repair, a medical bill or a gap between jobs. Without one, people often cover surprises with a credit card or a loan, and then the surprise costs extra in interest.", art: 'emergency' },
          { heading: "How big?", body: "A common guideline for adults is enough to cover about three to six months of essential expenses. For a teen, a smaller target makes sense, like the cost of replacing the thing you would most hate to lose, such as your phone." },
          { heading: "Worked example", body: "Say your target is $300 and you earn $40 a week. Saving 25% means $10 a week, so it takes $300 / $10 = 30 weeks. Saving 50%, or $20 a week, gets you there in 15 weeks." },
          { heading: "Where to keep it", body: "Emergency money should be safe and easy to reach, not risky. A savings account or your piggy bank fits. The rocket fund does not: if it dropped 8% the week you needed your $300, you would only have $276." },
          { heading: "Use it, then rebuild", body: "An emergency fund is meant to be used, that is the point. Just be honest about what counts: a sneaker sale is not an emergency. After you dip in, make refilling it your first savings goal." },
        ],
        quiz: [
          {
            prompt: "Your emergency target is $240 and you save $15 a week. How many weeks will it take?",
            choices: ["12 weeks", "16 weeks", "18 weeks", "24 weeks"],
            answer: 1,
            why: "$240 divided by $15 a week is 16 weeks.",
          },
          {
            prompt: "Why is the rocket fund a poor home for emergency money?",
            choices: ["It never grows", "Grown-ups can see it", "Its value could be down right when you need it"],
            answer: 2,
            why: "Risky money can be worth less at the exact moment a surprise hits.",
          },
          {
            prompt: "Which is the best use of an emergency fund?",
            choices: ["Replacing a broken laptop you need for school", "A limited-time sneaker sale", "A new game on launch day", "Concert tickets"],
            answer: 0,
            why: "A laptop you need that breaks without warning is a true emergency, while the others are wants.",
          },
        ],
        tryIt: { label: "Start a rainy-day piggy", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- pay-yourself-first
  {
    id: 'pay-yourself-first',
    art: 'save',
    category: 'saving',
    versions: {
      middle: {
        title: "Pay Yourself First",
        blurb: "Save first, then spend what is left.",
        pages: [
          { heading: "Two ways to save", body: "One way is to spend what you want, then save whatever is left. The other way is to save first, then spend what is left. The second way is called paying yourself first.", art: 'save' },
          { heading: "Ava and Ben", body: "Ava and Ben each earn $10 a week. Ben saves whatever is left, but most weeks nothing is left, so he saves $0. Ava puts $3 into savings the moment she gets paid. After 8 weeks, Ava has $24 saved and Ben has nothing." },
          { heading: "Still room for fun", body: "Ava still has $7 a week to spend. She just made her saving choice before the shop had a chance to tempt her." },
          { heading: "Try it in Kid Kapital", body: "When a quest pays, move some coins to your piggy or dream goal right away, before you visit the shop. Then enjoy the rest." },
        ],
        quiz: [
          {
            prompt: "What does pay yourself first mean?",
            choices: ["Buy yourself a treat first", "Save first, then spend what is left", "Spend everything on you"],
            answer: 1,
            why: "Paying yourself first means your savings get their share before any spending.",
          },
          {
            prompt: "You earn $8 a week and save $2 first. How much can you spend?",
            choices: ["$6", "$10", "$2"],
            answer: 0,
            why: "$8 minus the $2 you saved leaves $6 to spend.",
          },
          {
            prompt: "You save $4 every week for 5 weeks. How much have you saved?",
            choices: ["$9", "$16", "$20"],
            answer: 2,
            why: "$4 a week times 5 weeks is $20.",
          },
        ],
        tryIt: { label: "Move coins to your piggy", to: 'grow' },
      },
      teen: {
        title: "Pay Yourself First",
        blurb: "Make saving automatic, not leftover.",
        pages: [
          { heading: "Savings as a bill", body: "Paying yourself first means treating savings like a bill you owe your future self. It comes out the moment money arrives, and you budget with what remains.", art: 'save' },
          { heading: "Why leftovers fail", body: "Spending tends to grow to fill whatever money is around. If saving waits until the end of the month, small purchases usually get there first. Saving at the start removes the decision, so you don't need willpower every week." },
          { heading: "Worked example", body: "You earn $60 a week and save 20% first. That is $60 x 0.20 = $12 saved and $48 left to spend. Over a year of 52 weeks, that is $12 x 52 = $624 saved, before any interest." },
          { heading: "Automate it", body: "Many adults set up an automatic transfer into savings on payday, so it happens without thinking. Some employers can even split a paycheck between two accounts. In Kid Kapital, the closest move is sending coins to your piggy as soon as a quest pays." },
          { heading: "Start small, then raise it", body: "If 20% feels like too much, start with 5% or 10%. When your income goes up, save half of the raise. Your savings grow and you still get to enjoy some of the extra." },
        ],
        quiz: [
          {
            prompt: "You earn $80 a week and pay yourself first at 15%. How much do you save each week?",
            choices: ["$8", "$15", "$12", "$68"],
            answer: 2,
            why: "15% of $80 is $80 x 0.15 = $12.",
          },
          {
            prompt: "You save $12 a week for 52 weeks. How much is that before interest?",
            choices: ["$624", "$520", "$612"],
            answer: 0,
            why: "$12 x 52 = $624.",
          },
          {
            prompt: "Why does paying yourself first usually beat saving leftovers?",
            choices: ["It earns a higher interest rate", "Spending tends to use up whatever is left", "Banks require it"],
            answer: 1,
            why: "Saving at the start protects it from all the small purchases that come later.",
          },
          {
            prompt: "Your pay rises from $50 to $60 a week and you save half the raise. How much more do you save each week?",
            choices: ["$10", "$30", "$6", "$5"],
            answer: 3,
            why: "The raise is $10, and half of $10 is $5.",
          },
        ],
        tryIt: { label: "Move coins to your piggy", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- goal-setting
  {
    id: 'goal-setting',
    art: 'goals',
    category: 'saving',
    versions: {
      little: {
        title: "Big Goals, Small Steps",
        blurb: "Reach a big goal one step at a time.",
        pages: [
          { heading: "A big goal", body: "A goal is something you want to reach, like saving up for a big toy.", art: 'goals' },
          { heading: "Small steps", body: "A big goal can feel far away. So take small steps, like adding a few coins after each quest." },
          { heading: "Cheer each step", body: "Every step gets you closer. Watch your dream jar fill up, and cheer when it is halfway!" },
        ],
        quiz: [
          {
            prompt: "How do you reach a big goal?",
            choices: ["All at once, today", "One small step at a time"],
            answer: 1,
            why: "Little steps add up until you get there.",
          },
          {
            prompt: "Your dream jar is half full. What does that mean?",
            choices: ["You are halfway there", "You have to start over", "The jar is broken"],
            answer: 0,
            why: "Half full means you have done half the work, so keep going!",
          },
        ],
        tryIt: { label: "Pick a dream goal", to: 'goal' },
      },
      middle: {
        title: "Reaching Big Goals",
        blurb: "Turn a big goal into small, doable steps.",
        pages: [
          { heading: "Too big to see", body: "A $40 goal can feel like it will take forever. But a big goal is really a lot of small steps stacked up. Breaking it into pieces makes it feel doable.", art: 'goals' },
          { heading: "Lily's plan", body: "Lily wants a $40 art set. She earns about $8 a week from quests and decides to save $5 of it. $40 divided by $5 is 8 weeks. Her checkpoints: $10 after 2 weeks, and $20 after 4 weeks, which is halfway." },
          { heading: "When plans slip", body: "In week 3, Lily spends all her coins on a snack and saves $0. She is behind, but she doesn't quit. The next week she does an extra quest and saves $10 instead of $5, and she is right back on track." },
          { heading: "Goals in Kid Kapital", body: "Your dream goal jar shows how close you are. A Team goal works the same way, except the whole family chips in together." },
        ],
        quiz: [
          {
            prompt: "You want $30 and save $5 a week. How many weeks will it take?",
            choices: ["5 weeks", "6 weeks", "7 weeks"],
            answer: 1,
            why: "$30 divided by $5 a week is 6 weeks.",
          },
          {
            prompt: "Your goal is $40. What is the halfway checkpoint?",
            choices: ["$10", "$30", "$20"],
            answer: 2,
            why: "Half of $40 is $20.",
          },
          {
            prompt: "You missed a week of saving. What is a good next step?",
            choices: ["Catch up with an extra quest or a bigger save", "Give up on the goal", "Pick a new goal every week"],
            answer: 0,
            why: "One missed week is fine, you just need a small catch-up.",
          },
        ],
        tryIt: { label: "Set a dream goal", to: 'goal' },
      },
      teen: {
        title: "SMART Goals",
        blurb: "Turn a wish into a plan with real numbers.",
        pages: [
          { heading: "What SMART means", body: "A SMART goal is Specific, Measurable, Achievable, Relevant and Time-bound. \"Save money\" is none of these. \"Save $150 for a bike in 10 weeks\" can be all five, as long as it fits your income and matters to you.", art: 'goals' },
          { heading: "Find the gap", body: "Start with the gap: what you need minus what you have. If the bike costs $150 and you already have $30, the gap is $120. Over 10 weeks, that is $120 / 10 = $12 a week." },
          { heading: "Is it achievable?", body: "If you earn $20 a week, $12 is 60% of your income. That is a lot, but doable if you cut back for 10 weeks. If you earn only $10 a week, saving $12 is impossible, so change a piece: more time, a cheaper bike or more income." },
          { heading: "Track and adjust", body: "Check in at milestones. After 4 weeks at $12, you should have $30 + $48 = $78. If you only have $66, you are $12 behind. Spread that over the 6 weeks left: $2 more a week, so $14 a week, and you still finish on time." },
        ],
        quiz: [
          {
            prompt: "A speaker costs $200. You have $50 and want it in 10 weeks. How much should you save each week?",
            choices: ["$20", "$15", "$25", "$5"],
            answer: 1,
            why: "The gap is $200 - $50 = $150, and $150 / 10 weeks is $15 a week.",
          },
          {
            prompt: "Which part of SMART does adding a deadline cover?",
            choices: ["Measurable", "Relevant", "Time-bound", "Achievable"],
            answer: 2,
            why: "A deadline makes the goal time-bound, so you know when to check if you made it.",
          },
          {
            prompt: "Your plan needs $12 a week, but you only earn $10 a week. What should you do?",
            choices: ["Change the time frame, the price or your income", "Nothing, just try harder", "Spend less on needs like food"],
            answer: 0,
            why: "A plan you can't afford isn't achievable, so adjust one of its pieces.",
          },
          {
            prompt: "After 4 weeks you should have $78 but you have $66, with 6 weeks left. How much extra per week gets you back on track?",
            choices: ["$12", "$3", "$6", "$2"],
            answer: 3,
            why: "You are $12 behind, and $12 spread over 6 weeks is $2 a week.",
          },
        ],
        tryIt: { label: "Set a dream goal", to: 'goal' },
      },
    },
  },

  // ---------------------------------------------------------------- checking-vs-savings
  {
    id: 'checking-vs-savings',
    art: 'bank',
    category: 'banking',
    versions: {
      middle: {
        title: "Two Kinds of Accounts",
        blurb: "One for spending, one for saving.",
        pages: [
          { heading: "Different jobs", body: "Banks offer different kinds of accounts. The two most common are a checking account and a savings account. Each one has its own job.", art: 'bank' },
          { heading: "Checking is for spending", body: "A checking account holds money you will spend soon. You can pay with a debit card, pay bills and take out cash. It is a lot like your Kid Kapital wallet." },
          { heading: "Savings is for later", body: "A savings account holds money you want to keep. It usually pays interest, so it grows a little over time. It is a lot like your piggy bank." },
          { heading: "Using both", body: "Say Grandma gives you $50. You might put $10 in checking to spend and $40 in savings for a bigger goal. Your money has two homes, and each one has a job." },
        ],
        quiz: [
          {
            prompt: "Which account is most like your Kid Kapital wallet?",
            choices: ["Savings", "Checking", "Neither"],
            answer: 1,
            why: "Checking holds money for spending soon, just like your wallet.",
          },
          {
            prompt: "Which account is usually best for money you want to grow?",
            choices: ["Savings", "Checking", "A shoebox"],
            answer: 0,
            why: "Savings accounts usually pay interest, so the money grows.",
          },
          {
            prompt: "You get $30 and put $8 in checking. How much goes to savings?",
            choices: ["$38", "$8", "$22"],
            answer: 2,
            why: "$30 minus $8 is $22.",
          },
        ],
        tryIt: { label: "Visit your piggy bank", to: 'grow' },
      },
      teen: {
        title: "Checking vs Savings",
        blurb: "Where money lives depends on its job.",
        pages: [
          { heading: "Checking", body: "A checking account is for everyday money moving in and out. It connects to a debit card, pays bills and can receive direct deposit from a job. It usually pays little or no interest, because its job is easy access, not growth.", art: 'bank' },
          { heading: "Savings", body: "A savings account is for money you are keeping. It pays interest, often shown as APY, the annual percentage yield, which includes the effect of compounding. Some savings accounts limit how often you can withdraw, which nudges you to leave the money alone." },
          { heading: "Interest math", body: "Say savings pays 4% APY and checking pays 0%. $500 left in checking for a year is still $500. In savings, it grows to about $500 x 1.04 = $520. Same money, $20 more just for being in the right place." },
          { heading: "Fees and overdrafts", body: "Some accounts charge a monthly fee unless you keep a minimum balance. In checking, spending more than you have is an overdraft, which can mean a fee or a declined payment. Keeping an eye on your balance avoids both." },
          { heading: "A simple setup", body: "Many people keep about a month of spending in checking and move the rest to savings. Pay comes in, bills go out of checking, and extra goes to savings. Your wallet and piggy work the same way." },
        ],
        quiz: [
          {
            prompt: "You keep $800 in savings at 3% APY for one year. About how much will you have?",
            choices: ["$803", "$824", "$830", "$880"],
            answer: 1,
            why: "$800 x 1.03 = $824.",
          },
          {
            prompt: "What is an overdraft?",
            choices: ["Earning extra interest", "Moving money into savings", "Spending more than is in your checking account"],
            answer: 2,
            why: "An overdraft means your spending went past your balance, which can lead to fees.",
          },
          {
            prompt: "Which account fits paying for lunch with a card?",
            choices: ["Checking", "Savings", "A loan"],
            answer: 0,
            why: "Checking is built for everyday spending and connects to a debit card.",
          },
        ],
        tryIt: { label: "Visit your piggy bank", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- debit-vs-credit
  {
    id: 'debit-vs-credit',
    art: 'cards',
    category: 'banking',
    versions: {
      middle: {
        title: "Debit and Credit Cards",
        blurb: "Two cards that look alike but work differently.",
        pages: [
          { heading: "Look alike, work differently", body: "Debit cards and credit cards look almost the same. Both have numbers, and both let you tap or swipe to pay. But where the money comes from is totally different.", art: 'cards' },
          { heading: "Debit: your own money", body: "A debit card takes money straight out of your own bank account. If you have $20 and buy a $5 book, $15 is left. Your Kid Kapital wallet works like this: the shop can only take coins you already have." },
          { heading: "Credit: borrowed money", body: "A credit card borrows money. The bank pays the store, and later you get a bill to pay the bank back. If you don't pay it all back on time, you pay extra, called interest." },
          { heading: "Pay it all back", body: "Grown-ups who use credit cards wisely pay the whole bill every month. That way the card is handy and they usually pay no interest at all." },
        ],
        quiz: [
          {
            prompt: "Whose money does a debit card spend?",
            choices: ["The bank's", "Your own", "The store's"],
            answer: 1,
            why: "A debit card takes money from your own account.",
          },
          {
            prompt: "You have $25 in your account and use your debit card for a $9 game. How much is left?",
            choices: ["$16", "$34", "$9"],
            answer: 0,
            why: "$25 minus $9 is $16.",
          },
          {
            prompt: "What happens when you use a credit card?",
            choices: ["The money disappears", "You get things for free", "You borrow money and must pay it back"],
            answer: 2,
            why: "A credit card is a loan, so you pay the bank back later.",
          },
        ],
        tryIt: { label: "Spend from your wallet", to: 'shop' },
      },
      teen: {
        title: "Debit vs Credit",
        blurb: "Your money now, or the bank's money later.",
        pages: [
          { heading: "Debit", body: "A debit card pulls money directly from your checking account, usually within a day or two. You can only spend what you have, apart from any overdraft your bank allows. It lets you pay by card without borrowing.", art: 'cards' },
          { heading: "Credit", body: "A credit card is a revolving loan. The bank sets a credit limit, the most you can owe at once. Each purchase borrows against that limit, and once a month you get a statement showing what you owe and a minimum payment." },
          { heading: "Pay in full", body: "If you pay the full statement balance by the due date, most cards charge no interest on purchases, thanks to a grace period. If you carry a balance, interest is charged on it, and new purchases may start costing interest too." },
          { heading: "The minimum trap", body: "Say you owe $1,000 at 24% APR, about 2% a month, and pay $30 a month. The first month's interest is about $20, so only about $10 of your $30 shrinks the debt. At that pace it takes years to pay off. Paying $200 a month instead clears it in about 6 months." },
          { heading: "Which to use", body: "Debit keeps you from spending money you don't have. Credit can be useful and builds a credit history, but only if you treat it like debit: spend only what you could pay off today." },
        ],
        quiz: [
          {
            prompt: "You owe $1,000 at about 2% a month and pay $30. About how much of that payment shrinks the debt?",
            choices: ["$30", "$20", "$10", "$2"],
            answer: 2,
            why: "About $20 goes to interest, so only about $10 reduces what you owe.",
          },
          {
            prompt: "How do you avoid interest on credit card purchases?",
            choices: ["Pay the full statement balance by the due date", "Pay the minimum on time", "Only use the card on weekends"],
            answer: 0,
            why: "Paying in full within the grace period usually means no interest on purchases.",
          },
          {
            prompt: "What is a credit limit?",
            choices: ["The money in your checking account", "The smallest purchase allowed", "The most you can owe on the card at once"],
            answer: 2,
            why: "The limit is the cap on how much the bank will let you borrow on the card.",
          },
          {
            prompt: "Where does money spent with a debit card come from?",
            choices: ["A loan from the bank", "Your checking account", "Your credit limit", "Next month's paycheck"],
            answer: 1,
            why: "Debit spends money you already have in checking.",
          },
        ],
        tryIt: { label: "Spend from your wallet", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- pin-safety
  {
    id: 'pin-safety',
    art: 'cards',
    category: 'protection',
    versions: {
      little: {
        title: "Your Secret PIN",
        blurb: "Your 4 numbers are just for you.",
        pages: [
          { heading: "A secret code", body: "To open Kid Kapital, you tap 4 secret numbers. That is your PIN. It keeps your coins safe.", art: 'cards' },
          { heading: "Keep it secret", body: "Don't tell your PIN to friends, even best friends. Only you and your grown-ups should know it." },
          { heading: "Cover it up", body: "When you tap your PIN, cover it with your hand so nobody can peek." },
        ],
        quiz: [
          {
            prompt: "A friend asks for your PIN. What do you say?",
            choices: ["Here it is!", "Sorry, it's a secret"],
            answer: 1,
            why: "Your PIN is just for you and your grown-ups, even if a friend asks.",
          },
          {
            prompt: "Who can know your PIN?",
            choices: ["You and your grown-ups", "Everyone at school", "Anyone who asks nicely"],
            answer: 0,
            why: "Keeping it between you and your grown-ups keeps your coins safe.",
          },
        ],
      },
      middle: {
        title: "Keep Your PIN Secret",
        blurb: "Why codes and passwords stay private.",
        pages: [
          { heading: "A PIN is a key", body: "PIN stands for personal identification number. Your 4-digit Kid Kapital PIN works like a key. Anyone who knows it could sign in as you and spend your coins in the shop.", art: 'cards' },
          { heading: "Pick a good one", body: "Easy PINs like 1234, 0000 or your birthday are the first ones a sneaky person would try. Ask a grown-up to help you pick numbers that are hard to guess but easy for you to remember. Kid Kapital also locks for a few minutes after too many wrong tries, so guessing is slow." },
          { heading: "Watch out for peekers", body: "Shoulder surfing is when someone peeks over your shoulder while you type. Cover the screen or keypad with your hand, and wait if someone is standing right behind you." },
          { heading: "If someone finds out", body: "If you think someone knows your PIN, tell a grown-up right away so they can change it. You are not in trouble. Fixing it fast is the smart move." },
        ],
        quiz: [
          {
            prompt: "Which PIN is the hardest to guess?",
            choices: ["1234", "0000", "8261"],
            answer: 2,
            why: "Mixed-up numbers are much harder to guess than patterns like 1234 or 0000.",
          },
          {
            prompt: "What is shoulder surfing?",
            choices: ["Peeking at someone while they type a PIN", "A beach sport", "Changing your PIN"],
            answer: 0,
            why: "Shoulder surfers watch you type, so cover the keypad with your hand.",
          },
          {
            prompt: "You think your brother saw your PIN. What should you do?",
            choices: ["Nothing", "Tell a grown-up so it can be changed", "Tell him a fake one"],
            answer: 1,
            why: "A new PIN makes the old one useless, so asking a grown-up fixes it.",
          },
        ],
      },
      teen: {
        title: "PINs, Passwords and ATMs",
        blurb: "Protecting the codes that guard your money.",
        pages: [
          { heading: "Codes are keys", body: "A PIN or password is often the only thing between a stranger and your account. Banks, apps and Kid Kapital all treat anyone who enters the right code as you. Apart from a parent helping you set things up, nobody should know yours.", art: 'cards' },
          { heading: "Strong codes", body: "Avoid PINs like 1234, 1111 or your birth year, which are among the first a thief would try. For passwords, length beats cleverness: a long phrase of unrelated words is hard to crack. Use a different password for each important account so one leak doesn't unlock everything. A password manager can remember them for you." },
          { heading: "ATM safety", body: "At an ATM, cover the keypad with your hand while you type. Choose machines in well-lit, busy places, like inside a bank. Check the card slot: if it looks loose, bulky or different from usual, someone may have attached a skimmer, a device that copies cards. Put your cash and card away before you walk off." },
          { heading: "Two-step login", body: "Many apps offer two-factor authentication: after your password, you also enter a code from your phone. Even if someone steals your password, they still can't get in. Turn it on wherever you can." },
          { heading: "If a code leaks", body: "Change it right away and tell a trusted adult. For a bank card, contact the bank to lock it. Many banks let you freeze a card in their app in seconds." },
        ],
        quiz: [
          {
            prompt: "How many different 4-digit PINs are possible, from 0000 to 9999?",
            choices: ["4,000", "9,999", "10,000", "1,000"],
            answer: 2,
            why: "Each of the 4 digits has 10 options, and 10 x 10 x 10 x 10 = 10,000.",
          },
          {
            prompt: "What is a card skimmer?",
            choices: ["A device hidden on a card reader that copies card info", "A type of credit card", "A bank fee"],
            answer: 0,
            why: "Skimmers secretly copy cards, so check the slot before you use an ATM.",
          },
          {
            prompt: "Why use a different password for each important account?",
            choices: ["It is easier to remember", "So one leaked password doesn't unlock everything", "Banks charge for repeats"],
            answer: 1,
            why: "If one site leaks your password, your other accounts stay locked.",
          },
          {
            prompt: "Someone steals your password, but you use two-factor authentication. What happens?",
            choices: ["They get right in", "Your account is deleted", "Your password changes itself", "They still need the extra code from your device"],
            answer: 3,
            why: "The second step blocks anyone who has only your password.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- credit-score
  {
    id: 'credit-score',
    art: 'credit-score',
    category: 'borrowing',
    versions: {
      teen: {
        title: "Your Credit Score",
        blurb: "How lenders decide whether to trust you.",
        pages: [
          { heading: "A report card for borrowing", body: "A credit report is a record of how you have handled borrowed money: which cards and loans you have, and whether you paid on time. A credit score is a number calculated from that report to sum it up. A higher score tells lenders you are more likely to pay them back.", art: 'credit-score' },
          { heading: "Who checks it", body: "Lenders use your credit to decide whether to lend to you and at what interest rate. In many places, landlords and phone companies may check it too. A better score can mean lower interest, which saves real money over the life of a loan." },
          { heading: "Paying on time", body: "Paying on time is usually the biggest factor. A payment that is very late can hurt a score for a long time. Setting up automatic payments of at least the minimum is an easy safety net, even if you plan to pay in full." },
          { heading: "Using a small share", body: "Credit utilization is how much of your limit you are using. Owe $300 on a $1,000 limit and your utilization is $300 / $1,000 = 30%. Lower is generally better: the same $300 on a $3,000 limit is only 10%. Using a small share and paying it off shows you don't depend on borrowing." },
          { heading: "Time and patience", body: "A longer history helps, so an old account in good standing is valuable. Applying for lots of new credit at once can lower a score a little. There is no quick trick. It is like trusted quests in Kid Kapital: a steady track record is what earns trust." },
        ],
        quiz: [
          {
            prompt: "You owe $450 on a card with a $1,500 limit. What is your utilization?",
            choices: ["45%", "30%", "15%", "3%"],
            answer: 1,
            why: "$450 / $1,500 = 0.30, which is 30%.",
          },
          {
            prompt: "Which habit usually matters most for a credit score?",
            choices: ["Paying on time", "Owning lots of cards", "Shopping at big stores"],
            answer: 0,
            why: "A history of on-time payments is the strongest sign you will pay back what you borrow.",
          },
          {
            prompt: "Your limit is $2,000. Which balance keeps your utilization lowest?",
            choices: ["$1,800", "$900", "$200", "$1,200"],
            answer: 2,
            why: "$200 is only 10% of $2,000, the smallest share of the four.",
          },
          {
            prompt: "How can a good credit score save you money?",
            choices: ["It pays you interest", "Lenders may offer you lower interest rates", "It lowers your taxes"],
            answer: 1,
            why: "Lenders often charge less interest to borrowers they trust more.",
          },
        ],
        tryIt: { label: "Build your track record", to: 'quests' },
      },
    },
  },

  // ---------------------------------------------------------------- good-and-bad-debt
  {
    id: 'good-and-bad-debt',
    art: 'credit-score',
    category: 'borrowing',
    versions: {
      teen: {
        title: "Good Debt, Bad Debt",
        blurb: "When borrowing helps you, and when it hurts.",
        pages: [
          { heading: "Not all debt is equal", body: "Debt is money you owe. Some borrowing helps you build something that grows in value or raises your income, like education, job training or a home. Other borrowing pays for things that lose value fast or are gone once used, like takeout, clothes or gadgets.", art: 'credit-score' },
          { heading: "Two questions", body: "Will this leave me better off long after the payments end? And is the interest low enough that the benefit beats the cost? A loan for a reliable used car to get to a job can pass. Putting a vacation on a high-interest card usually fails." },
          { heading: "The total cost", body: "The price tag is not the whole cost. Say you borrow $1,200 for a laptop and repay $110 a month for 12 months. You pay $110 x 12 = $1,320 in total, so borrowing cost you $120 on top of the price." },
          { heading: "Longer is not cheaper", body: "Stretching a loan lowers each payment but often raises the total. Borrow the same $1,200 and pay $60 a month for 24 months: $60 x 24 = $1,440, so it costs $240 extra, double the shorter loan." },
          { heading: "Even good debt has limits", body: "Borrowing for something worthwhile still has to fit your budget, or it squeezes out saving. And when you can, saving up first, like with your dream goal, means you pay $0 in interest." },
        ],
        quiz: [
          {
            prompt: "You borrow $900 and repay $85 a month for 12 months. What did borrowing cost you?",
            choices: ["$85", "$1,020", "$120", "$900"],
            answer: 2,
            why: "$85 x 12 = $1,020 in total, and $1,020 - $900 = $120.",
          },
          {
            prompt: "Which is usually closer to good debt?",
            choices: ["Training that raises your pay", "A takeout dinner on a credit card", "The newest phone every year"],
            answer: 0,
            why: "Training can raise your income for years, long after the loan is paid off.",
          },
          {
            prompt: "A longer loan with lower monthly payments usually means what?",
            choices: ["Less total interest", "More total interest", "No interest at all"],
            answer: 1,
            why: "More months of borrowing usually means more interest in total.",
          },
          {
            prompt: "What is the cheapest way to buy a $300 bike?",
            choices: ["A 12-month loan", "A credit card, paying the minimum", "A 24-month loan", "Saving up first and paying in full"],
            answer: 3,
            why: "Saving first means you pay just the price, with no interest at all.",
          },
        ],
        tryIt: { label: "Save up instead", to: 'goal' },
      },
    },
  },

  // ---------------------------------------------------------------- buy-now-pay-later
  {
    id: 'buy-now-pay-later',
    art: 'subscriptions',
    category: 'borrowing',
    versions: {
      teen: {
        title: "Buy Now, Pay Later",
        blurb: "Split payments feel small, but they stack up.",
        pages: [
          { heading: "How it works", body: "Buy now, pay later, or BNPL, splits a purchase into smaller payments. A common setup is four payments: one at checkout, then one every two weeks. A $120 jacket becomes 4 payments of $30. Many short plans charge no interest if every payment is on time.", art: 'subscriptions' },
          { heading: "It is still a loan", body: "Even at zero interest, BNPL is borrowing: you take the jacket home before you have paid for it. Some plans, especially longer ones, do charge interest, and many charge a late fee if a payment fails." },
          { heading: "Stacking", body: "The danger is stacking. One $30 payment feels easy. But say you also split $80 shoes into 4 x $20 and $60 headphones into 4 x $15. Now $30 + $20 + $15 = $65 is due every two weeks, from different apps on different dates." },
          { heading: "Late fees add up", body: "Say each missed payment costs a $7 late fee. Miss one payment on each of those three plans and that is $21 in fees, about a third of a whole round of payments. Depending on the lender and where you live, missed payments can also hurt your credit." },
          { heading: "Use it like cash", body: "A good rule: only use BNPL for something you could pay for in full today. Then splitting it is just a convenience, not a way to buy what you can't afford. If you can't buy it now, saving up in a dream goal is the zero-risk plan." },
        ],
        quiz: [
          {
            prompt: "A $200 purchase is split into 4 equal payments. How much is each payment?",
            choices: ["$40", "$50", "$25", "$20"],
            answer: 1,
            why: "$200 divided by 4 is $50.",
          },
          {
            prompt: "You have three plans due every two weeks: $25, $15 and $10. How much is due each time?",
            choices: ["$25", "$40", "$50"],
            answer: 2,
            why: "$25 + $15 + $10 = $50, all due on the same schedule.",
          },
          {
            prompt: "When is BNPL safest to use?",
            choices: ["When you could pay the full price today anyway", "When you can't afford it yet", "When you already have other plans running"],
            answer: 0,
            why: "If you could pay in full, a missed payment or a stack of plans is far less likely to hurt.",
          },
          {
            prompt: "Is a zero-interest BNPL plan a form of borrowing?",
            choices: ["No, it is free money", "Yes, you owe the rest later", "Only if you pay early", "Only when shopping online"],
            answer: 1,
            why: "You get the item before paying for it, so you owe money until the last payment.",
          },
        ],
        tryIt: { label: "Save up instead", to: 'goal' },
      },
    },
  },

  // ---------------------------------------------------------------- insurance
  {
    id: 'insurance',
    art: 'insurance',
    category: 'protection',
    versions: {
      middle: {
        title: "What Is Insurance?",
        blurb: "Many chip in so a few unlucky ones are covered.",
        pages: [
          { heading: "Bad luck happens", body: "Most days are fine. But sometimes something big goes wrong, like a house floods or a car crashes. Fixing it can cost more than one family could easily pay.", art: 'insurance' },
          { heading: "Chipping in together", body: "Insurance is a way to share that risk. Lots of people each pay a small amount, called a premium, into one big pot. When something bad happens to one of them, the pot helps pay." },
          { heading: "A class example", body: "Say 20 kids each put $1 into a jar to cover lost library books. That is $20. If one kid loses a $15 book, the jar pays for it. Each kid risked only $1 instead of $15." },
          { heading: "Worth it?", body: "Most people pay for insurance and never need a big payout, and that is good news! They are paying for peace of mind, knowing a big surprise won't wreck their plans." },
        ],
        quiz: [
          {
            prompt: "What is a premium?",
            choices: ["The small amount you pay for insurance", "The money you get after an accident", "A kind of quest"],
            answer: 0,
            why: "A premium is your share paid into the insurance pot.",
          },
          {
            prompt: "30 people each pay $2 into an insurance pot. How much is in the pot?",
            choices: ["$32", "$60", "$15"],
            answer: 1,
            why: "30 people times $2 each is $60.",
          },
          {
            prompt: "You paid for insurance and nothing went wrong. Did you waste your money?",
            choices: ["Yes, totally", "Yes, you should get it all back", "No, you were protected the whole time"],
            answer: 2,
            why: "Insurance buys protection, and having nothing go wrong is the best result.",
          },
        ],
      },
      teen: {
        title: "How Insurance Works",
        blurb: "Sharing risk, premiums and deductibles.",
        pages: [
          { heading: "Pooling risk", body: "Insurance pools risk. Many people pay a premium into a shared pool, and the insurer pays the costs of the few who have a covered loss. It works because an insurer can estimate roughly how many losses a large group will have, even though nobody knows who will have them.", art: 'insurance' },
          { heading: "Key words", body: "The premium is what you pay, often monthly or yearly. The deductible is the part of a claim you pay yourself before insurance kicks in. Coverage is what the policy protects, up to a limit. A claim is your request for the insurer to pay." },
          { heading: "Deductible example", body: "Your phone has insurance with a $100 deductible, and a repair costs $350. You pay the first $100 and the insurer pays $350 - $100 = $250. If the repair cost only $80, it would be under the deductible, so you would pay all $80 yourself." },
          { heading: "The trade-off", body: "A higher deductible usually means a lower premium, because you agree to handle more small costs. Say Plan A costs $10 a month with a $50 deductible, and Plan B costs $6 a month with a $200 deductible. Plan B saves $48 a year, but costs $150 more out of pocket if you make one claim." },
          { heading: "Insure the big stuff", body: "Insurance matters most for losses you could not afford, like a home, a car or your health. For small things, an emergency fund often works better: you keep the premiums and cover small surprises yourself." },
        ],
        quiz: [
          {
            prompt: "Your deductible is $250 and a covered repair costs $900. How much does the insurer pay?",
            choices: ["$900", "$250", "$1,150", "$650"],
            answer: 3,
            why: "You pay the first $250, so the insurer pays $900 - $250 = $650.",
          },
          {
            prompt: "Your deductible is $150 and a repair costs $120. Who pays?",
            choices: ["You pay all $120", "The insurer pays all $120", "You each pay half"],
            answer: 0,
            why: "The repair is under the deductible, so it is all yours to pay.",
          },
          {
            prompt: "Choosing a higher deductible usually does what to your premium?",
            choices: ["Raises it", "Lowers it", "Nothing"],
            answer: 1,
            why: "You take on more of the small costs, so the insurer charges you less.",
          },
          {
            prompt: "Why can insurers afford to pay big claims?",
            choices: ["Claims are always small", "They rarely pay anything", "Many people pay premiums but only a few have losses"],
            answer: 2,
            why: "Premiums from the many cover the losses of the few.",
          },
        ],
        tryIt: { label: "Start a rainy-day piggy", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- identity-theft
  {
    id: 'identity-theft',
    art: 'identity',
    category: 'protection',
    versions: {
      little: {
        title: "Private Stuff Stays Private",
        blurb: "Some things about you are just for family.",
        pages: [
          { heading: "Private things", body: "Some things about you are private, like where you live, your phone number and your secret PIN.", art: 'identity' },
          { heading: "Not for strangers", body: "Online or in games, don't tell people your private things, even if they seem nice." },
          { heading: "Tell a grown-up", body: "If someone asks for your private things, stop and tell a grown-up. That is the right thing to do!" },
        ],
        quiz: [
          {
            prompt: "Which one is private?",
            choices: ["Your favorite color", "Where you live"],
            answer: 1,
            why: "Where you live is private, so it stays with your family.",
          },
          {
            prompt: "Someone in a game asks where you live. What do you do?",
            choices: ["Tell a grown-up", "Tell them", "Tell them your school instead"],
            answer: 0,
            why: "A grown-up can help, and your private things stay safe.",
          },
        ],
      },
      middle: {
        title: "Guard Your Identity",
        blurb: "Your personal info is valuable, so keep it safe.",
        pages: [
          { heading: "What is your identity?", body: "Your identity is the info that shows you are you: your full name, birthday, address, school and account numbers. Together they work like keys that open your accounts.", art: 'identity' },
          { heading: "Identity theft", body: "Identity theft is when someone steals that info and pretends to be you. They might sneak into your accounts or even open new ones in your name. Kids can be targets too, because problems on a kid's name can go unnoticed for years." },
          { heading: "Oversharing", body: "A post that says \"Happy 10th birthday to me! Off to Maple Street School!\" tells strangers your age, your birthday and your school. Keep posts fun but vague, and keep profiles private." },
          { heading: "Pieces add up", body: "One piece, like your pet's name, seems harmless. But many accounts use questions like that to reset passwords. A thief collects pieces until they have enough, so think before you share any of them." },
        ],
        quiz: [
          {
            prompt: "Which of these is safest to post?",
            choices: ["My address is 12 Oak Road", "I just finished a giant puzzle!", "My birthday is May 3 and I go to Lake School"],
            answer: 1,
            why: "A fun update that leaves out personal details is safe to share.",
          },
          {
            prompt: "What is identity theft?",
            choices: ["Losing your backpack", "Forgetting your name", "Someone using your info to pretend to be you"],
            answer: 2,
            why: "Identity thieves use your details to act as if they were you.",
          },
          {
            prompt: "Why can sharing your pet's name be risky?",
            choices: ["It can be the answer to a password reset question", "Pets don't like it", "It costs money"],
            answer: 0,
            why: "Many accounts ask for a pet's name to reset a password, so it can be a key.",
          },
        ],
      },
      teen: {
        title: "Protecting Your Identity",
        blurb: "Identity theft, oversharing and checking statements.",
        pages: [
          { heading: "What thieves want", body: "Identity theft is using someone's personal information, like their name, birth date, address, account numbers or government ID number, to pretend to be them. Thieves use it to drain accounts, make purchases or open new credit in the victim's name, which can damage that person's credit.", art: 'identity' },
          { heading: "Oversharing", body: "Many leaks are self-inflicted. Birthdays, hometowns, school names, pets and first cars show up in posts and quizzes, and they are also common security questions. A \"find your superhero name\" quiz that uses your birth month and first pet is a data grab dressed up as fun." },
          { heading: "Lock things down", body: "Use strong, unique passwords and two-factor authentication. Keep social profiles private. Shred mail that shows account details. Avoid logging into money apps on public Wi-Fi you don't trust." },
          { heading: "Check your statements", body: "Read your bank and card statements every month. Look for charges you don't recognize, even tiny ones: thieves sometimes test a stolen card with a $1 charge before a big one. In Kid Kapital, your activity feed shows every coin in and out, so it is great practice." },
          { heading: "If it happens", body: "Act fast. Tell a trusted adult, contact the bank to freeze the card or account, and change your passwords. In many places you can also freeze your credit, which helps stop new accounts being opened in your name. The sooner it is caught, the easier it is to fix." },
        ],
        quiz: [
          {
            prompt: "You see a $1 charge from a store you have never heard of. What should you do?",
            choices: ["Ignore it, it is only $1", "Report it to the bank right away", "Wait for a bigger charge"],
            answer: 1,
            why: "Tiny unknown charges can be a test before a big one, so report them fast.",
          },
          {
            prompt: "Why are online quizzes about your first pet and birth month risky?",
            choices: ["They take too long", "They always contain viruses", "The answers often match security questions"],
            answer: 2,
            why: "Those answers can help someone reset your passwords.",
          },
          {
            prompt: "What does a credit freeze do?",
            choices: ["Helps stop new credit being opened in your name", "Cancels all your debt", "Lowers your interest rate"],
            answer: 0,
            why: "A freeze blocks most lenders from checking your credit, so thieves can't easily open accounts as you.",
          },
          {
            prompt: "How often should you check your bank statements?",
            choices: ["Once a year", "Only if a payment fails", "Never, the bank does it", "Every month"],
            answer: 3,
            why: "Monthly checks catch problems early, when they are easiest to fix.",
          },
        ],
      },
    },
  },
];
