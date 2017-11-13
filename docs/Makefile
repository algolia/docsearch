all: install
	bundle exec middleman server

install:
	bundle install

build:
	npm install
	rm -rf build
	bundle exec middleman build

.PHONY: build
