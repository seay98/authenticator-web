#!/bin/bash

printf "${2}\ny\ny\ny\ny\ny\n" | su -c 'google-authenticator' ${1}
