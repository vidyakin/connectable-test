#!/bin/bash

USER=$MONGO_USER
PASS=$MONGO_PASS
ROLE='readWrite'
DB_NAME='connectable'

# check user/pass vars
if [ -n "$MONGO_USER" ] && [ -n "$MONGO_PASS" ]
then
    echo "OK: \$MONGO_USER and \$MONGO_PASS"
else
      echo "\$MONGO_USER or \$MONGO_PASS is EMPTY!"
      echo "Exiting..."
      exit 1
fi

# create DB and dummy collection
# create APP user for mongo db
echo "Creating user: $USER ..."
mongo --eval \
"""
db = db.getSiblingDB('$DB_NAME');
db.createCollection('init');
db.getUsers();

db.createUser(
    {
        user: '$USER',
        pwd: '$PASS',
        roles:[
            {
                role: '$ROLE',
                db:   '$DB_NAME'
            }
        ]
    }
)
"""
echo "==========================="
echo "MongoDB User: $USER"
echo "MongoDB Password: $PASS"
echo "MongoDB Database: $DB_NAME"
echo "MongoDB Role: $ROLE"
echo "==========================="
