# Tug of Type

Lower Moreland High School Coding Club's typeracing game has two modes: race mode and tug-of-war mode.

## Tech Stack

- [Convex](https://convex.dev) - Convex is a new state management platform that takes care of the backend development and database, easily integrating with React apps and sending live updates without extra cofniguration through TCP Sockets. This eliminated the need to use Springboot (a Java framework for back-end development) or Express ( a JavaScript framework for back-end development). All of the Convex functions, found in the `convex/` folder of this repository, tell the database to do certain actions or reads data from the database and sends it back to your browser - the frontend - so that it can be used as a React hook
- [NextJS](https://nextjs.org) - NextJS is a JavaScript framework built on React that makes the website performant and very easy to build
- [Bootstrap](https://getbootstrap.com/) - Bootstrap is a CSS framework with ready-made styles for links, buttons, tables, etc. so that the website has a modern look and feel
- [Reactstrap](https://reactstrap.github.io) - Reactstrap integrates Bootstrap with React so that we can use these components in a way that is optimized for React
- [ReactJS](https://react.dev/) - ReactJS is a JavaScript library that lets you make "components" on the website that can be reused so that you can develop faster
- JavaScript - JavaScript a programming language used by websites
- CSS - Cascading Stylesheets is a language for styling the website (colors, fonts, layout, spacing, and animations)
- HTML - Though not used directly, React converts the JavaScript into HTML so that the size of the files is the minimum possible, making the page load very quickly and giving it a modern feel
- [Vercel](https://vercel.com/lmhscodingclub) - Vercel is a hosting platfrom that deploys the front-end (the website that you go to - https://tug-of-war-typeracer.vercel.app) for us, and the Vercel team is the one who created NextJS. We use Vercel to deploy all of the Coding Club [website projects](https://vercel.com/lmhscodingclub)
