const fs = require("fs");

const addExportStatement = (fileName, newExportStatement, callBack) => {
	// Check if the file exists
	fs.access(fileName, fs.constants.F_OK, (err) => {
		if (err) {
			// If the file doesn't exist, create it with the new export statement
			fs.writeFile(fileName, newExportStatement, (err) => {
				if (err) {
					console.error("Error creating file:", err);
					return;
				}
				console.log("File created with export statement!");
				callBack();
			});
		} else {
			// If the file exists, read its content and append the new export statement
			fs.readFile(fileName, "utf8", (err, data) => {
				if (err) {
					console.error("Error reading file:", err);
					return;
				}

				const updatedContent = data + "\n" + newExportStatement;

				// Write the updated content back to the file
				fs.writeFile(fileName, updatedContent, (err) => {
					if (err) {
						console.error("Error writing to file:", err);
						return;
					}
					console.log("Export statement added successfully!");
					callBack();
				});
			});
		}
	});
};

module.exports = addExportStatement;
