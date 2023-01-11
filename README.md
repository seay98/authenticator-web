# authenticator-web illustration

=============================================
Installation
=============================================

Install nodejs16 and npm. If your OS is CentOS7, you can use yum to install environment (need Internet connection).
1. Install nodejs 16:
    sudo yum install nodejs
2. Install npm:
    sudo yum install npm

Install process management software pm2 (need Internet connection):
    sudo npm install -g pm2

Install nodemon for debug (need Internet connection, optional):
    sudo npm install -g nodemon

After copy app to target dirctorr, unzip it:
    tar xzf authenticatior.tar.gz

Change its owner when necessary:
    sudo chown -R USER:GROUP authenticator


=============================================
Running
=============================================
To run as normal. Get into the working dirctory 'authenticator' and run command:
    pm2 start bin/www
When you need to debug it, get into the working dirctory 'authenticator' and run command (need to install nodemon):
    npm start dev

1. You can visit app via browser at http://localhost:3000 or http://127.0.0.1:3000.

2. App will run script 'setup.sh' to get QRcode and secret key. So, if there are any problems, you can try to adjust the script first.

3. This illstraion need internet connection to generate QRcode by far.

To stop the app:
    pm2 stop www

To check the status of app:
    pm2 status

