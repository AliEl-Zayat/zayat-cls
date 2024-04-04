const fs = require("fs");
const addExportStatement = require("./AddExportsStatement");

const createPageTemplate = (project, screenName, callBack) => {
	const path = project.screensPath;
	const isTS = project.isTS;

	const indexFileExtension = isTS ? "ts" : "js";
	const fileExtension = isTS ? "tsx" : "jsx";

	const template = `import React from 'react'

  const ${screenName} = () => {
    return (
      <div>${screenName}</div>
    )
  }
  
  export default ${screenName}`;

	const indexTemplate = `export { default } from "./${screenName}";`;
	const newExportStatement = `export { default as ${screenName} } from "./${screenName}";`;

	const directoryPath = `${path}/${screenName}`;
	const screenPath = `${directoryPath}/${screenName}.${fileExtension}`;
	const indexPath = `${directoryPath}/index.${indexFileExtension}`;

	if (fs.existsSync(directoryPath)) {
		callBack();
	} else {
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath);
		}
		fs.writeFileSync(screenPath, template);
		fs.writeFileSync(indexPath, indexTemplate);
		addExportStatement(
			`${path}/index.${indexFileExtension}`,
			newExportStatement,
			callBack
		);
	}
};

module.exports = createPageTemplate;
