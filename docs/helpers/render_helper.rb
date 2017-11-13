require 'erubis'

module RenderHelper
  def get_current_language()
    if respond_to?(:current_page)
      current_page.metadata[:locals][:language]
    else
      nil
    end
  end

  def echo(str, template_data = nil)
    if str.nil?
      return ""
    end

    language = (template_data and template_data[:language]) ? template_data[:language] : get_current_language

    if respond_to?(:current_page)
      current_page.metadata[:locals].keys.each do |key|
        singleton_class.send(:define_method, key) { current_page.metadata[:locals][key] }
      end
    end

    if (not template_data.nil?) and template_data
      template_data.each do |key, value|
        singleton_class.send(:define_method, key) { value }

        if [:method_snippet_obj, :parameter_snippet_obj].include?(key) and not value.nil?
          if key == :method_snippet_obj
            link = edit_link("/data/api_methods/#{value['method_key']}/#{value['method_key']}_snippet.yml", 'this snippet')
          end
          if key == :parameter_snippet_obj
            link = edit_link("/data/parameters/#{value['param_key']}.yml", 'this snippet')
          end

          singleton_class.send(:define_method, '_snippet') { value }

          value.to_h.keys.each do |snippet_key|
            singleton_class.send(:define_method, snippet_key) { value[snippet_key] }
          end
        end
      end
    end

    template = Erubis::Eruby.new(str)
    res = template.result(binding)
  end

  def render_current_page(options)
    if config[:stage] == 'develop'
      current_page.render({layout: 'raw'}, options)
    else
      @@page_content ||= {}
      @@page_content[current_page.destination_path] ||= current_page.render({layout: 'raw'}, options)
      @@page_content[current_page.destination_path]
    end
  end

  def snippet(name, force_tabs=false)
    snippet = nil

    if name.instance_of?(String)
      snippet = current_page.metadata[:locals][:guide_snippet]
      if snippet
        edit_link = edit_link("/source/#{current_page.metadata[:locals][:snippet_file]}", 'snippet')
        if snippet[name.to_sym]
          snippet = snippet[name.to_sym]
        end
      else
        snippet = name
        return "<div class='snippet-wrapper'>\n\n#{echo snippet}\n\n</div>"
      end
    else
      snippet = name
      edit_link = edit_link(snippet.github_link)
    end

    language = get_current_language

    if snippet
      if language and not force_tabs
        if snippet[language.code.to_sym]
          "<div class='snippet-wrapper'>#{edit_link}\n\n#{echo snippet[language.code.to_sym]}\n\n</div>"
        else
          raise("snippet #{name} in #{language.code} not found for #{current_page.destination_path}")
        end
      else
        ordered_languages = [:php, :ruby, :javascript, :python, :swift, :android, :csharp, :java, :go, :scala]
        languages = snippet.keys
        languages.delete(:rest_example)
        languages.delete(:method_key)
        languages.delete(:java1)

        languages.sort_by!{|x| i = ordered_languages.index(x); i.nil? ? 1000: i}

        out = []
        out << "<div class='snippet-wrapper'>#{edit_link}"
        out << "<p class='copy-link circle-link text-sm text-demi text-center pos-abt z-1'>"
          out << "<a href='#' class='btn btn-danger no-padding text-center' target='_blank' rel='noopener'>"
            out << "<i class='icon-copy'></i>"
            out << "<span class='tooltip nowrap color-white text-sm text-demi pos-abt'>"
              out << "<span class='tooltip-bg pos-abt fill-bunting'></span>"
                out << "Copy"
            out << "</span>"
          out << "</a>"
        out << "</p>"
        out << "<div class='snippet-header'>"
          out << "<div class='snippet-header-circle'></div>"
          out << '<ul class="nav nav-tabs">'
          languages.each_with_index do |language_code, i|
            if snippet[language_code.to_sym].strip.length > 0
              out << "  <li#{' class="active"' if i == 0}><a href=\"#snippet_#{anchorize(language_code.to_s)}\" data-toggle=\"tab\">#{language_code}</a></li>"
            end
          end
          out << '</ul>'
        out << '</div>'
        out << '<div class="tab-content">'
        languages.each_with_index do |language_code, i|
          if snippet[language_code.to_sym].strip.length > 0
            out << "  <div id=\"snippet_#{anchorize(language_code.to_s)}\" class=\"tab-pane#{' in active' if i == 0}\" data-language=\"#{language_code}\">#{snippet[language_code.to_sym].gsub(/```(.+?)$/, "```\\1*")}</div>"
          end
        end
        out << '</div>'
        out << '</div>'

        out.join("\n")
      end
    else
      raise("snippet #{name} not found for #{current_page.destination_path}")
    end
  end

  def haml(template_path, locals)
    Middleman::Renderers::HamlTemplate.new(template_path).render(self, locals)
  end

  def markdown(content)
    Tilt['markdown'].new(nil, 1, {
        parse_block_html: true, fenced_code_blocks: true, input: 'GFM', with_toc_data: true, smartypants: true, hard_wrap: false
    }) { echo(content) }.render(self)
  end

  def render_readme_section(template_path, language)
    content = Middleman::Renderers::ERb::Template.new(template_path).render(self, {language: language})

    if template_path == 'source/doc/tutorials/1-getting-started/quick-start-with-the-api-client.html.md.erb'
      content = content.gsub(/<section>.*?<\/section>(.*)<section>.*?<\/section>/smu, '\1')
    end
    content.gsub(/<table.*?<\/table>/smu, '')
      .gsub(/(\-\-\-.+?\-\-\-)/m, '')
      .gsub(/(([^\n]+\n)+)\{\:(.*\s+)?\.alert-info(\s+.*)?\}/, '**Note:** \1') # render `alert-info` with "Note:" prefix
      .gsub(/(([^\n]+\n)+)\{\:(.*\s+)?\.alert-warning(\s+.*)?\}/, '**Warning:** \1') # render `alert-warning` with "Warning:" prefix
      .gsub(/(([^\n]+\n)+)\{\:(.*\s+)?\.alert-danger(\s+.*)?\}/, '**Caution:** \1') # render `alert-danger` with "Caution:" prefix
      .gsub(/(\{\:.+?\})/, '') # catch-all case to remove any remaining Inline Attribute Lists (IAL)
      .gsub(/(\{\#.+?\})/, '')
      .gsub(/<\/?section>/, '')
      .gsub(/<div.+?>/, '')
      .gsub(/<\/div>/, '')
      .gsub(/<section.+?>/, '')
      .gsub(/<\/section>/, '')
      .gsub(/\n{2,}/, "\n\n")
      .gsub(/\[(.+?)\]\((\/doc\/.+?)\)/, '[\1](https://www.algolia.com\2)')
  end

  def frontend(language)
    ['android', 'javascript', 'swift'].include?(language.code)
  end

  def backend(language)
    ['csharp', 'go', 'java1', 'java', 'javascript', 'php', 'python', 'ruby', 'scala'].include?(language.code)
  end

  def framework(language)
    ['rails', 'laravel', 'symfony', 'django'].include?(language.code)
  end

  def parameters_dir_got_scope(param_dir, scope)
    param_dir.keys.each do |parameter_name|
      parameter = param_dir[parameter_name]
      if parameter.scope.include?(scope)
        return true
      end
    end
    false
  end

  def fetch_parameter(name)
    unless name.is_a? String
      return name
    end

    app_data.parameters.each do |key, group|
      group.each do |param_key, param|
        if param.name == name || param.name == "#{name} (deprecated)"
          return param
        end
      end
    end

    raise("Did not find param #{name}")
  end

  def parameter_toc(parameter_name)
    param = fetch_parameter parameter_name
    "- #{parameter_link(parameter_name)} `#{param.scope.join('`, `')}`"
  end

  def parameter_link_html(param)
    "/doc/api-reference/api-parameters/#{param.name}/"
  end

  def parameter_link(parameter_name)
    param = fetch_parameter parameter_name
    name = param.name

    "[#{name}](#{parameter_link_html(param)})"
  end

  def anchorize(string)
    if string.nil?
      "NOT FOUND ANCHOR"
    else
      string.gsub(/\s/, "-").gsub(/[()\/",`'&<>\.]/, "").downcase
    end
  end

  def generate_id(str)
    id = (str || '').gsub(/\s/, "-").gsub(/[()\/",`']/, "").downcase
    @ids ||= {}
    @ids[id] ||= 0
    @ids[id] += 1
    @ids[id] == 1 ? id : "#{id}-#{@ids[id]}"
  end

  def method_toc(method_name)
    api_method = app_data.api_methods.flatten.select{|api_method| api_method.base_file_name == method_name}.first


    if api_method.nil?
      raise "issue generating name for #{method_name}"
    end

    "[#{api_method.name}](/doc/api-reference/api-methods/#{api_method.base_file_name.gsub('_', '-')}/)"
  end

  def edit_link(file, ressource_name='', classes='')
    if current_page and not current_page.metadata[:locals][:readme].nil? and current_page.metadata[:locals][:readme]
      ''
    else
      out = []
      out << "<p class=\"edit-link circle-link text-sm text-demi text-center pos-abt z-1 #{classes}\">"
        out << "<a href='#' class='btn btn-danger no-padding text-center' target='_blank' rel='noopener' data-link='https://github.com/algolia/doc/edit/develop#{file}'>"
          out << "<i class='icon-github'></i>"
          out << "<span class='tooltip nowrap color-white text-sm text-demi pos-abt'>"
            out << "<span class='tooltip-bg pos-abt fill-bunting'></span>"
            out << "Edit #{ressource_name}"
          out << "</span>"
        out << "</a>"
      out << "</p>"
      out.join('')
    end
  end
end
