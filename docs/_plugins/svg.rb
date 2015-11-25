module Jekyll

  class SvgTag < Liquid::Tag
    def initialize(tag_name, svg, tokens)
      super
      @svg = svg.strip
    end

    def render(context)
      # make sure the SVG is on a single line to be HAML compliant
      File.read(@svg).strip.gsub("\n", ' ')
    end
  end
end

Liquid::Template.register_tag('svg', Jekyll::SvgTag)
