import preval from "babel-plugin-preval/macro";

module.exports = preval`
const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
const mdPath = path.join(__dirname , '..', '/blog/');
const fileContents = fs
                 .readdirSync(mdPath)
                 .slice(0,40)
                 .map(file => {
                   const contents = frontMatter(fs.readFileSync(mdPath + file, 'utf8'));
                   
                   return contents;
 });

module.exports = fileContents;
`