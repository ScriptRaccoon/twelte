#!/bin/bash

MIGRATIONS_DIR="./migrations"
LOCAL_COMMAND="sqlite3 twelte.db"
REMOTE_COMMAND="turso db shell twelte"

echo "Choose the database to run migrations on:"
echo "1) Local (SQLite)"
echo "2) Remote (Turso)"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
  # Local database
  for migration in $(ls "$MIGRATIONS_DIR" | sort); do
    if [[ $migration == *.sql ]]; then
      echo "Running migration on local database: $migration"
      $LOCAL_COMMAND < "$MIGRATIONS_DIR/$migration"
      if [ $? -ne 0 ]; then
        echo "Error running migration: $migration"
        exit 1
      fi
    fi
  done

elif [ "$choice" == "2" ]; then
  # Remote database
  for migration in $(ls "$MIGRATIONS_DIR" | sort); do
    if [[ $migration == *.sql ]]; then
      echo "Running migration on remote database: $migration"
      $REMOTE_COMMAND < "$MIGRATIONS_DIR/$migration"
      if [ $? -ne 0 ]; then
        echo "Error running migration: $migration"
        exit 1
      fi
    fi
  done

else
  echo "Invalid choice. Exiting."
  exit 1
fi

echo "All migrations executed successfully."