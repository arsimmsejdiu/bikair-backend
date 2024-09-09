#!/bin/bash
# This script sets the lock status to stored for the locks passed as arguments
# Usage: ./ksc-set-lock-status.sh <lock_id> <lock_id> ...
for i in $@
do
  echo "Setting lock status to stored for lock $i"
  curl -X PUT "https://keysafe-cloud.appspot.com/api/v1/locks/$i/status" -H "Content-Type:application/json" -H "X-Api-Key:409b94f393d44009bdce44f60fc0cf81" -d '{ "lock_status": "stored" }'
done
