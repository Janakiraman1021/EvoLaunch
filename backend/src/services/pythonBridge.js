/**
 * @module bridge
 * @dev Stabilized Node.js/Python bridge with robust spawning and JSON communication.
 */

const { spawn } = require('child_process');
const path = require('path');

const callPythonAgent = (scriptName, args) => {
    return new Promise((resolve, reject) => {
        const pythonPath = process.env.PYTHON_PATH || 'python';
        const scriptPath = path.join(__dirname, '../agents/python', scriptName);

        console.log(`[Bridge] Calling ${scriptName} with args:`, args);

        const pyProcess = spawn(pythonPath, [scriptPath, ...args]);

        let output = '';
        let errorOutput = '';

        pyProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pyProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pyProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`[Bridge] ${scriptName} failed (code ${code}):`, errorOutput);
                return resolve({ error: errorOutput || `Process exited with code ${code}` });
            }

            try {
                const parsed = JSON.parse(output.trim());
                resolve(parsed);
            } catch (err) {
                console.error(`[Bridge] Failed to parse output from ${scriptName}:`, err.message);
                console.error(`[Bridge] Raw output:`, output);
                resolve({ error: 'Invalid JSON output' });
            }
        });

        pyProcess.on('error', (err) => {
            console.error(`[Bridge] Failed to start ${scriptName}:`, err.message);
            resolve({ error: err.message });
        });
    });
};

module.exports = { callPythonAgent };
