# Usage: containerId db_user
docker exec -it $1 bash
mysql -u $2 -p