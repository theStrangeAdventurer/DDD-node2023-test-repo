psql -f install.sql -U postgress
PGPASSWORD=$NODE_23_DB_PASSWORD psql -d example -f structure.sql -U $NODE_23_DB_USER
PGPASSWORD=$NODE_23_DB_PASSWORD psql -d example -f data.sql -U $NODE_23_DB_USER
