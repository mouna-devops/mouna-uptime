const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('npx prisma generate', { env: { ...process.env, CI: 'true', NO_COLOR: '1' } });
  fs.writeFileSync('prisma-out.txt', out.toString());
} catch (e) {
  const err = (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : '') + '\n' + e.message;
  fs.writeFileSync('prisma-err.txt', err);
}
