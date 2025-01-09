const fs = require("fs");

const createNextJsPageTemplate = (project, screenName, callBack) => {
  const path = project.screensPath;
  const isTS = project.isTS;

  const fileExtension = isTS ? "tsx" : "jsx";

  const typeDeclaration = isTS
    ? `type TPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}`
    : "";
  const typedProps = isTS ? `{params, searchParams}: TPageProps` : "";

  const template = `import React from 'react'
import styles from './styles.module.scss';
const {} = styles;

${typeDeclaration}

const Page = (${typedProps}) => {
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
