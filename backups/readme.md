docker compose up -d

docke* cp backups*roydb-clean.sql roy-postgres:/tmp/*oydb.sql

docker exec*roy-postgres \
psql*-U royuser -d roydb*\
-f /tmp/roydb.sql