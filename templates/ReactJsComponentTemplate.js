const fs = require("fs");
const addExportStatement = require("./AddExportsStatement");

const createWebComponentTemplate = (project, componentName, callBack) => {
  const path = project.componentsPath;
  const isTS = project.isTS;
  const indexPatterned = project.indexPatterned;

  const indexFileExtension = isTS ? "ts" : "js";
  const fileExtension = isTS ? "tsx" : "jsx";

  const template = `import React from 'react';
import styles from './styles.module.scss';
const {} = styles;

  const ${componentName} = () => {
    return (
      <div>${componentName}</div>
    )
  }
  
  export default ${componentName}`;

  const indexTemplate = `export { default } from "./${componentName}";`;
  const newExportStatement = `export { default as ${componentName} } from "./${componentName}";`;

  const directoryPath = `${path}/${componentName}`;
  const componentPath = `${directoryPath}/${componentName}.${fileExtension}`;
  const stylesPath = `${directoryPath}/styles.module.scss`;
  const indexPath = `${directoryPath}/index.${indexFileExtension}`;

  if (fs.existsSync(directoryPath)) {
    callBack();
  } else {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
    fs.writeFileSync(componentPath, template);
    fs.writeFileSync(stylesPath, "");
    fs.writeFileSync(indexPath, indexTemplate);
    if (indexPatterned) {
      addExportStatement(
        `${path}/index.${indexFileExtension}`,
        newExportStatement,
        callBack
      );
    }
  }
};

module.exports = createWebComponentTemplate;
