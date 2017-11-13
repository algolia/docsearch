require 'pathname'
class DataStoreFile
  attr_accessor :path, :file_name, :base_file_name, :parent, :github_path, :position

  def initialize(path, file_name, base_file_name, parent)
    @path = path
    @github_path = @path.gsub(Dir.pwd, '')
    @file_name = file_name
    @base_file_name = base_file_name
    @parent = parent
    @data = YAML.load_file(@path).to_ostruct(@github_path)
    @@i ||= 0
    @position = @@i
    @@i = @@i + 1
  end

  def method_missing(method_id, *arguments, &block) # We define this method to be able to forward to the actual data
    @data.public_send(method_id, *arguments, &block)
  end

  def current_path
    @path
  end

  def refresh
    if @parent.get_auto_reload_files # make sure we don't refresh at build time
      @data = YAML.load_file(@path).to_ostruct(@github_path)
    end
  end

  def to_s
    "<DataStoreFile #{@data.keys.join(', ')} >"
  end
end

class DataStore
  attr_reader :base_file_name, :current_path, :parent

  def initialize(current_path=nil, base_file_name=nil, parent=nil)
    if current_path.nil?
      @current_path = Dir.pwd + '/app_data'
    else
      @current_path = current_path
    end
    @cache = {}
    @parent = parent
    @base_file_name = base_file_name
    @@auto_reload_files = false


    load_dir # will preload everything at startup
  end

  def load_dir
    Dir.entries(@current_path).sort_by{|file| file}.each do |file|
      if file == '.' or file == '..'
        next
      end

      file_path = @current_path + '/' + file

      # remove numbers and first '-' from the filename so we can
      # - generate nice urls
      # - omit the number when accessing the object
      base_file_name = file.gsub(/[0-9]*+-?(.+)/, '\1')

      if File.file?(file_path)
        method_name = File.basename(base_file_name, File.extname(file))
        @cache[method_name.to_s] = DataStoreFile.new(file_path, file, method_name, self)
      elsif File.directory?(file_path)
        d = DataStore.new(file_path, base_file_name, self)
        @cache[base_file_name] = d
      end
    end
  end

  def get_auto_reload_files
    @@auto_reload_files
  end

  def set_auto_reload_files(is_auto_releoad)
    @@auto_reload_files = is_auto_releoad
  end

  def flatten
    elements = []

    @cache.sort_by{|k, v| v.current_path }.each do |k, v|
      if v.instance_of?(DataStoreFile)
        v.refresh
        elements.push(v)
      else
        elements.push(*v.flatten)
      end
    end

    elements
  end

  def method_missing(method_id, *arguments, &block)
    method_name = method_id

    # Make sure we are able to access data files with an array syntax
    if method_id == :[]
      method_name = arguments[0].to_sym
    end

    if @cache.has_key?(method_name.to_s)
      if @@auto_reload_files and @cache[method_name.to_s].instance_of?(DataStoreFile)
        @cache[method_name.to_s].refresh
      end

      return @cache[method_name.to_s]
    end

    # Make sure we forward the access to the data
    if @cache.respond_to?(method_name)
      return @cache.public_send(method_name, &block)
    end

    raise('Not found: ' + @current_path + '/' + method_name.to_s + '.yml')
  end

  def to_s
    "<DataStore #{@cache.keys.join(', ')} >"
  end
end