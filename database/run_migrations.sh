#!/bin/bash

MIGRATIONS_DIR="./migrations"
DATABASE_FILE="./twelte.db"

for migration in $(ls "$MIGRATIONS_DIR" | sort); do
  if [[ $migration == *.sql ]]; then
    echo "Running migration: $migration"
    sqlite3 "$DATABASE_FILE" < "$MIGRATIONS_DIR/$migration"
    if [ $? -ne 0 ]; then
      echo "Error running migration: $migration"
      exit 1
    fi
  fi
done

echo "All migrations executed successfully."