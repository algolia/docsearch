class SitemapTree
  def initialize(url_part)
    @parent = nil
    @children = []
    @val = nil
    @url_part = url_part
    @@urls ||= {}
    @position = nil
    @url = nil
  end

  def final_url(url)
    url.gsub('/index.html', '').gsub('.html', '')
  end

  def get_final_url
    "/#{final_url(@url)}/"
  end

  def from_resource(resource)
    @@urls[self.final_url(resource.destination_path).to_sym]
  end

  def from_url(url)
    @@urls[url.to_sym]
  end

  def get_url
    @url
  end

  def set_url(url)
    @url = url
  end

  def add(resource)
    if resource.destination_path.end_with?('.js') or resource.destination_path.end_with?('.css')
      return
    end
    url = self.final_url(resource.destination_path)
    parts = url.split('/')
    used_parts = []
    self.add_parts(parts, used_parts, resource)
  end

  def ancestor(part, level=0)
    ancestors = [self]
    ancestor = self

    while (not ancestor.nil?) and ancestor.get_url_part != part
      ancestor = ancestor.get_parent
      ancestors.unshift(ancestor)
    end

    if (not ancestor.nil?) and ancestor.get_url_part == part
      ancestors[level]
    else
      nil
    end
  end

  def get_position
    @position
  end

  def set_position(position)
    @position = position
  end

  def flatten(take=false)
    resources = []

    if take and not @val.nil? and (@children.length == 0 || (@val.metadata[:page][:languages] and @val.metadata[:page][:languages].length > 0))
      resources.push(self)
    end

    self.get_children.each do |child|
      resources = resources + child.flatten(true)
    end

    resources
  end

  def add_parts(parts, used_parts, val)
    if (parts.length) <= 0
      @val = val
      return
    end

    current_part = parts.shift
    used_parts.push(current_part)
    child = @children.select{|child| child.get_url_part == current_part}
    child = child.length > 0 ? child[0] : nil

    if child.nil?
      child = SitemapTree.new(current_part)
      child.set_parent(self)
      url = used_parts.join('/')
      child.set_url(url)
      @@urls[url.to_sym] = child
      child.set_position(@children.length)
      @children.push(child)
    end

    child.add_parts(parts, used_parts, val)
  end

  def find(parts)
    if parts.length <= 0
      return self
    end

    current_part = parts.shift
    child = @children.select{|child| child.get_url_part == current_part}

    if child.length > 0
      child[0].find(parts)
    else
      nil
    end
  end

  def siblings
    @parent.get_children
  end

  def set_val(val)
    @val = val
  end

  def get_val
    @val
  end

  def get_url_part
    @url_part
  end

  def set_parent(parent)
    @parent = parent
  end

  def get_children
    @children
  end

  def get_pages
    @children.select{|c| c.get_val}
  end

  def get_parent
    @parent
  end

  def pretty_print (space)
    spaces = space >= 0 ? " " * space : ''

    if @url_part
      print(spaces + @url_part + "\n")
    end

    if @val
      print(spaces + " -> r\n")
    end

    @children.each do |child|
      child.pretty_print(space + 1)
    end
  end
end