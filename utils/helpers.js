const fs = require("fs");
const logger = require("./logger");

const configFilePath = "../config.js";

exports.listProjects = function (projects) {
	const projectNames = Object.keys(projects);
	logger.info("Available projects:");
	projectNames.forEach((projectName, index) => {
		logger.sponsor(index + 1 + ". " + projectName);
	});
};

exports.saveConfig = function (config) {
	const configString = `module.exports = ${JSON.stringify(config, null, 2)};\n`;
	fs.writeFileSync(configFilePath, configString);
};
