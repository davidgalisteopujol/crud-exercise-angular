const { writeFileSync, mkdirSync} = require('fs')

require('dotenv').config()

const targetPath = './src/environments/environment.ts'

const envFileContent = `
    export const environment = {
       api_key: "${ process.env['API_KEY'] }",
       baseUrl: "http://localhost:3000/users"
    };
`;

mkdirSync('./src/environments', { recursive:true });

writeFileSync( targetPath, envFileContent );