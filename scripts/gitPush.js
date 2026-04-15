const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function runCommand(cmd, silent = false) {
  try {
    const output = execSync(cmd, { encoding: 'utf-8' });
    if (!silent) console.log(output);
    return output;
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    throw err;
  }
}

async function main() {
  try {
    const branchName = await askQuestion('Enter branch name: ');

    if (!branchName.trim()) {
      console.error('❌ Branch name cannot be empty');
      rl.close();
      return;
    }

    console.log(`\n📋 Working on branch: ${branchName}\n`);

    // Check if branch exists locally
    const branches = runCommand('git branch', true);
    const branchExists = branches.includes(branchName);

    if (!branchExists) {
      console.log(`✨ Creating new branch: ${branchName}`);
      runCommand(`git checkout -b ${branchName}`);
    } else {
      console.log(`✅ Switching to branch: ${branchName}`);
      runCommand(`git checkout ${branchName}`);
    }

    // Add all changes
    console.log('📦 Adding all changes...');
    runCommand('git add .');

    // Commit changes
    const commitMsg = await askQuestion('Enter commit message: ');
    if (!commitMsg.trim()) {
      console.error('❌ Commit message cannot be empty');
      rl.close();
      return;
    }

    console.log('💾 Committing changes...');
    runCommand(`git commit -m "${commitMsg}"`);

    // Push to GitHub
    console.log('🚀 Pushing to GitHub...');
    runCommand(`git push origin ${branchName}`);

    console.log('\n✅ Successfully pushed to GitHub!\n');
  } catch (err) {
    console.error('\n❌ Process failed:', err.message);
  } finally {
    rl.close();
  }
}

main();