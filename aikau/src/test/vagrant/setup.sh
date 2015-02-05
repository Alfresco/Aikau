#!/bin/sh

SELENIUM_VERSION="selenium-server-standalone-2.44.0.jar"
SELENIUM_VERSION_NUMBER="2.44"
PHANTOMJS_VERSION="phantomjs-1.9.7-linux-x86_64" #don't include .tar.bz2 ext.
CHROMEDRIVER_VERSION="2.10"
CHROME_VERSION="40.0.2214.95-1"
FIREFOX_VERSION="34.0"

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

   # Install Java, Chrome, Xvfb, unzip, firefox and libicu48
   apt-get -y install openjdk-7-jre google-chrome-stable=$CHROME_VERSION xvfb unzip libicu48

   cd /tmp

   # Download and copy the ChromeDriver to /usr/local/bin
   wget "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip"
   unzip chromedriver_linux64.zip
   mv chromedriver /usr/local/bin

   # Download and copy Phantomjs to /usr/local/bin
   wget "https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOMJS_VERSION.tar.bz2"
   tar -xjvf $PHANTOMJS_VERSION.tar.bz2
   mv $PHANTOMJS_VERSION/bin/phantomjs /usr/local/bin

   # Download and copy Selenium to /usr/local/bin
   wget "http://selenium-release.storage.googleapis.com/$SELENIUM_VERSION_NUMBER/$SELENIUM_VERSION"
   mv $SELENIUM_VERSION /usr/local/bin

   wget "https://ftp.mozilla.org/pub/mozilla.org/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.bz2"
   tar -xjvf firefox-$FIREFOX_VERSION.tar.bz2
   cp -r firefox /usr/local/bin/

   # So that running `vagrant provision` doesn't redownload everything
   touch /.installed
fi

# Start Xvfb, Chrome, and Selenium in the background
export DISPLAY=:10
cd /vagrant

echo "Starting Xvfb (v`dpkg -s xvfb| grep Version|cut -d: -f2`)..."
Xvfb :10 -screen 0 1366x768x24 -ac &

echo "Starting Google Chrome (v`dpkg -s google-chrome-stable| grep Version|cut -d: -f2` w/ Chrome Driver v$CHROMEDRIVER_VERSION)..."
google-chrome --remote-debugging-port=9222 &

echo "Starting Firefox (v$FIREFOX_VERSION)..."
cd /usr/local/bin/firefox
firefox &
cd - > /dev/null

echo "Starting Phantomjs ($PHANTOMJS_VERSION)..."
phantomjs --ignore-ssl-errors=true --web-security=false --webdriver=192.168.56.4:4444 &

echo "Starting Selenium (v$SELENIUM_VERSION_NUMBER)..."
cd /usr/local/bin
nohup java -jar ./$SELENIUM_VERSION &