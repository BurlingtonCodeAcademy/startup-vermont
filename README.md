# startup-vermont

track and visualize startup activity in Vermont

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Setup

First, get a MongoDB: either
  * [download and install MongoDB locally](https://www.mongodb.com/download-center/community)
  * or use [Homebrew on MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
  * or get [your own personal cloud MongoDB](https://mlab.com/plans/pricing/#plan-type=sandbox) from mLab

Next, clone the project and install dependencies:

```
git clone git@github.com:BurlingtonCodeAcademy/startup-vermont.git
cd startup-vermont
npm install
```

Then create a personalized `.env` file in the project dir containing

```
MONGODB_URI=mongodb://localhost:27017/startup-vermont
CRUNCH_KEY=123456789
```

(but using a real, secret Crunchbase API key, of course)

## Troubleshooting

|Symptom|Solution|
|---|---|
|`Could not proxy request /test from localhost:3000 to http://localhost:5000` | run your server with `npm start` in a separate terminal window |

## Development

From the project directory, you can run:

|Command|Description|
|---|---|
| `npm start` | Runs the app in production mode.<br> Open <http://localhost:5000> to view it in the browser. This page will **not** automatically reload when edits are made. You may need to run `npm run build` after making a change. |
|`npm run dev` | Runs the app in development mode. <br> Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. <br> You will also see any lint errors in the console. <br> You must run the server too! Launch `npm start` in a separate terminal. |
| `npm test` (or `npm run test`) | Launches the Jest (client-side!) test runner in the interactive watch mode.<br> See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information. |
| `npm test-server` | Runs the Ava (server-side!) test suite |
| `npm test-acceptance` | Runs the Cypress (end-to-end!) test suite in headless mode |
| `npx cypress open` | Opens the Cypress (end-to-end!) test runner in a window |
| `npm run build` | Builds the app for production to the `build` folder.<br> It correctly bundles React in production mode and optimizes the build for the best performance. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information. |
|`npm run import` | import data from Crunchbase into your local Mongo database -- SEE BELOW |
|`npm run eject` | don't run this! [read here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject) for more info |


## Deployment

### Add heroku remote

* run `git remote add heroku https://git.heroku.com/serene-shelf-38593.git`
* to push changes run `git push heroku master`
* our mLab MongoDB URL is in the MONGOLAB_MAUVE_URI environment var (or perhaps MONGODB_URI)
* Use `heroku addons:docs mongolab` to view documentation

## Import from Crunchbase

Currently you can import from Curnchbase with the following caveats:

* the import script **drops the `companies` collection** at the start, so make sure you're okay with losing data
* you must run the script **from a dev workstation**
* set PRODUCTION_MONGO_URI in your `.env` file (from `MONGOLAB_MAUVE_URI`, see above)
* the script hangs when it's finished, so get ready to hit <kbd>Ctrl</kbd>-<kbd>C</kbd>
* run it from the command line, `node import prod`

## Miscellaneous

* Windows mongo path: "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"

## Links

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## `npm run seed`

imports the data from seed/companies.js


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
* Crunchbase API: https://data.crunchbase.com/docs/using-the-api
* [MongoDB Manual](https://docs.mongodb.com/manual)
* MongoDB NodeJS [Driver Docs](http://mongodb.github.io/node-mongodb-native/3.1/) and [Driver API Docs](http://mongodb.github.io/node-mongodb-native/3.1/api/)
