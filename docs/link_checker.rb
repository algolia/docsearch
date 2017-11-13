require 'nokogiri'

require 'find'

html = []
Find.find('build') do |path|
  html << path if path =~ /.*\.html$/
end

files = {}
links = []
anchors = []

html.each do |page|
  content = File.read(page)
  files[page] = Nokogiri::HTML(content)

  (files[page] / 'a, link').each do |link|
    href = link['href'].gsub(/http(s)?:\/\/(www\.)?algolia\.com\/doc\//, '/doc/')
                        .gsub(/\/$/, '')
                        .gsub(/\/#/, '#')

    if href.start_with?('javascript:', 'http://', 'https://', 'mailto:', '//') or href.end_with?('.css', '.ico', 'png') or href == '#'
      next
    end

    if href.start_with?('doc', '/doc')
      parts = href.split('#')
      link = "build#{parts[0]}/index.html"
      anchor = parts.size >= 2 ? "##{parts[1]}": nil
      links.push({link: link, from: page})

      unless anchor.nil?
        anchors.push({link: link, anchor: anchor, from: page})
      end
    elsif href.start_with?('#')
      anchors.push({link: page, anchor: href, from: page})
    end
  end
end

errors_count_links = 0
errors_count_anchors = 0

links = links.uniq{ |x| "#{x[:link]}"}

links.each do |link|
  unless File.file?(link[:link])
    errors_count_links += 1
    print "[ERROR] Did not find #{link[:link]} included in page #{link[:from]}\n"
  end
end

anchors = anchors.uniq{ |x| "#{x[:link]}#{x[:anchor]}"}

anchors.each do |anchor|
  if files[anchor[:link]].nil?
    errors_count_links += 1
    print "[ERROR] Did not find #{anchor[:anchor]} included in page #{anchor[:from]}\n"
    next
  end

  begin
    matching_anchors = files[anchor[:link]].css(anchor[:anchor])
  rescue Nokogiri::CSS::SyntaxError
    matching_anchors = []
  end

  if matching_anchors.size <= 0
    errors_count_anchors += 1
    print "[ERROR] Did not find #{anchor[:anchor]} included in page #{anchor[:from]}\n"
  end
end

print "Checked #{links.size} links and #{anchors.size} anchors. #{errors_count_links} bad link. #{errors_count_anchors} bad anchors\n"

if errors_count_anchors + errors_count_links > 0
  exit(1)
end