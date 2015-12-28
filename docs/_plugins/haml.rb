require 'jekyll-haml'

module Jekyll

  class HamlPartialTag < Liquid::Tag
    def initialize(tag_name, file, tokens)
      super
      @file = file.strip
    end

    def render(context)
      includes_dir = File.join(context.registers[:site].source, '_includes')

      if File.symlink?(includes_dir)
        return "Includes directory '#{includes_dir}' cannot be a symlink"
      end

      if @file !~ /^[a-zA-Z0-9_\/\.-]+$/ || @file =~ /\.\// || @file =~ /\/\./
        return "Include file '#{@file}' contains invalid characters or sequences"
      end

      return "File must have \".haml\" extension" if @file !~ /\.haml$/

      Dir.chdir(includes_dir) do
        choices = Dir['**/*'].reject { |x| File.symlink?(x) }
        if choices.include?(@file)
          source     = File.read(@file)
          conversion = ::Haml::Engine.new(source).render
          partial    = Liquid::Template.parse(conversion)
          return partial.render!(context).gsub(/\s+/, ' ')
        else
          "Included file '#{@file}' not found in _includes directory"
        end
      end
    end
  end

end

Liquid::Template.register_tag('haml', Jekyll::HamlPartialTag)
