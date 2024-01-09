const fs = require('fs');
const path = require('path');

const sourcePath = 'src/proxy-server.mjs';
const destinationPath = 'dist/ssr-i18n-angular17/proxy-server.mjs';

// Check if the source file exists
if (fs.existsSync(sourcePath)) {
    // Get the absolute paths of the source and destination files
    const sourceAbsolutePath = path.resolve(sourcePath);
    const destinationAbsolutePath = path.resolve(destinationPath);

    // Copy the source file to the destination
    fs.copyFile(sourceAbsolutePath, destinationAbsolutePath, (err) => {
        if (err) {
            console.error('Error copying the file:', err);
        } else {
            console.log('File copied successfully.');
        }
    });
} else {
    console.error('The source file does not exist.');
}
