# Tug of Type

Lower Moreland High School Coding Club's typeracing game has two modes: race mode and tug-of-war mode.

## Tech Stack

- [Convex](https://convex.dev) - Convex is a new state management platform that handles the backend and database, easily integrating with React apps and sending live updates without extra cofniguration through TCP Sockets. With Convex, we don't need Springboot (a Java framework for back-end development) or Express (a JavaScript framework for back-end development). All of the Convex functions, found in the `convex/` folder of this repository, tell the database to do certain actions or reads data from the database and sends it back to your browser - the frontend - so that it can be used as a React hook
- [NextJS](https://nextjs.org) - NextJS is a JavaScript framework built on React that makes the website performant and very easy to build
- [Bootstrap](https://getbootstrap.com/) - Bootstrap is a CSS framework with ready-made styles for links, buttons, tables, etc. so that the website has a modern look and feel
- [Reactstrap](https://reactstrap.github.io) - Reactstrap integrates Bootstrap with React so that we can use these components in a way that is optimized for React
- [ReactJS](https://react.dev/) - ReactJS is a JavaScript library that lets you make "components" on the website that can be reused so that you can develop faster
- JavaScript - JavaScript a programming language used by browsers to make webpages interactive
- [Node.js](https://nodejs.org) - Node is a JavaScript runtime, which means you can write back-end JavaScript by downloading and installing it. _Node and browser JavaScript have [common functions and syntax](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcEVJHHT19ZJKo2M_emQyZ2p8b5U09ysqYtQ&usqp=CAU), but they are [different](https://www.javaassignmenthelp.com/blog/wp-content/uploads/2022/01/difference-Javascript-and-nodejs-576x1024.webp)_
- CSS - Cascading Stylesheets is a language for styling the website (colors, fonts, layout, spacing, and animations)
- HTML - Though not used directly, React converts the JavaScript into HTML so that the size of the files is the minimum possible, making the page load very quickly and giving it a modern feel
- [Vercel](https://vercel.com/lmhscodingclub) - Vercel is a hosting platfrom that deploys the front-end (the website that you go to - https://tug-of-war-typeracer.vercel.app) for us, and the Vercel team created NextJS. We use Vercel to deploy all of the Coding Club [web projects](https://vercel.com/lmhscodingclub)
- [Auth0](https://www.auth0.com) - Auth0 allowed us to easily let Google handle account sign in so we do not need to do any kind of authentication ourself. Convex recommends Auth0

## Installation and Set Up

These are instructions for you to set up the project locally, so you can see the latest changes and develop the project.

1. In the command line (Command Prompt for Windows), run `git clone https://github.com/LMHSCodingClub/tug-of-type` If you get an error that is not a command, install [Git](https://git-scm.com/)

1. You will need to download: [Node.js](https://nodejs.org) (LTS)

   **Pay attention when going through the installer. Choose all the recommended options. You also install NPM, the Node Package Manager, which you need for installing the libraries listed in the next step**

   - Verify you have installed Node and NPM by opening the "Command Prompt" (on Windows) and running `node -v` and `npm -v`. These commands will give you the version number that you have installed for Node and NPM, respectively.
   - For installation on Mac, see https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac

1. Run `npm install`. This will create a node_modules folder which contains all the code, in the most concise form possible to save memory, of all the JavaScript packages we are using. This should install:

   - Convex
   - NextJS
   - React: react-dom and react
   - Reactstrap
   - Bootstrap (there's a JavaScript package so that it works with React)
   - TypeScript (which we did not use much in this project for simplicity)
   - Auth0

The computer knows to install all of these packages because the [package.json](/package.json) file lists all of the `dependencies` (code that our code _depends_ on) by their identification on the Node Package Manager system. You can find each of these packages by going to `https://npmjs.org` and searching for them by that exact name.

3. Make a new file called `.env.local` in this root directory (not in a folder) and add the following:

```
   NEXT_PUBLIC_CONVEX_URL="https://vacuous-reindeer-969.convex.cloud"
   NEXT_PUBLIC_AUTH0_DOMAIN="dev-un5arvwuk2iaposi.us.auth0.com"
   NEXT_PUBLIC_AUTH0_CLIENT_ID="bC5JCuZRRlb6ZxLKSWZd0kOiXNunuJAn"
```

## Local Development

Once you have followed all of the steps under [Installation](#installation), run the following commands in separate command line terminals:
`npm run dev` - this starts the front-end Node web server
`npx convex dev` - this runs the back-end Convex web server

Open http://localhost:3000 in your browser once the `npm run dev` terminal says:

```
- event compiled client and server successfully in ____ ms (__ modules)
```

If you run into an error in the command line, try running `npm update` in the command line, and try deleting the node_modules folder and running `npm install` again. If it still does not work, Google the error.

If there are no errors in the command line but the browser says it 'cannot connect to the server', try refreshing.
