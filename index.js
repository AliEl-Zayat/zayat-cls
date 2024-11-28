const path = require("path");
const fs = require("fs");
const readlineSync = require("readline-sync");
const logger = require("./utils/logger");
const createScreenTemplate = require("./templates/ReactNativeScreenTemplate");

const createComponentTemplate = require("./templates/ReactNativeComponentTemplate");
const { listProjects } = require("./utils/helpers");
const createWebComponentTemplate = require("./templates/ReactJsComponentTemplate");
const createPageTemplate = require("./templates/ReactJsPageTemplate");
const createNextJsPageTemplate = require("./templates/NextJsPageTemplate");

const configFilePath = "config.js";

let config;
let selectedProject;

let Project;

function getConfig() {
  try {
    config = require("./config");
  } catch (error) {
    logger.error(error);
  }
  return config;
}

function saveConfig(config) {
  const configString = `module.exports = ${JSON.stringify(config, null, 2)};\n`;
  fs.writeFileSync(configFilePath, configString);
}

function landing(config) {
  listProjects(config);

  const projectNames = Object.keys(config);

  logger.warning("Select a project or create a new one:");
  const options = [...projectNames, "Create a new project"];
  const projectIndex = readlineSync.keyInSelect(options, "Choose a project");
  if (projectIndex === -1) {
    logger.error("Exiting ...");
    return;
  }

  if (projectIndex === projectNames.length) {
    selectedProject = readlineSync.question("Enter new project name: ");
    if (config[selectedProject]) {
      logger.error("Project already exists");
      return;
    }
    const isTS = readlineSync.keyInYNStrict("Using TypeScript? ");
    const isReactNative = readlineSync.keyInYNStrict("Using React native? ");
    const isNextJs = readlineSync.keyInYNStrict("Using Next.js? ");
    const screensPath = readlineSync.question(
      `Enter the path to the ${isReactNative ? "Screens" : "Pages"} folder: `
    );
    const componentsPath = readlineSync.question(
      "Enter the path to the components folder: "
    );
    const indexPatterned = readlineSync.keyInYNStrict("Index patterned? ");

    config[selectedProject] = {
      componentsPath: path.normalize(componentsPath),
      screensPath: path.normalize(screensPath),
      isTS,
      isReactNative,
      isNextJs,
      indexPatterned,
    };
    saveConfig(config);
    Project = {
      componentsPath: path.normalize(componentsPath),
      screensPath: path.normalize(screensPath),
      isTS,
      isReactNative,
      isNextJs,
      indexPatterned,
    };
  } else {
    selectedProject = projectNames[projectIndex];
    Project = config[projectNames[projectIndex]];
  }
  mainTerminal();
}

function scriptConfigure() {
  console.clear();

  const config = getConfig();
  landing(config);
}

function mainTerminal() {
  logger.sponsor("Press S for Screen");
  logger.sponsor("Press C for Component");
  logger.sponsor("Press E for Exit");

  const choice = readlineSync.keyIn("", {
    hideEchoBack: true,
    mask: "",
    limit: "sce",
  });

  if (choice === "s") {
    screenSelectedFN(Project);
  }
  if (choice === "c") {
    componentSelectedFN(Project);
  }
  if (choice === "e") {
    exitSelectedFN();
  }
}

const screenSelectedFN = (project) => {
  const screenName = readlineSync.question("Enter Screen Name:");
  if (screenName.length > 2) {
    if (project.isReactNative) {
      createScreenTemplate(project, screenName, () => mainTerminal(project));
    } else if (project.isNextJs) {
      createNextJsPageTemplate(project, screenName, () =>
        mainTerminal(project)
      );
    } else {
      createPageTemplate(project, screenName, () => mainTerminal(project));
    }
  }
};

const componentSelectedFN = (project) => {
  const componentName = readlineSync.question("Enter Component Name:");
  if (componentName.length > 2) {
    if (project.isReactNative) {
      createComponentTemplate(project, componentName, () =>
        mainTerminal(project)
      );
    } else {
      createWebComponentTemplate(project, componentName, () =>
        mainTerminal(project)
      );
    }
  }
};

const exitSelectedFN = () => {
  process.exit(0);
};

scriptConfigure();
