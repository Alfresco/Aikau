#!/bin/sh

# Version numbers (change these)
CHROMEDRIVER_VERSION="2.20"
SELENIUM_VERSION="2.49"
SELENIUM_REVISION="2.49.1"

# Filenames (normally don't change these)
CHROMEDRIVER_FILENAME="chromedriver_linux64.zip"
SELENIUM_FILENAME="selenium-server-standalone-$SELENIUM_REVISION.jar"

# Avoid re-downloading if already installed
set -e
if [ -e /.installed ]; then
   echo 'Already installed.'
else
   echo ''
   echo 'INSTALLING'
   echo '----------'

   # Add Google public key to apt
   wget -q -O - "https://dl-ssl.google.com/linux/linux_signing_key.pub" | sudo apt-key add -

   # Add Google to the apt-get source list
   echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list

   # Update app-get
   apt-get update

   # Install Java, Chrome, Xvfb, unzip, firefox
   apt-get -y install openjdk-7-jre google-chrome-stable xvfb unzip firefox

   # Go to tmp directory for doing downloads
   cd /tmp

   # Download and copy the ChromeDriver to /usr/local/bin
   wget "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/$CHROMEDRIVER_FILENAME"
   unzip $CHROMEDRIVER_FILENAME
   mv chromedriver /usr/local/bin

   # Download and copy Selenium to /usr/local/bin
   wget "http://selenium-release.storage.googleapis.com/$SELENIUM_VERSION/$SELENIUM_FILENAME"
   mv $SELENIUM_FILENAME /usr/local/bin

   # So that running `vagrant provision` doesn't redownload everything
   touch /.installed
fi

# Start Xvfb, Chrome, and Selenium in the background
export DISPLAY=localhost:10
cd /vagrant

echo "Starting Xvfb (v`dpkg -s xvfb| grep Version|cut -d: -f2`)..."
Xvfb :10 -screen 0 1366x768x24 -ac -extension RANDR &

echo "Starting Google Chrome (v`dpkg -s google-chrome-stable| grep Version|cut -d: -f2` w/ Chrome Driver v$CHROMEDRIVER_VERSION)..."
google-chrome --remote-debugging-port=9222 &

echo "Starting Firefox..."
firefox &

echo "Starting Selenium (v$SELENIUM_VERSION)..."
nohup java -jar /usr/local/bin/$SELENIUM_FILENAME &
