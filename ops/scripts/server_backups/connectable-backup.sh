#!/bin/bash

# set vars
env_file='.env.prod'
source "$HOME/$env_file"
timestamp=$(date '+%Y_%m_%d_%H_%M')
backup_root='/tmp/backup'
backup_dir="$backup_root/$timestamp"
repo_dir="connectable"

#
echo 'Backup Database...';
mkdir -p $backup_dir && cd $backup_dir
# run side container in the same network and mound
docker run -v $(pwd):/workdir/ -t \
    --network connectable_default mongo:4.0 bash \
    -c "mongodump --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@mongodb:27017" --out=/workdir/db_dump" && \

echo 'Backup Repository...';
cp -r "$HOME/$repo_dir" "$backup_dir/$repo_dir" && \
cd "$backup_dir/$repo_dir";
git clean -fd;
git checkout -- .;
git pull origin master && \

# push to Buket (role is used)
sudo chown -R tech:tech $backup_dir && \
cd $backup_dir && \
tar -cvf "$backup_root/$timestamp.zip" . && \
gsutil cp -r "$backup_root/$timestamp.zip" gs://connectable-backups && \
echo 'Cleanup..';
cd $HOME && rm -rf $backup_dir && rm "$backup_root/$timestamp.zip" && \
echo 'Done'
