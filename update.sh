#!/bin/bash

source ../../.env/.env

echo "Updating Raspbot package..."
npm i raspbot;
echo "Raspbot package updated!";
echo "Copio il file di configurazione...";
cp ../../.env/.env .env
echo "File di configurazione copiato!";
echo "Restarting daemon...";
echo $PI_PASS | sudo -S systemctl daemon-reload
echo "Daemons reloaded!";
echo "Restarting service...";
echo $PI_PASS | sudo -S systemctl restart telegram_bot.service;
echo "Service restarted!";
echo "Raspbot updated and restarted!";