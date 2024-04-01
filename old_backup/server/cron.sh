#!/bin/bash

# Navigate to the directory where your Node.js script is located
cd /Users/dokume/work/dokume-india/game/server/cron

# Start your Node.js script using pm2
pm2 start jobs.js --name cron_job_game 

# Save the process list so pm2 restarts your script on system reboot
pm2 save

# Display a message indicating that the script is running
echo "Your cron job is running with pm2."