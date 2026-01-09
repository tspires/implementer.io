# Makefile for Implementer.io
# Requires: Node.js

PORT ?= 3000
PID_FILE := .server.pid

.PHONY: start stop restart status open clean help install migrate server dev

help:
	@echo "Available commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make dev      - Start Express server with API (recommended)"
	@echo "    make start    - Start static server (npx serve, no API)"
	@echo "    make stop     - Stop the server"
	@echo "    make restart  - Restart the server"
	@echo "    make status   - Check if server is running"
	@echo "    make open     - Open the site in browser"
	@echo ""
	@echo "  Setup:"
	@echo "    make install  - Install server dependencies"
	@echo "    make migrate  - Run database migrations"
	@echo ""
	@echo "  Other:"
	@echo "    make clean    - Remove temporary files"
	@echo ""
	@echo "Options:"
	@echo "  PORT=8080 make dev  - Start on a custom port"

install:
	@echo "Installing server dependencies..."
	@cd server && npm install
	@echo "Done. Copy server/.env.example to server/.env and configure."

migrate:
	@echo "Running database migrations..."
	@cd server && npm run migrate

dev:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "Server already running on PID $$(cat $(PID_FILE))"; \
	else \
		echo "Starting Express server on http://localhost:$(PORT)"; \
		cd server && PORT=$(PORT) node server.js & echo $$! > ../$(PID_FILE); \
		sleep 1; \
		if kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
			echo "Server started (PID: $$(cat $(PID_FILE)))"; \
		else \
			echo "Failed to start server"; \
			rm -f $(PID_FILE); \
			exit 1; \
		fi \
	fi

start:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "Server already running on PID $$(cat $(PID_FILE))"; \
	else \
		echo "Starting static server on http://localhost:$(PORT)"; \
		npx serve -l $(PORT) . > /dev/null 2>&1 & echo $$! > $(PID_FILE); \
		sleep 1; \
		if kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
			echo "Server started (PID: $$(cat $(PID_FILE)))"; \
		else \
			echo "Failed to start server"; \
			rm -f $(PID_FILE); \
			exit 1; \
		fi \
	fi

stop:
	@if [ -f $(PID_FILE) ]; then \
		PID=$$(cat $(PID_FILE)); \
		if kill -0 $$PID 2>/dev/null; then \
			kill $$PID; \
			echo "Server stopped (PID: $$PID)"; \
		else \
			echo "Server not running"; \
		fi; \
		rm -f $(PID_FILE); \
	else \
		echo "No server PID file found"; \
	fi

restart: stop dev

status:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "Server running on PID $$(cat $(PID_FILE))"; \
		echo "URL: http://localhost:$(PORT)"; \
	else \
		echo "Server not running"; \
		rm -f $(PID_FILE) 2>/dev/null || true; \
	fi

open:
	@open http://localhost:$(PORT)

clean:
	@rm -f $(PID_FILE)
	@echo "Cleaned temporary files"
