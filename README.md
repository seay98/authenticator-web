# authenticator-web illustration

Generate QR code for google-authenticator.

=============================================
Installation
=============================================

Install nodejs16 and npm. If your OS is CentOS7, you can use yum to install environment (need Internet connection).
1. Install nodejs 16 (version v16.18.1):
    sudo yum install nodejs
2. Install npm (version >= 8.19.2):
    sudo yum install npm

Install process management software pm2 (version 5.2.2. need Internet connection):
    sudo npm install -g pm2

Install nodemon for debug (version 2.0.20. need Internet connection, optional):
    sudo npm install -g nodemon

After copy app to target dirctorr, unzip it:
    tar xzf authenticatior.tar.gz

Change its owner when necessary:
    sudo chown -R root:root authenticator

This tar file has included dependencies. If you want confirm that they are all there, go into the working directory 'authenticator' and run command (need Internet connection):
    npm install

=============================================
Running
=============================================
To run as normal. Get into the working directory 'authenticator' and run command:
    pm2 start bin/www

When you need to debug it, get into the working directory 'authenticator' and run command instead of the command above (need to install nodemon):
    npm start dev

1. You can visit app via browser at http://localhost:3000 or http://127.0.0.1:3000.

2. App will run script 'setup.sh' to get QRcode and secret key. So, if there are any problems, you can try to adjust the script first.

3. This illstraion need internet connection to generate QRcode by far.

To stop the app:
    pm2 stop www

To check the status of app:
    pm2 status

To delete the process in the list:
    pm2 delete www

