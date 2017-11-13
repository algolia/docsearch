module TocHelper
  def build_toc(content, path)
    @@toc ||= {}
    return @@toc[content] if @@toc[content]

    doc = Nokogiri::HTML(content)
    h1 = []
    toc = []
    (doc / 'h1, h2, h3, h4').each do |h_node|
      h = {
          level: h_node.name[1].to_i,
          value: h_node.children.map { |child| child.to_s }.join.gsub(/(\{\#.+?\})/, ''),
          anchor: h_node['id'],
          path: path.gsub(/\/index\.html/, ''),
          children: []
      }
      if toc.empty?
        toc << h
        next
      end
      while toc.size > 0 && h[:level] <= toc.last[:level]
        tmp = toc.pop
        h1 << tmp if tmp[:level] == 1
      end
      if toc.empty?
        toc << h
      else
        toc.last[:children] << h
        toc << h
      end
    end
    @@toc[content] = h1 + toc.select { |h| h[:level] == 1 }
  end

  def get_h3s_toc(node)
    node.css('h3').map do |c_node|
      {
          level: c_node.name[1].to_i,
          value: c_node.children.map { |child| child.to_s }.join,
          anchor: c_node['id']
      }
    end
  end

  def get_guide_toc(page_content)
    doc = Nokogiri::HTML(page_content)
    toc = []
    (doc / 'h2').each do |h_node|
      full_toc_section = h_node.ancestors('.full-toc').first
      h = {
          level: h_node.name[1].to_i,
          value: h_node.children.map { |child| child.to_s }.join,
          anchor: h_node['id'],
          children: full_toc_section ? get_h3s_toc(full_toc_section) : []
      }
      toc.push(h)
    end
    toc
  end

  def get_api_client_toc(language)
    is_readme = (not current_page.metadata[:locals][:readme].nil? and current_page.metadata[:locals][:readme])

    @@api_clients_toc ||= {}
    return @@api_clients_toc[language.code] if @@api_clients_toc[language.code] and not is_readme
    
    tocs = []

    if is_readme and (backend(language) or frontend(language)) and not language.code == 'java1'
      markdown_content = current_page.render({}, {render_toc: false, readme: is_readme, language: language}).gsub('# ', '')
      rendered_content = Tilt['markdown'].new { markdown_content}.render(self)
      tocs << build_toc(rendered_content, current_page.path)
    else
      sitemap.resources.each do |page|
        if page.path.include? "doc/api-client/#{language.code}/" and ((not /\/parameters\/.+?$/.match(page.path)) or /\/parameters\/index\.html$/.match(page.path))
          rendered_content = page.render({layout: 'raw'}, {render_toc: false, readme: is_readme, language: language})
          tocs << build_toc(rendered_content, page.path)
        end
      end
    end

    toc_flatten = tocs.flatten

    unless is_readme
      @@api_clients_toc[language.code] = toc_flatten
    end

    toc_flatten
  end

  def get_single_page_guide_toc(page_content, page)
    build_toc(page_content, page.path)
  end

  def get_titles_for_page(page_content, tag)
    doc = Nokogiri::HTML(page_content)
    (doc / tag).map do |h_node|
      {
          value: h_node.children.map { |child| child.to_s }.join,
          anchor: h_node['id']
      }
    end
  end
end
