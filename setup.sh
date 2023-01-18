#!/bin/bash

printf "y\ny\ny\ny\ny\n" | su -c 'google-authenticator' ${1}

# su - ${1}
# printf "y\ny\ny\ny\ny\n" | google-authenticator
