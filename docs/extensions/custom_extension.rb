require 'lib/sitemap_tree'
require 'lib/data_store'

class CustomExtension < Middleman::Extension
  expose_to_config :unslug
  expose_to_template :unslug

  expose_to_template :sitemap_tree
  expose_to_config :sitemap_tree
  expose_to_template :app_data
  expose_to_config :app_data
  expose_to_application :app_data

  def app_data
    @@app_data
  end

  def sitemap_tree
    @@sitemap_tree
  end

  def initialize(app, options_hash={}, &block)
    @@sitemap_tree = SitemapTree.new(nil)
    @@app_data = DataStore.new
    super
  end

  def manipulate_resource_list(resources)
    all_resources = []

    resources = resources.sort do |a,b|
      if a.file_descriptor.nil?
        -1
      elsif b.file_descriptor.nil?
        1
      else
        a.file_descriptor.full_path.to_s <=> b.file_descriptor.full_path.to_s
      end
    end

    resources.each do |resource|
      if resource.instance_of?(Middleman::Sitemap::Extensions::RedirectResource) or resource.path.include?('.yml')
        all_resources.push(resource)
        next
      end

      resource.destination_path = resource.destination_path.gsub(/\/[0-9]+?-/, '/')
      resource.add_metadata({locals: {render_toc: true}})

      data_file = resource.file_descriptor.full_path.to_s.gsub(/([^\.]+?)\..*?$/, '\1.yml')

      if File.exist?(data_file) and data_file != resource.file_descriptor.full_path.to_s
        data = DataStoreFile.new(data_file, File.basename(data_file), File.basename(data_file, 'yml'), nil)

        resource.add_metadata({locals: {guide_snippet: data, snippet_file: Pathname(data_file).relative_path_from(app.source_dir)}})
      end

      resource.add_metadata({page: {popularity: (app_data.google_analytics[resource.destination_path.gsub('/index.html', '').gsub('.html', '')] || 0)}})

      @@sitemap_tree.add(resource)
      all_resources.push(resource)
    end

    all_resources
  end

  def unslug(slug)
    if not app_data.docs.unslug[slug].nil?
      app_data.docs.unslug[slug]
    else
      slug.gsub('-', ' ').capitalize
    end
  end
end

::Middleman::Extensions.register(:custom_extension, CustomExtension)