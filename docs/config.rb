require 'better_errors'
require 'extensions/custom_extension'
require 'lib/php_code_blocks'
require 'sprockets/es6'
require 'lib/hash_ostruct'

activate :custom_extension

set :css_dir, 'doc/assets/stylesheets'
set :js_dir, 'doc/assets/javascripts'
set :images_dir, 'doc/assets/images'

ignore 'doc/assets/javascripts/vendors/*.js'
ignore 'doc/assets/stylesheets/vendors/**/*'
ignore 'templates/*'
ignore 'layouts/*'
ignore 'partials/*'
ignore '**.yml'

page '/docsearch/documentation/*', layout: 'page'

#app.logger.level = :debug
redirects = []

config[:stage] = ENV['STAGE'] || 'develop'

config[:google_tag_mangager_id] = case config[:stage]
   when 'beta'
     'GTM-K4DF9Q'
   when 'production'
     'GTM-N8JP8G'
   else
     'GTM-K4DF9Q'
end

activate :vcs_time
activate :syntax
activate :sprockets do |s|
  s.supported_output_extensions = ['.js', '.es6']
  s.expose_middleman_helpers = true
end

set(:port, 4569)
set :haml, { :ugly => true, :format => :html5 }
set :markdown_engine, :kramdown
set :markdown, parse_block_html: true, fenced_code_blocks: true, input: 'GFM', with_toc_data: true, smartypants: true, hard_wrap: false
set :show_exceptions, false

activate :directory_indexes

configure :server do
  set :debug_assets, true
  #activate :livereload
  use BetterErrors::Middleware
  BetterErrors.application_root = __dir__
  redirects.push({from: '/index.html' , to: '/docsearch'})
end

# Build-specific configuration
configure :build do
  activate :minify_css
  activate :minify_javascript
  #activate :asset_hash
  activate :minify_html
  activate :autoprefixer
  activate :gzip
end

# Legacy Redirects
app_data.redirects.each do |redirect|
  redirects.push({ from: redirect.from, to: redirect.to })
end


ready do
  no_redirect = ENV['NO_REDIRECTS'] && (ENV['NO_REDIRECTS'] == 'true')
  is_travis_pr_build = ENV['TRAVIS_PULL_REQUEST'] && (ENV['TRAVIS_PULL_REQUEST'] != 'false')

  if not no_redirect and not is_travis_pr_build
    redirects.each do |r|
      redirect r[:from][1..-1], to: r[:to]
    end
  end

  proxy '/_redirects', 'templates/redirects', locals: {redirects: redirects}, ignore: true

  sitemap.ensure_resource_list_updated!
  app.sitemap.ensure_resource_list_updated!

  app_data.set_auto_reload_files(app.config[:stage] != 'production')
end