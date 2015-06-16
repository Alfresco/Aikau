#!/bin/sh

# Version numbers (change these)
CHROMEDRIVER_VERSION="2.15"
FIREFOX_VERSION="38.0"
PHANTOMJS_VERSION="1.9.8"
SELENIUM_VERSION="2.46"

# Filenames (normally don't change these)
CHROMEDRIVER_FILENAME="chromedriver_linux64.zip"
PHANTOMJS_FILENAME="phantomjs-$PHANTOMJS_VERSION-linux-x86_64" # NOTE: Don't include .tar.bz2 extension here
SELENIUM_FILENAME="selenium-server-standalone-$SELENIUM_VERSION.0.jar"

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

   # Download and copy Phantomjs to /usr/local/bin
   wget "https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOMJS_FILENAME.tar.bz2"
   tar -xjvf $PHANTOMJS_FILENAME.tar.bz2
   mv $PHANTOMJS_FILENAME/bin/phantomjs /usr/local/bin

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

echo "Starting Firefox (v$FIREFOX_VERSION)..."
firefox &

echo "Starting Phantomjs ($PHANTOMJS_VERSION)..."
phantomjs --ignore-ssl-errors=true --web-security=false --webdriver=192.168.56.4:4444 &

echo "Starting Selenium (v$SELENIUM_VERSION)..."
nohup java -jar /usr/local/bin/$SELENIUM_FILENAME &
