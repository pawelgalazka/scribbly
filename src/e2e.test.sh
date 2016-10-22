#!/bin/bash

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  echo 'Exiting with error.' 1>&2;
  exit 1
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Echo every command being executed
set -x

echo 'Sandbox tests'
cd ./sandbox

echo 'Cleaning'
rm -rf node_modules
rm -rf log.txt

echo 'Installing scribbly'
npm install ../

echo 'Running testing module'
DEBUG=main node index.js
