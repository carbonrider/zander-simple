# zander-simple
Simple example for integrating zander

## Installation steps
This project uses typescript for coding. Also gulp has been used for building the project. Once the project has been cloned
to local directory, perform following steps

1. Go to root directory (where package.json resides) and execute `npm install`. This step will install all the required dependencies.
2. Execute `typings install` to download the typescript modules.
3. Execute `gulp` command to transpile typescript into javascript.
4. If there are no errors, execute the program using `node build/index.js`. You should see the output as `You are using file storage
 to save [base64 encoded image data.]`