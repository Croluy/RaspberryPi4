#!/bin/bash

source /home/kali/home/kali/Scripts/node_modules/raspbot/.env

echo "Pass: $PI_PASS"
echo $PI_PASS

echo "Updating Raspbot package..."
npm i raspbot;
echo "Raspbot package updated!";
echo "Restarting daemon...";
echo $PI_PASS | sudo -S systemctl daemon-reload
echo "Daemons reloaded!";
echo "Restarting service...";
echo $PI_PASS | sudo -S systemctl restart telegram_bot.service;
echo "Service restarted!";
echo "Raspbot updated and restarted!";