// Expansion pack C: investing, the economy and planning ahead.
// Same rules as lessons-content.ts: plain text only, no em or en dashes, no emoji,
// every worked number double-checked. Rates in examples are made up for the math,
// never statistics and never a promise: investing can lose money.
import type { Lesson } from './learn';

export const PACK_C: Lesson[] = [
  // ---------------------------------------------------------------- stocks
  {
    id: 'stocks',
    art: 'stocks',
    category: 'investing',
    versions: {
      little: {
        title: "A Slice of the Shop",
        blurb: "You can own a little piece of a company.",
        pages: [
          { heading: "The pizza shop", body: "Picture a pizza shop cut into slices, like a pizza. Each slice is a little piece of the whole shop.", art: 'stocks' },
          { heading: "Owning a slice", body: "If you buy one slice, you own a tiny part of the shop. That tiny part is called a stock." },
          { heading: "Busy or quiet", body: "When lots of people buy pizza, your slice can be worth more. When the shop is quiet, it can be worth less." },
        ],
        quiz: [
          {
            prompt: "What is a stock?",
            choices: ["A tiny piece of a company", "A kind of pizza topping"],
            answer: 0,
            why: "A stock is a small piece of a company that you can own.",
          },
          {
            prompt: "Lots of people buy pizza at the shop. What can happen to your slice?",
            choices: ["It disappears", "It turns into a chore", "It can be worth more"],
            answer: 2,
            why: "When a company does well, the pieces of it can be worth more.",
          },
        ],
        tryIt: { label: "Try the rocket fund", to: 'grow' },
      },
      middle: {
        title: "What Is a Stock?",
        blurb: "Owning a small piece of a real company.",
        pages: [
          { heading: "A company in pieces", body: "Big companies are split into tiny pieces called shares, or stocks. Anyone who buys a share owns a small part of the company. These owners are called shareholders.", art: 'stocks' },
          { heading: "A story with numbers", body: "Say Sunny Scooters is split into 100 shares, and Leo buys 1 of them for $10. Leo now owns 1 out of 100 pieces, which is 1% of the company. That is small, but it is real." },
          { heading: "Why the price moves", body: "If Sunny Scooters sells lots of scooters, more people want its shares, and the price might rise to $13. If sales slump, the price might fall to $7. Leo can't know ahead of time which way it will go." },
          { heading: "Just like the rocket", body: "Your rocket fund goes up some weeks and down others. Stocks behave the same way, which is why people only invest money they won't need soon." },
        ],
        quiz: [
          {
            prompt: "A company is split into 100 shares and you own 1. What part do you own?",
            choices: ["10%", "1%", "100%"],
            answer: 1,
            why: "1 out of 100 pieces is 1% of the company.",
          },
          {
            prompt: "Leo's $10 share rises to $13. How much more is it worth?",
            choices: ["$3", "$13", "$23"],
            answer: 0,
            why: "$13 minus the $10 he paid is $3 more.",
          },
          {
            prompt: "Which is true about stock prices?",
            choices: ["They only go up", "They never change", "They can go up or down"],
            answer: 2,
            why: "Stock prices move with how a company is doing and how many people want its shares.",
          },
        ],
        tryIt: { label: "Try the rocket fund", to: 'grow' },
      },
      teen: {
        title: "Stocks and Shareholders",
        blurb: "How owning shares can grow, or shrink, your money.",
        pages: [
          { heading: "Why companies sell shares", body: "A company that wants to grow can sell shares to raise money. Buyers become part owners, called shareholders. After that, shares are bought and sold between investors on a stock exchange, and the price changes throughout the trading day.", art: 'stocks' },
          { heading: "Price per share", body: "If investors value a company at $1,000,000 and it has 100,000 shares, each share trades for about $1,000,000 / 100,000 = $10. The total value of all the shares is called market capitalization, or market cap." },
          { heading: "Two ways to earn", body: "Buy 4 shares at $25 each for $100. If the price rises to $30, your shares are worth 4 x $30 = $120, a $20 gain, or 20%. Some companies also pay a dividend, a share of profits. A $0.50 dividend per share would pay you 4 x $0.50 = $2." },
          { heading: "And one way to lose", body: "If the price falls to $20 instead, your shares are worth 4 x $20 = $80, a $20 loss. A gain or loss only becomes locked in when you sell. Companies can also struggle for years or even fail, so a single stock is a big bet on one business." },
        ],
        quiz: [
          {
            prompt: "A company is valued at $500,000 and has 50,000 shares. About what is one share worth?",
            choices: ["$1", "$50", "$100", "$10"],
            answer: 3,
            why: "$500,000 divided by 50,000 shares is $10 a share.",
          },
          {
            prompt: "You buy 5 shares at $20 and the price rises to $24. What is your gain?",
            choices: ["$20", "$4", "$24", "$120"],
            answer: 0,
            why: "Each share gained $4, and 5 x $4 is $20.",
          },
          {
            prompt: "What is a dividend?",
            choices: ["A fee for buying shares", "A share of company profits paid to shareholders", "A drop in the stock price"],
            answer: 1,
            why: "Some companies pass part of their profits to shareholders as dividends.",
          },
        ],
        tryIt: { label: "Try the rocket fund", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- index-funds
  {
    id: 'index-funds',
    art: 'index-fund',
    category: 'investing',
    versions: {
      middle: {
        title: "Eggs in Many Baskets",
        blurb: "A fund holds lots of companies at once.",
        pages: [
          { heading: "The egg problem", body: "If you carry all your eggs in one basket and trip, they all break. If you spread them across many baskets, one fall only breaks a few. Investors use this idea all the time.", art: 'index-fund' },
          { heading: "What a fund is", body: "A fund is like a giant basket that holds tiny pieces of many companies. Buying one share of the fund gives you a little bit of all of them. An index fund simply holds every company on a list, like the biggest companies in a country." },
          { heading: "Why it helps", body: "Say a fund holds 100 companies and one of them has a terrible year. That company is only a small part of the basket, so the fund drops much less than that company did. The fund can still go down, though, when lots of companies have a bad year together." },
          { heading: "The tiny fee", body: "Funds charge a small yearly fee to run. A 1% fee on $100 costs $1 a year. A 0.1% fee costs just 10 cents. Small fees leave more of the growth for you." },
        ],
        quiz: [
          {
            prompt: "What does an index fund hold?",
            choices: ["Just one company", "Small pieces of many companies", "Only cash"],
            answer: 1,
            why: "An index fund spreads your money across every company on its list.",
          },
          {
            prompt: "A fund charges a 1% yearly fee. What does it cost on $200?",
            choices: ["$1", "$20", "$2"],
            answer: 2,
            why: "1% of $200 is $2.",
          },
          {
            prompt: "Can an index fund go down?",
            choices: ["Yes, when many of its companies have a bad time", "No, never", "Only on weekends"],
            answer: 0,
            why: "Spreading out lowers risk, but a fund still drops when lots of its companies do.",
          },
        ],
        tryIt: { label: "Compare piggy and rocket", to: 'grow' },
      },
      teen: {
        title: "Index Funds and Fees",
        blurb: "Owning the whole market, and why fees matter.",
        pages: [
          { heading: "What an index is", body: "An index is a list that tracks a group of investments, such as the S&P 500, which follows about 500 large US companies. An index fund buys everything on the list, so one purchase spreads your money across hundreds of companies.", art: 'index-fund' },
          { heading: "Passive vs active", body: "An index fund is passive: it just follows the list. An active fund pays managers to pick stocks they hope will win, which usually means higher fees. After fees, many active funds end up behind a simple index fund over long periods, though some do better." },
          { heading: "The expense ratio", body: "A fund's yearly fee is its expense ratio, taken as a percent of what you have invested. On $10,000, a 0.05% fee is $5 a year, while a 1% fee is $100 a year. You never get a bill. The fee quietly comes out of the fund's value." },
          { heading: "Fees compound too", body: "Say $10,000 grows at a made-up 6% a year before fees for 20 years. With a 0.05% fee, it grows at about 5.95% and ends near $31,770. With a 1% fee, it grows at 5% and ends near $26,533. That one percent costs about $5,200." },
        ],
        quiz: [
          {
            prompt: "You have $4,000 in a fund with a 0.5% expense ratio. What is the yearly fee?",
            choices: ["$2", "$20", "$40", "$200"],
            answer: 1,
            why: "0.5% of $4,000 is $20.",
          },
          {
            prompt: "What does an index fund do?",
            choices: ["Holds everything on a list that tracks part of the market", "Picks only the hottest stocks", "Guarantees a yearly return", "Keeps your money in cash"],
            answer: 0,
            why: "An index fund follows its list instead of trying to pick winners.",
          },
          {
            prompt: "Two funds hold the same companies. Fund A charges 0.1% and Fund B charges 1.2%. Over 20 years, which likely leaves you more?",
            choices: ["Fund B", "They end the same", "Fund A"],
            answer: 2,
            why: "With the same holdings, the lower fee keeps more of the growth working for you year after year.",
          },
        ],
        tryIt: { label: "Compare piggy and rocket", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- time-in-the-market
  {
    id: 'time-in-the-market',
    art: 'time-growth',
    category: 'investing',
    versions: {
      middle: {
        title: "Start Early, Grow Big",
        blurb: "Why time is the secret ingredient.",
        pages: [
          { heading: "A tree, not a sprout", body: "A tree planted today is tiny. Give it 10 years and it is taller than your house. Money that is invested can grow the same slow way, as long as it has time.", art: 'time-growth' },
          { heading: "A story with numbers", body: "Nora invests $500 when she is 10. Let's pretend it grows 7% every year, which is just a number for the math. At 20 it is about $984. At 30, about $1,935. At 40, about $3,806. It roughly doubles every 10 years." },
          { heading: "Bumps along the way", body: "Real investments don't grow the same amount every year. Some years they go up, some years they go down. Money that stays invested for a long time has more years to make up for the bad ones." },
          { heading: "Leave it alone", body: "The trick is patience. If Nora took her money out every time it dipped, she would miss the years when it grew. Like your piggy bank, growth builds on growth, so time does a lot of the work." },
        ],
        quiz: [
          {
            prompt: "Nora's money roughly doubles every 10 years. About how much is $500 worth after 20 years?",
            choices: ["$1,000", "$2,000", "$520"],
            answer: 1,
            why: "$500 doubles to about $1,000, then doubles again to about $2,000.",
          },
          {
            prompt: "Why does starting early help?",
            choices: ["Your money has more years to grow", "Kids get special prices", "Early money never goes down"],
            answer: 0,
            why: "More years means more time for growth to build on itself.",
          },
          {
            prompt: "Do real investments grow the same amount every year?",
            choices: ["Yes, always", "Only if you check them daily", "No, some years go up and some go down"],
            answer: 2,
            why: "Real investments bounce around, which is why time to recover matters.",
          },
        ],
        tryIt: { label: "Check on your rocket", to: 'grow' },
      },
      teen: {
        title: "Time in the Market",
        blurb: "Why when you start can matter more than how much.",
        pages: [
          { heading: "Compounding over years", body: "You have seen compounding in your piggy, week by week. Investing works on the same formula over years: amount = start x (1 + rate) ^ years. The rate isn't fixed like the piggy's, but the longer money stays invested, the more years of growth it can stack up.", art: 'time-growth' },
          { heading: "Worked example", body: "Two friends each invest $1,000 once. Sam does it at 15, Jo at 25. Assume a made-up 7% a year, and both check at 65. Sam's money grows for 50 years: $1,000 x 1.07^50 is about $29,457. Jo's grows for 40 years: about $14,974. Ten extra years nearly doubled the result." },
          { heading: "Why the gap is so big", body: "By the Rule of 72, money at 7% doubles about every 72 / 7, or roughly 10 years. Sam's head start buys one extra doubling, and that doubling happens on the biggest numbers at the end." },
          { heading: "Time in, not timing", body: "Trying to jump out before drops and back in before rises is called timing the market, and even professionals struggle to do it well. Missing a few strong days can cost a lot. Staying invested through dips has rewarded patient investors over long stretches in the past, but the past is not a promise." },
        ],
        quiz: [
          {
            prompt: "Using the Rule of 72, about how often does money double at a 9% yearly rate?",
            choices: ["Every 9 years", "Every 72 years", "Every 4 years", "Every 8 years"],
            answer: 3,
            why: "72 divided by 9 is 8, so about every 8 years.",
          },
          {
            prompt: "$1,000 grows at a made-up 10% a year. What is it worth after 2 years?",
            choices: ["$1,200", "$1,210", "$1,100", "$1,020"],
            answer: 1,
            why: "$1,000 x 1.10 = $1,100, then $1,100 x 1.10 = $1,210.",
          },
          {
            prompt: "What does timing the market mean?",
            choices: ["Trying to sell before drops and buy before rises", "Investing on your birthday", "Leaving money invested for a long time"],
            answer: 0,
            why: "Timing the market means guessing short-term moves, which is very hard to do well.",
          },
        ],
        tryIt: { label: "Check on your rocket", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- dollar-cost-averaging
  {
    id: 'dollar-cost-averaging',
    art: 'time-growth',
    category: 'investing',
    versions: {
      teen: {
        title: "Dollar-Cost Averaging",
        blurb: "Invest the same amount on a schedule.",
        pages: [
          { heading: "The idea", body: "Dollar-cost averaging means investing a fixed amount on a regular schedule, like $60 every month, no matter what the price is. You never have to guess the perfect moment to buy.", art: 'time-growth' },
          { heading: "Worked example", body: "You invest $60 a month in a fund. Month 1 the price is $10, so you get 6 shares. Month 2 it drops to $6, so you get 10 shares. Month 3 it is $12, so you get 5 shares. That is 21 shares for $180." },
          { heading: "More shares when it's cheap", body: "Your average cost is $180 / 21, about $8.57 a share. The average of the three prices was ($10 + $6 + $12) / 3, about $9.33. Because a fixed amount buys more shares when prices are low, your average cost lands below the average price." },
          { heading: "What it does not do", body: "Dollar-cost averaging does not guarantee a profit. If prices keep falling, you still lose money. Its real strengths are building a steady habit and taking the stress out of guessing when to buy." },
        ],
        quiz: [
          {
            prompt: "You invest $30 when the price is $3. How many shares do you get?",
            choices: ["3", "30", "10", "90"],
            answer: 2,
            why: "$30 divided by $3 a share is 10 shares.",
          },
          {
            prompt: "Why does dollar-cost averaging buy more shares when prices are low?",
            choices: ["The amount stays fixed, so each dollar buys more cheap shares", "Brokers give bonus shares on sale days", "It always waits for the lowest price"],
            answer: 0,
            why: "A fixed amount divided by a lower price means more shares.",
          },
          {
            prompt: "You spent $120 and own 15 shares. What is your average cost per share?",
            choices: ["$15", "$12", "$9", "$8"],
            answer: 3,
            why: "$120 divided by 15 shares is $8 a share.",
          },
          {
            prompt: "Which is true about dollar-cost averaging?",
            choices: ["It guarantees you can't lose", "It builds a habit but can still lose money", "It only works with crypto"],
            answer: 1,
            why: "It takes out the guessing, but if prices keep falling your investment still loses value.",
          },
        ],
        tryIt: { label: "Visit your rocket fund", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- crypto-and-hype
  {
    id: 'crypto-and-hype',
    art: 'crypto',
    category: 'investing',
    versions: {
      teen: {
        title: "Crypto and Hype",
        blurb: "Big swings, loud buzz and keeping a clear head.",
        pages: [
          { heading: "What crypto is", body: "Cryptocurrencies are digital coins tracked on a shared online record called a blockchain. Some people use them to send money, and many buy them hoping the price goes up. Most coins don't come with company profits or interest behind them, so the price depends mostly on what other buyers will pay.", art: 'crypto' },
          { heading: "Volatile means wild", body: "Crypto prices can swing far more than your rocket fund. Drops have a nasty math twist: if $100 falls 50%, you have $50, and now it needs to gain 100% just to get back to $100. Big losses take even bigger gains to recover." },
          { heading: "Hype and FOMO", body: "When a coin shoots up, you hear about it everywhere, and it can feel like everyone is getting rich but you. That feeling is called FOMO, fear of missing out. By the time something is all over social media, the big jump has often already happened, and late buyers can be left holding the drop." },
          { heading: "Clear-head rules", body: "Some people do make money in crypto, and some lose a lot. A few rules help with anything speculative: only invest money you could lose without it hurting, never use money you need soon, and don't buy what you can't explain to someone else. Be extra careful of anyone promising guaranteed returns, since that is a classic scam sign." },
        ],
        quiz: [
          {
            prompt: "A coin worth $200 drops 50%. What gain does it need to get back to $200?",
            choices: ["50%", "25%", "200%", "100%"],
            answer: 3,
            why: "It falls to $100, and going from $100 back to $200 is a 100% gain.",
          },
          {
            prompt: "What is FOMO?",
            choices: ["Fear of missing out", "A type of crypto wallet", "A safe savings account"],
            answer: 0,
            why: "FOMO is the rush to buy because it feels like everyone else is winning.",
          },
          {
            prompt: "Which money is best kept out of speculative investments?",
            choices: ["Money you could afford to lose", "Money you need for something next month", "Money you have studied and understand"],
            answer: 1,
            why: "Money you need soon should not be exposed to big swings right before you need it.",
          },
          {
            prompt: "Someone online promises a coin will double, guaranteed. What is the best move?",
            choices: ["Buy fast before it's too late", "Tell friends to buy too", "Treat it as a warning sign and walk away"],
            answer: 2,
            why: "No honest investment can guarantee returns, so a promise like that is a red flag.",
          },
        ],
        tryIt: { label: "See the rocket's swings", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- scarcity
  {
    id: 'scarcity',
    art: 'needs-wants',
    category: 'economy',
    versions: {
      little: {
        title: "Not Enough for Everything",
        blurb: "We can't have everything, so we choose.",
        pages: [
          { heading: "One swing", body: "The park has one swing, and three kids want a turn. There is not enough swing for everyone at once.", art: 'needs-wants' },
          { heading: "Taking turns", body: "When there is not enough of something, we share, take turns or pick what matters most." },
          { heading: "Coins are like that", body: "You have only so many coins. So you choose which shop reward you want most." },
        ],
        quiz: [
          {
            prompt: "Three kids want one swing. What can they do?",
            choices: ["Take turns", "All sit at once"],
            answer: 0,
            why: "Taking turns is a fair way to share something there is not enough of.",
          },
          {
            prompt: "You have a few coins and want lots of things. What do you do?",
            choices: ["Get everything", "Pick what you want most", "Cry"],
            answer: 1,
            why: "Coins run out, so you choose the thing that matters most to you.",
          },
        ],
        tryIt: { label: "Look in the shop", to: 'shop' },
      },
      middle: {
        title: "Scarcity",
        blurb: "Why nobody can have everything they want.",
        pages: [
          { heading: "Wants never end", body: "People always want more things: more toys, more games, more time to play. But the stuff we use to make things is limited. There is only so much land, wood, water, time and people to do the work. This is called scarcity.", art: 'needs-wants' },
          { heading: "A town story", body: "Maple Town has $1,000 left this year. The new slide costs $800, and new library books cost $600. Together that is $1,400, which is $400 more than the town has. The town has to choose, or buy less of one." },
          { heading: "Everyone faces it", body: "Families, towns and even whole countries deal with scarcity. Rich people face it too, because everyone has only 24 hours in a day." },
          { heading: "Your coins and time", body: "Your Wallet only has so many coins, and your week only has so many hours for quests and fun. Scarcity is why choosing well matters." },
        ],
        quiz: [
          {
            prompt: "What does scarcity mean?",
            choices: ["There is plenty of everything", "Things are always free", "There is not enough to give everyone everything they want"],
            answer: 2,
            why: "Scarcity means wants are bigger than the things we have to fill them.",
          },
          {
            prompt: "A slide costs $800 and books cost $600. The town has $1,000. How much is it short to buy both?",
            choices: ["$400", "$200", "$1,400"],
            answer: 0,
            why: "$800 + $600 is $1,400, and $1,400 minus $1,000 is $400.",
          },
          {
            prompt: "Which of these is scarce for every single person?",
            choices: ["Wishes", "Time", "Daydreams"],
            answer: 1,
            why: "Everyone gets only 24 hours a day, no matter how much money they have.",
          },
        ],
        tryIt: { label: "Choose in the shop", to: 'shop' },
      },
      teen: {
        title: "Scarcity and Choices",
        blurb: "Limited resources, unlimited wants.",
        pages: [
          { heading: "The core problem", body: "Economics starts with one fact: human wants are practically unlimited, but resources are not. Resources include land, materials, workers, tools and time. Because they are scarce, every person, business and government has to decide how to use them.", art: 'needs-wants' },
          { heading: "Who gets it?", body: "When something is scarce, there has to be a way to decide who gets it. Societies use prices, first come first served, lotteries, need, or rules. A concert hall with 500 seats and 2,000 fans who want in has to use one of these. Each way is fair in some eyes and unfair in others." },
          { heading: "Prices as a signal", body: "Prices are one of the main ways markets handle scarcity. If 2,000 fans want 500 seats, higher prices thin the crowd until 500 people are willing to pay. That rations seats to people who will pay most, which is why some events use lotteries or price caps instead." },
          { heading: "Scarce is not the same as rare", body: "Scarce means limited compared to how much people want it. Air is everywhere and free because there is enough for everyone. A sandwich is common, but it still is not free, because the bread, the time and the work to make it are limited." },
        ],
        quiz: [
          {
            prompt: "Why does scarcity force choices?",
            choices: ["Because stores close early", "Because only governments have resources", "Because people want more than the resources available", "Because prices never change"],
            answer: 2,
            why: "Limited resources can't cover unlimited wants, so something has to be chosen over something else.",
          },
          {
            prompt: "A hall has 500 seats and 2,000 fans want in. How many fans will miss out?",
            choices: ["1,500", "500", "2,500", "1,000"],
            answer: 0,
            why: "2,000 fans minus 500 seats leaves 1,500 fans without a seat.",
          },
          {
            prompt: "Which is a way markets ration scarce goods?",
            choices: ["Ignoring demand", "Prices", "Making everything free"],
            answer: 1,
            why: "Prices rise until the number of people willing to pay matches what is available.",
          },
        ],
        tryIt: { label: "Choose in the shop", to: 'shop' },
      },
    },
  },

  // ---------------------------------------------------------------- trade
  {
    id: 'trade',
    art: 'trade',
    category: 'economy',
    versions: {
      little: {
        title: "Fair Trades",
        blurb: "Swapping can make both people happy.",
        pages: [
          { heading: "A lunch swap", body: "Max has two apples. Lily has two bananas. Max wants a banana, and Lily wants an apple.", art: 'trade' },
          { heading: "Everyone wins", body: "They swap one apple for one banana. Now both of them have an apple and a banana. Both are happier!" },
          { heading: "Fair and kind", body: "A good trade is one both people say yes to. Nobody should be tricked or pushed." },
        ],
        quiz: [
          {
            prompt: "Max and Lily swap fruit. Who is happier?",
            choices: ["Only Max", "Both of them"],
            answer: 1,
            why: "Each one got something they wanted, so both are better off.",
          },
          {
            prompt: "What makes a trade fair?",
            choices: ["Both people say yes", "One person grabs it", "Nobody asks"],
            answer: 0,
            why: "A fair trade is one both people choose because they like the deal.",
          },
        ],
        tryIt: { label: "See today's quests", to: 'quests' },
      },
      middle: {
        title: "Why People Trade",
        blurb: "Doing what you're good at, then swapping.",
        pages: [
          { heading: "Both sides win", body: "A trade only happens when both people think they are getting something better than what they give up. That is why a fair trade makes both sides better off, not just one.", art: 'trade' },
          { heading: "Specializing", body: "Specializing means focusing on the job you do best. Ella is great at folding laundry and her brother Ben is fast at washing dishes. If each takes their best job instead of doing half of both, the chores get done sooner." },
          { heading: "A story with numbers", body: "Ella can make 6 bracelets in an hour, but only 2 cookies. Ben can bake 6 cookies in an hour, but only makes 2 bracelets. If each spends one hour on their best thing, they have 6 bracelets and 6 cookies. If each splits the hour, they get only 4 of each. Then they trade some, and both have more." },
          { heading: "Teams do this too", body: "When you and your siblings work on a team goal, each person can do the part they are best at. Together you reach the prize faster than anyone could alone." },
        ],
        quiz: [
          {
            prompt: "What does specializing mean?",
            choices: ["Doing every job yourself", "Never trading", "Focusing on the job you do best"],
            answer: 2,
            why: "Specializing means spending your time where you are strongest.",
          },
          {
            prompt: "Ella and Ben each spend one hour on their best thing. How many cookies do they make in total?",
            choices: ["6", "4", "12"],
            answer: 0,
            why: "Ben bakes 6 cookies in his hour, and Ella spends hers on bracelets.",
          },
          {
            prompt: "Why do both people agree to a fair trade?",
            choices: ["One person always loses", "Each one thinks they are getting something better", "Trading is a rule"],
            answer: 1,
            why: "People trade when what they get is worth more to them than what they give.",
          },
        ],
        tryIt: { label: "See today's quests", to: 'quests' },
      },
      teen: {
        title: "Trade and Advantage",
        blurb: "Why trade helps even when one side is better.",
        pages: [
          { heading: "Voluntary trade", body: "In a voluntary trade, each side values what they get more than what they give up. That is how a trade can create value for both sides at once, instead of one side winning only because the other loses.", art: 'trade' },
          { heading: "A surprising case", body: "In an afternoon, Ana can make 12 cookies or 6 bracelets. Ben can make 4 cookies or 4 bracelets. Ana is better at both. That is called an absolute advantage. You might think she has no reason to trade with Ben." },
          { heading: "Comparative advantage", body: "Look at what each bracelet costs in cookies given up. For Ana, 6 bracelets cost 12 cookies, so 1 bracelet costs 2 cookies. For Ben, 1 bracelet costs just 1 cookie. Ben has the lower opportunity cost for bracelets, so he has the comparative advantage in bracelets, and Ana has it in cookies." },
          { heading: "Splitting the gains", body: "Say they trade 3 cookies for 2 bracelets, which is 1.5 cookies per bracelet. Ana pays 1.5 cookies for a bracelet that would cost her 2 to make. Ben gets 1.5 cookies for a bracelet that costs him only 1. Both come out ahead. Countries trade for the same reason." },
        ],
        quiz: [
          {
            prompt: "In an hour, Kai can make 10 muffins or 5 scarves. What does 1 scarf cost Kai in muffins?",
            choices: ["5 muffins", "1 muffin", "10 muffins", "2 muffins"],
            answer: 3,
            why: "10 muffins for 5 scarves means each scarf costs 10 / 5 = 2 muffins.",
          },
          {
            prompt: "What decides comparative advantage?",
            choices: ["Who has the lower opportunity cost", "Who is faster at everything", "Who has more money"],
            answer: 0,
            why: "Comparative advantage goes to whoever gives up less to make the thing.",
          },
          {
            prompt: "A bracelet costs Ana 2 cookies to make and Ben 1 cookie. Which price lets both gain from trade?",
            choices: ["3 cookies per bracelet", "1.5 cookies per bracelet", "0.5 cookies per bracelet"],
            answer: 1,
            why: "Any price between 1 and 2 cookies is cheaper for Ana and better for Ben than making it themselves.",
          },
        ],
        tryIt: { label: "See today's quests", to: 'quests' },
      },
    },
  },

  // ---------------------------------------------------------------- competition
  {
    id: 'competition',
    art: 'business',
    category: 'economy',
    versions: {
      middle: {
        title: "The Stand Next Door",
        blurb: "Why competing shops help shoppers.",
        pages: [
          { heading: "Only one stand", body: "Mia sells lemonade for $1 a cup, and hers is the only stand on the street. If you want lemonade, she is your only choice, so she has no reason to change anything.", art: 'business' },
          { heading: "A new stand opens", body: "Then Jay opens a stand across the street and sells cups for 75 cents. Lots of customers walk over to Jay. That is competition: businesses trying to win the same customers." },
          { heading: "Getting better", body: "Mia doesn't want to lose her customers. She lowers her price to 80 cents and adds ice and a lemon slice. Jay starts offering cookies. Each one keeps trying to be the better choice." },
          { heading: "Who wins?", body: "The shoppers! Competition pushes prices down and quality up, because businesses have to earn your choice. That is why it often pays to compare before you buy." },
        ],
        quiz: [
          {
            prompt: "What usually happens to prices when a new shop competes for the same customers?",
            choices: ["They go up", "They tend to go down", "They stay frozen forever"],
            answer: 1,
            why: "Shops lower prices to keep customers from switching.",
          },
          {
            prompt: "Mia drops her price from $1 to 80 cents. How much does a customer save per cup?",
            choices: ["20 cents", "80 cents", "25 cents"],
            answer: 0,
            why: "$1 is 100 cents, and 100 minus 80 is 20 cents.",
          },
          {
            prompt: "Besides lowering prices, how else can a shop compete?",
            choices: ["By being rude", "By hiding its prices", "By making its product better"],
            answer: 2,
            why: "Better quality, like ice and a lemon slice, gives shoppers a reason to choose you.",
          },
        ],
      },
      teen: {
        title: "Competition and Markets",
        blurb: "How rivals push prices down and quality up.",
        pages: [
          { heading: "What competition does", body: "Competition happens when several sellers try to win the same customers. To win, they cut prices, improve quality, offer better service or invent something new. Buyers benefit because they can switch to whoever offers the best deal.", art: 'business' },
          { heading: "Worked example", body: "A shop sells a phone case that costs $3 to make for $8, earning $5 a case. A rival starts selling a similar case for $6. To keep customers, the first shop drops to $6, now earning $3 a case. Buyers save $2, and the shop's profit per case shrinks. With more rivals, prices tend to get pushed closer to what it costs to make the product." },
          { heading: "When competition is missing", body: "A market with just one seller is called a monopoly. With nowhere else to go, buyers may face higher prices and fewer improvements. Many countries have competition laws, sometimes called antitrust laws, and secretly agreeing with rivals to fix prices is illegal in many places." },
          { heading: "Innovation", body: "Competition isn't only about price. Companies race to make faster phones, tastier snacks and easier apps. The pressure to stay ahead is a big reason products keep improving over time." },
        ],
        quiz: [
          {
            prompt: "A case costs $3 to make and sells for $6. What is the profit per case?",
            choices: ["$9", "$6", "$2", "$3"],
            answer: 3,
            why: "$6 minus the $3 cost is $3 profit per case.",
          },
          {
            prompt: "What is a monopoly?",
            choices: ["A market with only one seller", "A market with many sellers", "A type of sale", "A government tax"],
            answer: 0,
            why: "A monopoly is when buyers have only one seller to choose from.",
          },
          {
            prompt: "With more rivals selling the same thing, where do prices tend to head?",
            choices: ["Far above the cost to make it", "Closer to the cost to make it", "To zero right away"],
            answer: 1,
            why: "Each rival undercuts the others until there is little extra profit left to cut.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- exchange-rates
  {
    id: 'exchange-rates',
    art: 'trade',
    category: 'economy',
    versions: {
      teen: {
        title: "Exchange Rates",
        blurb: "Different countries, different money.",
        pages: [
          { heading: "Many kinds of money", body: "Most countries have their own currency: dollars, euros, yen, pesos and many more. To buy something in another country, or from a company there, you usually need to swap your money for theirs. The price of one currency in another is the exchange rate.", art: 'trade' },
          { heading: "Worked conversion", body: "Say 1 US dollar trades for 0.90 euros. This rate is just for the example, since real rates change every day. To convert dollars to euros, multiply: $50 x 0.90 = 45 euros. To convert euros back to dollars, divide: a souvenir that costs 18 euros is 18 / 0.90 = $20." },
          { heading: "Stronger and weaker", body: "Rates move with supply and demand for each currency. If the rate rises to 1 dollar = 1.00 euro, your $50 now gets 50 euros. The dollar got stronger, so trips abroad and imported goods feel cheaper. If it falls to 0.80, $50 gets only 40 euros." },
          { heading: "Watch the fees", body: "Exchange booths and cards often give a worse rate than the one you see online, or add a fee. If a booth offers 0.85 instead of 0.90, your $50 becomes 42.50 euros instead of 45, so you quietly lose 2.50 euros. Comparing rates before you swap money is worth it." },
        ],
        quiz: [
          {
            prompt: "1 dollar = 0.90 euros. How many euros do you get for $200?",
            choices: ["222 euros", "200 euros", "180 euros", "190 euros"],
            answer: 2,
            why: "$200 x 0.90 = 180 euros.",
          },
          {
            prompt: "1 dollar = 0.90 euros. A hat costs 27 euros. How much is that in dollars?",
            choices: ["$30", "$24.30", "$27"],
            answer: 0,
            why: "To go from euros to dollars, divide: 27 / 0.90 = $30.",
          },
          {
            prompt: "The rate goes from 1 dollar = 0.90 euros to 1 dollar = 1.00 euro. What happened?",
            choices: ["The dollar got weaker", "The dollar got stronger", "Nothing changed"],
            answer: 1,
            why: "Each dollar now buys more euros, so the dollar got stronger.",
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- net-worth
  {
    id: 'net-worth',
    art: 'net-worth',
    category: 'planning',
    versions: {
      teen: {
        title: "Your Net Worth",
        blurb: "What you own minus what you owe.",
        pages: [
          { heading: "Two lists", body: "Net worth is a snapshot of where you stand with money. List what you own that has value, called assets: cash, savings, investments and things you could sell. Then list what you owe, called liabilities or debts. Net worth = assets minus liabilities.", art: 'net-worth' },
          { heading: "Worked example", body: "Jordan has $300 in savings, a bike he could sell for $150 and a game console worth about $200. His assets total $650. He owes his sister $40 and owes his parents $110 for a phone. His debts total $150. His net worth is $650 - $150 = $500." },
          { heading: "Income is not net worth", body: "Income is money coming in. Net worth is what you have kept. Someone with a big paycheck who spends it all and borrows more can have a lower net worth than someone with a small paycheck who saves steadily." },
          { heading: "What moves it", body: "Saving and investing raise net worth. New debt and stuff that loses value lower it: that $200 console will likely be worth less next year. Paying off a debt doesn't change net worth on the day you do it, since your cash and your debt both drop by the same amount, but it stops interest from piling up later." },
        ],
        quiz: [
          {
            prompt: "Assets are $900 and debts are $250. What is the net worth?",
            choices: ["$1,150", "$650", "$900", "$250"],
            answer: 1,
            why: "$900 minus $250 is $650.",
          },
          {
            prompt: "Which of these is a liability?",
            choices: ["Money you owe a friend", "Money in your piggy bank", "A bike you own"],
            answer: 0,
            why: "A liability is a debt, something you owe to someone else.",
          },
          {
            prompt: "You use $100 of savings to pay off a $100 debt. What happens to your net worth that day?",
            choices: ["It goes down $100", "It goes up $100", "It stays the same"],
            answer: 2,
            why: "Your assets and your debts each drop $100, so the difference stays the same.",
          },
          {
            prompt: "Who probably has the higher net worth?",
            choices: ["Someone who earns a lot but spends it all and borrows more", "Someone who earns less but saves steadily", "You can only tell from their income"],
            answer: 1,
            why: "Net worth is what you keep, not what you earn.",
          },
        ],
        tryIt: { label: "Add up your coins", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- retirement
  {
    id: 'retirement',
    art: 'time-growth',
    category: 'planning',
    versions: {
      teen: {
        title: "Saving for Way Later",
        blurb: "Retirement, far-off goals and free money.",
        pages: [
          { heading: "The far-off goal", body: "Retirement is when people stop working full time, often decades from now. They still need money for food, a home and fun, so they live on what they saved and invested during their working years. It is the longest goal most people ever save for.", art: 'time-growth' },
          { heading: "Worked example", body: "Maya invests $2,000 a year from age 25 to 35, then stops: $20,000 in total. Theo invests $2,000 a year from 35 to 65: $60,000 in total. With a made-up 7% a year, at 65 Maya has about $225,000 and Theo about $202,000. Maya put in a third as much and still came out ahead, because her money had more years to grow." },
          { heading: "Employer matching", body: "Many employers offer retirement plans, and some match part of what you put in. Plans vary, but here is one example: an employer matches 50% of what you save, up to 6% of your pay. Earn $40,000 and save 6%, which is $2,400, and the employer adds $1,200. That is extra money you only get if you save." },
          { heading: "Special accounts", body: "Retirement accounts often come with tax breaks to encourage saving, and the rules differ by country. In the US, common names are 401(k) and IRA. You don't need to know the details yet. The big idea is that small amounts started early can matter more than big amounts started late." },
        ],
        quiz: [
          {
            prompt: "Your employer matches 50% of what you save, up to 6% of pay. You earn $30,000 and save 6%. How much does the employer add?",
            choices: ["$1,800", "$3,000", "$600", "$900"],
            answer: 3,
            why: "6% of $30,000 is $1,800, and 50% of $1,800 is $900.",
          },
          {
            prompt: "Why did Maya end up with more than Theo even though she put in less?",
            choices: ["Her money had more years to grow", "She picked a lucky stock", "Theo paid higher taxes"],
            answer: 0,
            why: "Starting ten years earlier gave her money decades of extra compounding.",
          },
          {
            prompt: "What is retirement savings mostly for?",
            choices: ["Next week's snacks", "Living costs after you stop working full time", "Paying for a phone upgrade"],
            answer: 1,
            why: "Retirement savings cover your needs and wants once your paycheck stops.",
          },
        ],
        tryIt: { label: "Grow your savings", to: 'grow' },
      },
    },
  },

  // ---------------------------------------------------------------- enough
  {
    id: 'enough',
    art: 'contentment',
    category: 'planning',
    versions: {
      little: {
        title: "Happy With Enough",
        blurb: "Feeling good about what you have.",
        pages: [
          { heading: "A friend's new toy", body: "Your friend gets a shiny new toy. You might feel a little jealous. That feeling is normal.", art: 'contentment' },
          { heading: "Look at your treasures", body: "Think of the things you already love, like a cozy blanket or a favorite game. Saying thank you for them feels warm inside." },
          { heading: "More stuff, same smile", body: "A new toy is fun for a while. Friends, family and play make us happy for a long time." },
        ],
        quiz: [
          {
            prompt: "Your friend has a new toy and you feel jealous. Is that okay?",
            choices: ["Yes, feelings are normal", "No, never feel that"],
            answer: 0,
            why: "Everyone feels jealous sometimes, and it helps to notice the feeling.",
          },
          {
            prompt: "What makes us happy for a long, long time?",
            choices: ["Lots of new toys", "Friends, family and play", "A bigger pile than a friend"],
            answer: 1,
            why: "People and fun times together keep making us happy long after a new toy feels old.",
          },
        ],
        tryIt: { label: "Pick a dream goal", to: 'goal' },
      },
      middle: {
        title: "Enough Is a Lot",
        blurb: "Comparing, feelings and being happy with enough.",
        pages: [
          { heading: "The comparing trap", body: "It is easy to look at what other people have and feel like you have less. Someone always has a newer phone, bigger house or higher level. If you keep comparing, you can feel behind even when you have plenty.", art: 'contentment' },
          { heading: "A story with numbers", body: "Zoe sees that everyone at school has $60 sneakers. She has $25 saved for a $30 art kit she has wanted for months. Saving $5 a week, she could wait 7 more weeks for the sneakers, or buy the art kit soon. She asks herself: which one would I want if nobody else could see it?" },
          { heading: "Money and feelings", body: "Buying something can feel great for a day. Then it becomes normal, and the happy feeling fades. Spending on things you truly care about, like a hobby or time with friends, tends to feel good for longer." },
          { heading: "Your own scoreboard", body: "Your XP and levels are about your own progress, not beating your siblings. Racing yourself is more fun than racing everyone else." },
        ],
        quiz: [
          {
            prompt: "Zoe has $25 and the art kit costs $30. How much more does she need?",
            choices: ["$55", "$35", "$5"],
            answer: 2,
            why: "$30 minus $25 is $5.",
          },
          {
            prompt: "What usually happens to the happy feeling after buying something new?",
            choices: ["It fades as the thing becomes normal", "It lasts forever", "It doubles every week"],
            answer: 0,
            why: "New things quickly start to feel ordinary, so the excitement wears off.",
          },
          {
            prompt: "What is a good question to ask before buying something everyone else has?",
            choices: ["Will people be impressed?", "Would I still want this if nobody could see it?", "Is it the most expensive one?"],
            answer: 1,
            why: "That question helps you tell your own wants from the pressure to keep up.",
          },
        ],
        tryIt: { label: "Pick a dream goal", to: 'goal' },
      },
      teen: {
        title: "Knowing What Is Enough",
        blurb: "Comparison, lifestyle creep and your own goals.",
        pages: [
          { heading: "The highlight reel", body: "Social media shows other people's best moments: the trip, the new shoes, the concert. You compare your everyday life to their highlights, which is never a fair match. Plenty of what you see is borrowed, sponsored or paid for by skipping something you don't see.", art: 'contentment' },
          { heading: "The happiness treadmill", body: "People adjust to new things quickly. Psychologists call it hedonic adaptation. The new phone thrills you for a week, then it is just your phone. If you chase that thrill with more stuff, you keep running without getting anywhere." },
          { heading: "Lifestyle creep", body: "Say you earn $20 a week, spend $15 and save $5. You get a raise to $30. If your spending creeps up to $28, you save only $2, less than before, even though you earn more. If you save half of the raise instead, you spend $20 and save $10, and you still get to enjoy an extra $5 a week." },
          { heading: "Define your enough", body: "Enough is not a number someone else sets. It is having your needs covered, some savings, room for what you truly value, and not stressing about keeping up. Knowing your enough makes it easier to say no to the rest and yes to the things that matter." },
        ],
        quiz: [
          {
            prompt: "You earn $30 a week and spend $28. How much do you save?",
            choices: ["$8", "$5", "$10", "$2"],
            answer: 3,
            why: "$30 minus $28 leaves just $2 to save.",
          },
          {
            prompt: "What is lifestyle creep?",
            choices: ["Spending rising as income rises", "Saving every raise", "Moving to a new town"],
            answer: 0,
            why: "Lifestyle creep is when spending grows to swallow every raise.",
          },
          {
            prompt: "Why is comparing yourself to social media posts unfair?",
            choices: ["Posts are always fake", "You see their highlights but your whole everyday life", "Nobody posts real things"],
            answer: 1,
            why: "Posts show the best moments, while you know all of your ordinary ones.",
          },
          {
            prompt: "What does hedonic adaptation mean?",
            choices: ["Adapting to cold weather", "Saving for retirement", "Getting used to new things so the thrill fades", "Changing your budget every week"],
            answer: 2,
            why: "People quickly get used to new things, so the extra happiness wears off.",
          },
        ],
        tryIt: { label: "Set a dream goal", to: 'goal' },
      },
    },
  },
];
