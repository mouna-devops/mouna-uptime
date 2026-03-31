const POLL_INTERVAL = 30 * 1000; // 30 seconds

async function runLocalCron() {
  try {
    const url = `http://localhost:3000/api/cron/check?secret=${process.env.CRON_SECRET || 'my_super_secret_cron_key_123'}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[Local Cron] Ping failed with status ${response.status}`);
    } else {
      const data = await response.json();
      console.log(`[Local Cron] Successfully triggered API endpoint. Checks run: ${data.checksRun}`);
    }
  } catch (error) {
    console.warn(`[Local Cron] Waiting for Next.js server to boot up on port 3000...`);
  }
}

// Start looping
console.log("Starting MouNa Monitoring local continuous background cron pusher...");
setInterval(runLocalCron, POLL_INTERVAL);

// Initial ping after a short delay to let Next.js boot
setTimeout(runLocalCron, 5000);
