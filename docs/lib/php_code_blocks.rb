require 'middleman-syntax/formatters'

module Middleman
  module Syntax
    module Highlighter
      mattr_accessor :options

      # A helper module for highlighting code
      def self.highlight(code, language=nil, opts={})
        tabbed = false

        if language and language[-1] == '*'
          language = language.gsub('*', '')
          tabbed = true
        end

        if language == 'php'
          code = "<?php\n#{code}"
          code = code.gsub /<\?php\n<\?php\n/, "<?php\n"
        end
        lexer = Rouge::Lexer.find_fancy(language, code) || Rouge::Lexers::PlainText

        highlighter_options = options.to_h.merge(opts)
        highlighter_options[:css_class] = [ highlighter_options[:css_class], lexer.tag ].join(' ')
        lexer_options = highlighter_options.delete(:lexer_options)

        formatter = Middleman::Syntax::Formatters::HTML.new(highlighter_options)

        s = ''
        if language and not tabbed
          s << '<div class="snippet-wrapper">'
          s << '<p class="copy-link circle-link text-sm text-demi text-center pos-abt z-1">'
          s << '<a href="#" class="btn btn-danger no-padding text-center" target="_blank" rel="noopener">'
          s << '<i class="icon-copy"></i>'
          s << '<span class="tooltip nowrap color-white text-sm text-demi pos-abt">'
          s << '<span class="tooltip-bg pos-abt fill-bunting"></span>'
          s << 'Copy'
          s << '</span>'
          s << '</a>'
          s << '</p>'
          s << '<div class="snippet-header">'
          s << '<div class="snippet-header-circle"></div>'
          s << '<ul class="nav nav-tabs">'
          s << '<li class="active"><a href="#snippet_' + language + '" data-toggle="tab">' + language + '</a></li>'
          s << '</ul>'
          s << '</div>'
          s << '<div id="snippet_' + language + '" class="tab-pane snippet active" data-language="' + language + '">'
        end
          s << formatter.format(lexer.lex(code, lexer_options))
        if language and not tabbed
          s << '</div>'
          s << '</div>'
        end
        s
      end
    end
  end
end

