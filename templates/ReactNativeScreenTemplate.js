const fs = require("fs");
const addExportStatement = require("./AddExportsStatement");

const createScreenTemplate = (project, screenName, callBack) => {
  const path = project.screensPath;
  const isTS = project.isTS;
  const indexPatterned = project.indexPatterned;

  const indexFileExtension = isTS ? "ts" : "js";
  const fileExtension = isTS ? "tsx" : "jsx";

  const template = `import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ${screenName} = () => {
    return (
        <SafeAreaView style={styles.screen}>
            <Text>${screenName}</Text>
        </SafeAreaView>
    );
};

export default ${screenName};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
});`;

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
    if (indexPatterned) {
      fs.writeFileSync(indexPath, indexTemplate);
    }
    addExportStatement(
      `${path}/index.${indexFileExtension}`,
      newExportStatement,
      callBack
    );
  }
};

module.exports = createScreenTemplate;
