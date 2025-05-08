#!/bin/bash

# Function to start the database
start_db() {
    echo "Starting PostgreSQL database..."
    docker compose -f docker-compose.yml up -d
    echo "Waiting for database to be ready..."
    sleep 5
}

# Function to stop the database
stop_db() {
    echo "Stopping PostgreSQL database..."
    docker compose -f docker-compose.yml down
}

# Function to reset the database
reset_db() {
    echo "Resetting database..."
    docker compose -f docker-compose.yml down -v
    docker compose -f docker-compose.yml up -d
    sleep 5
    npx prisma migrate reset --force
}

# Function to run migrations
run_migrations() {
    echo "Running database migrations..."
    npx prisma migrate dev
}

# Main script logic
case "$1" in
    "start")
        start_db
        ;;
    "stop")
        stop_db
        ;;
    "reset")
        reset_db
        ;;
    "migrate")
        run_migrations
        ;;
    *)
        echo "Usage: $0 {start|stop|reset|migrate}"
        exit 1
        ;;
esac 