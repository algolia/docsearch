all: install
	bundle exec middleman server

install:
	bundle install

build:
	yarn
	rm -rf build
	bundle exec middleman build

.PHONY: build
