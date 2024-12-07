const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


class VersionRestController {
    static getVersion = async (req, res) => {
        try {
            const versionInfo = VersionRestController.readVersionInformation();
            res.send(versionInfo);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }

    static readVersionInformation() {
        const filePath = path.join(__dirname, 'git.properties');  // Adjust the path if needed

        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf-8');
                console.log('Version Information read from git.properties');
                return data;
            } catch (err) {
                console.error('Error reading git.properties:', err.message);
                return 'Version Information could not be retrieved';
            }
        } else {
            // Generate version info dynamically using git commands
            try {
                const commitHash = execSync('git rev-parse HEAD').toString().trim();
                const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
                const version = execSync('git describe --tags').toString().trim();
                let versionInfo ={};
                versionInfo['git.commit.id'] = commitHash;
                versionInfo['git.branch'] = branch;
                versionInfo['git.build.version'] = version;
                console.log('Version Information generated dynamically from git');
                return versionInfo;
            } catch (err) {
                console.error('Error generating version info from git:', err.message);
                return 'Version Information could not be retrieved';
            }
        }
    }
}
module.exports = VersionRestController;

