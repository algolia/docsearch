Documentation Search
=========================

# Development

You need [ruby](https://www.ruby-lang.org/en/), [bundler](http://bundler.io/).

```sh
bundle install
bundle exec guard
```

## MacOS

If you are using `brew` and you had `brew install openssl`, you may need to configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```
