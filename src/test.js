const { Octokit } = require("@octokit/rest");

async function main() {
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: 'YOUR-TOKEN'
    })
    
    await octokit.request('GET /repos/{owner}/{repo}/events', {
        owner: 'MediaMarktSaturn',
        repo: 'scriptLib'
    })
}

main();