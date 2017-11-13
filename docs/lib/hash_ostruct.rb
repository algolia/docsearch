require 'ostruct'

class CustomStruct < OpenStruct
  def initialize(hash, path)
    @path = path
    super(hash)
  end

  def github_link
    @path
  end


  # OpenStruct does not allow to call hash methods so we forward them if it exists
  # This also means that we are not able to have keys named like hash methods
  def method_missing(method_id, *arguments, &block)
    if to_h.respond_to?(method_id)
      to_h.public_send(method_id, &block)
    else
      super(method_id, *arguments)
    end
  end
end

class Hash
  @path = nil
  # Recursively converts a <tt>Hash</tt> and all nested <tt>Hash</tt>es to
  def to_ostruct(path)
    @path = path
    arr = map do |k, v|
      case v
        when Hash
          [k, v.to_ostruct(@path)]
        when Array
          [k, v.map { |el| el.respond_to?(:to_ostruct) ? el.to_ostruct(@path) : el }]
        else
          [k, v]
      end
    end
    CustomStruct.new(Hash[arr], @path)
  end
end

class Array
  @path = nil
  def to_ostruct(path)
    @path = path
    map do |item|
      if item.respond_to? :to_ostruct
        item.to_ostruct(@path)
      else
        item
      end
    end
  end
end