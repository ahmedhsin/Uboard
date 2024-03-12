import swaggerAutogen from 'swagger-autogen';
 
const doc = {
  info: {
    title: 'Uboard-Api',
    description: 'UBoard API'
  },
  host: 'localhost:8000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/features/user/user.route.ts', './src/features/board/board.route.ts',
'./src/features/topic/topic.route.ts', './src/features/task/task.route.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);