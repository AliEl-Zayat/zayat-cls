const fs = require("fs");

const createNextJsPageTemplate = (project, screenName, callBack) => {
  const path = project.screensPath;
  const isTS = project.isTS;

  const fileExtension = isTS ? "tsx" : "jsx";

  const template = `import React from 'react'
import styles from './styles.module.scss';
const {} = styles;

  const Page = () => {
    return (
      <div>${screenName}</div>
    )
  }
  
  export default Page`;

  const directoryPath = `${path}/${screenName}`;
  const screenPath = `${directoryPath}/page.${fileExtension}`;
  const stylesPath = `${directoryPath}/styles.module.scss`;

  if (fs.existsSync(directoryPath)) {
    callBack();
  } else {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
    fs.writeFileSync(screenPath, template);
    fs.writeFileSync(stylesPath, "");
    callBack();
  }
};

module.exports = createNextJsPageTemplate;
