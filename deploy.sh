#!/bin/bash

PI_IP="pip.local"
PI_USER="wolf"
APP_NAME="pip"

VERSION=$(cat version.txt)
NEW_VERSION=$(echo $VERSION | awk -F. '{ $NF+=1; printf "%d.%d.%d\n", $1, $2, $NF }')
echo $NEW_VERSION > version.txt

yarn quasar build --env VERSION=$VERSION

scp -r dist/spa/* $PI_USER@$PI_IP:/var/www/$APP_NAME

ssh $PI_USER@$PI_IP 'export DISPLAY=:0; xdotool key F5'