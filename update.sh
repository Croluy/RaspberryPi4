#!/bin/bash

source ../../.env/.env;
echo "Updating Raspbot package...";
npm uninstall raspbot;
npm i raspbot;
echo "Raspbot package updated!\n";
echo "Copio il file di configurazione...";
cp ../../.env/.env .env;
echo "File di configurazione copiato!\n";
echo "Restarting daemon...";
echo $PI_PASS | sudo -S systemctl daemon-reload
echo "Daemons reloaded!\n";
echo "Restarting service...";
echo $PI_PASS | sudo -S systemctl restart telegram_bot.service;
echo "Service restarted!\n";
echo "✅ Raspbot updated and restarted!";