# Makefile for DurianLab Email Backend Microservice
# Container-first development following Day 1 principles

.PHONY: help install dev start build test test-unit test-validation test-email test-integration test-coverage test-watch lint clean docker-build docker-run docker-compose-up docker-compose-down docker-push

# Docker repository configuration
DOCKER_REPO ?= phamduchongan93/durianlab-email-backend
VERSION = $(shell node -p "require('./package.json').version")

# Default target
help: ## Show this help message
	@echo "DurianLab Email Backend - Node.js Microservice Makefile"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick aliases: i=install, d=dev, b=build, t=test, tu=test-unit, c=clean"

install: ## Install npm dependencies
	@echo "Installing npm dependencies..."
	@if [ -f package-lock.json ]; then \
		echo "Found package-lock.json, using npm ci..."; \
		npm ci; \
	else \
		echo "Installing dependencies..."; \
		npm install; \
	fi

dev: ## Start development server with nodemon
	@echo "Starting development server..."
	npm run dev

start: ## Start production server
	@echo "Starting production server..."
	npm start

build: ## Build the application (for production)
	@echo "Building application..."
	@echo "No build step required for Node.js app"

test: ## Run all tests
	@echo "Running all tests..."
	npm test

test-unit: ## Run unit tests only
	@echo "Running unit tests..."
	npm test -- --testPathPattern=__tests__ --coverage=false

test-validation: ## Run validation middleware tests
	@echo "Running validation tests..."
	npm test -- --testNamePattern="Validation Middleware"

test-email: ## Run email controller tests
	@echo "Running email controller tests..."
	npm test -- --testNamePattern="Email Controller"

test-integration: ## Run integration tests (API endpoints)
	@echo "Running integration tests..."
	@echo "Note: Requires server running on port 3000"
	@curl -f http://localhost:3000/health > /dev/null 2>&1 && echo "Server is running" || (echo "Server not running. Start with 'make dev' first"; exit 1)
	@echo "Testing contact endpoint..."
	@curl -X POST http://localhost:3000/api/contact \
		-H "Content-Type: application/json" \
		-d '{"name":"Test User","email":"test@example.com","message":"Integration test"}' \
		-s -o /dev/null -w "Status: %{http_code}\n"

test-coverage: ## Run tests with coverage report
	@echo "Running tests with coverage..."
	npm test -- --coverage

test-watch: ## Run tests in watch mode
	@echo "Running tests in watch mode..."
	npm test -- --watch

lint: ## Run ESLint
	@echo "Running ESLint..."
	npm run lint

clean: ## Clean node_modules and cache
	@echo "Cleaning dependencies..."
	rm -rf node_modules package-lock.json
	npm cache clean --force

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	docker build --build-arg VERSION=$(VERSION) -t $(DOCKER_REPO):$(VERSION) .

docker-run: ## Run Docker container locally
	@echo "Running Docker container..."
	docker run -p 3000:3000 --env-file .env $(DOCKER_REPO):$(VERSION)

docker-compose-up: ## Start services with docker-compose
	@echo "Starting services with docker-compose..."
	docker-compose up --build

docker-compose-down: ## Stop services with docker-compose
	@echo "Stopping services..."
	docker-compose down

docker-push: ## Push Docker image to registry
	@echo "Pushing Docker image..."
	docker push $(DOCKER_REPO):$(VERSION)

docker-deploy: ## Build, tag, and push Docker image
	@echo "Building, tagging, and pushing Docker image..."
	$(MAKE) docker-build
	docker tag $(DOCKER_REPO):$(VERSION) $(DOCKER_REPO):latest
	$(MAKE) docker-push

setup: ## Initial setup - install dependencies and start dev
	@echo "Setting up the project..."
	$(MAKE) install
	$(MAKE) dev

check: ## Run all checks (lint, test, coverage)
	@echo "Running all checks..."
	$(MAKE) lint || echo "Linting issues found"
	$(MAKE) test-coverage

# Quick development targets
i: install ## Alias for install
d: dev ## Alias for dev
b: build ## Alias for build
t: test ## Alias for test
tu: test-unit ## Alias for test-unit
tv: test-validation ## Alias for test-validation
te: test-email ## Alias for test-email
ti: test-integration ## Alias for test-integration
tc: test-coverage ## Alias for test-coverage
tw: test-watch ## Alias for test-watch
c: clean ## Alias for clean
dcu: docker-compose-up ## Alias for docker-compose-up
dcd: docker-compose-down ## Alias for docker-compose-down