const fs = require("fs");
const addExportStatement = require("./AddExportsStatement");

const createComponentTemplate = (project, componentName, callBack) => {
  const path = project.componentsPath;
  const isTS = project.isTS;
  const indexPatterned = project.indexPatterned;

  const indexFileExtension = isTS ? "ts" : "js";
  const fileExtension = isTS ? "tsx" : "jsx";

  const template = `import { View, Text, StyleSheet } from "react-native";

const ${componentName} = () => {
    return (
        <View style={styles.container}>
            <Text>${componentName}</Text>
        </View>
    );
};

export default ${componentName};

const styles = StyleSheet.create({
    container: {
        width: 30,
        height: 30,
        backgroundColor: "red",
    },
});`;

  const indexTemplate = `export { default } from "./${componentName}";`;
  const newExportStatement = `export { default as ${componentName} } from "./${componentName}";`;

  const directoryPath = `${path}/${componentName}`;
  const componentPath = `${directoryPath}/${componentName}.${fileExtension}`;
  const indexPath = `${directoryPath}/index.${indexFileExtension}`;

  if (fs.existsSync(directoryPath)) {
    callBack();
  } else {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
    fs.writeFileSync(componentPath, template);
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

module.exports = createComponentTemplate;
