import type { DocSearchHit } from '../types/DocSearchHit';

// Configuration types
export interface FieldMapping {
  content?: string | ((record: any) => string);
  url?: string | ((record: any) => string);
  hierarchy?: {
    lvl0?: string | ((record: any) => string);
    lvl1?: string | ((record: any) => string);
    lvl2?: string | ((record: any) => string | null);
    lvl3?: string | ((record: any) => string | null);
    lvl4?: string | ((record: any) => string | null);
    lvl5?: string | ((record: any) => string | null);
    lvl6?: string | ((record: any) => string | null);
  };
  type?: string | ((record: any) => string);
  anchor?: string | ((record: any) => string | null);
  metadata?: Record<string, string | ((record: any) => any)>;
}

export interface RecordMapperConfig {
  fieldMapping?: FieldMapping;
  preserveOriginal?: boolean;
  fallbackValues?: {
    content?: string;
    hierarchy?: {
      lvl0?: string;
      lvl1?: string;
    };
  };
  maxContentLength?: number;
}

// Helper function to extract value from record using field mapping
function extractValue(
  record: any,
  mapping: string | ((record: any) => any) | undefined,
  fallback: any = null
): any {
  if (!mapping) return fallback;
  
  if (typeof mapping === 'function') {
    try {
      return mapping(record);
    } catch (error) {
      console.warn('Error in field mapping function:', error);
      return fallback;
    }
  }
  
  // Handle dot notation (e.g., "metadata.title")
  const value = mapping.split('.').reduce((obj, key) => obj?.[key], record);
  return value !== undefined ? value : fallback;
}

// Helper function to truncate and clean content
function cleanAndTruncateContent(content: string, maxLength: number = 200): string {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Clean up content: remove extra whitespace, newlines, and normalize
  let cleaned = content
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n/g, ' ')  // Replace newlines with spaces
    .trim();
  
  // Truncate if too long
  if (cleaned.length > maxLength) {
    // Try to truncate at a word boundary
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) { // If we can find a space in the last 20%
      cleaned = truncated.substring(0, lastSpace) + '…';
    } else {
      cleaned = truncated + '…';
    }
  }
  
  return cleaned;
}

// Main mapping function
export function mapRecordToDocSearchHit(
  record: any,
  config: RecordMapperConfig = {}
): DocSearchHit {
  const { fieldMapping = {}, preserveOriginal = true, fallbackValues = {}, maxContentLength = 200 } = config;

  // Extract basic fields
  const objectID = record.objectID || record.id || String(Math.random());
  const rawContent = extractValue(
    record, 
    fieldMapping.content, 
    fallbackValues.content || record.content || ''
  );
  const content = cleanAndTruncateContent(rawContent, maxContentLength);
  const url = extractValue(record, fieldMapping.url, record.url || '');
  const type = extractValue(record, fieldMapping.type, 'content');
  const anchor = extractValue(record, fieldMapping.anchor, record.anchor || null);

  // Build hierarchy
  const hierarchy = {
    lvl0: extractValue(
      record, 
      fieldMapping.hierarchy?.lvl0, 
      fallbackValues.hierarchy?.lvl0 || record.title || ''
    ),
    lvl1: extractValue(
      record, 
      fieldMapping.hierarchy?.lvl1, 
      fallbackValues.hierarchy?.lvl1 || ''
    ),
    lvl2: extractValue(record, fieldMapping.hierarchy?.lvl2, null),
    lvl3: extractValue(record, fieldMapping.hierarchy?.lvl3, null),
    lvl4: extractValue(record, fieldMapping.hierarchy?.lvl4, null),
    lvl5: extractValue(record, fieldMapping.hierarchy?.lvl5, null),
    lvl6: extractValue(record, fieldMapping.hierarchy?.lvl6, null),
  };

  // Generate URL without anchor
  const url_without_anchor = url.split('#')[0];

  // Preserve original highlight results if they exist, otherwise create basic ones
  const originalHighlight = record._highlightResult || {};
  const originalSnippet = record._snippetResult || {};

  // Helper function to get highlight data for a field
  const getHighlightForField = (fieldMapping: any, fallbackValue: string) => {
    if (typeof fieldMapping === 'string') {
      // Try to find the highlight in the original record
      return originalHighlight[fieldMapping] || { value: fallbackValue, matchLevel: 'none', matchedWords: [] };
    }
    // For function mappings, we can't preserve highlights easily
    return { value: fallbackValue, matchLevel: 'none', matchedWords: [] };
  };

  const getSnippetForField = (fieldMapping: any, fallbackValue: string) => {
    if (typeof fieldMapping === 'string') {
      // Try to find the snippet in the original record
      return originalSnippet[fieldMapping] || { value: fallbackValue, matchLevel: 'none' };
    }
    // For function mappings, we can't preserve snippets easily
    return { value: fallbackValue, matchLevel: 'none' };
  };

  // Create base DocSearch hit
  const docSearchHit: DocSearchHit = {
    objectID,
    content,
    url,
    url_without_anchor,
    type,
    anchor,
    hierarchy,
    // Preserve original highlighting if available, otherwise create basic highlighting
    _highlightResult: {
      content: getHighlightForField(fieldMapping.content, content),
      hierarchy: {
        lvl0: getHighlightForField(fieldMapping.hierarchy?.lvl0, hierarchy.lvl0),
        lvl1: getHighlightForField(fieldMapping.hierarchy?.lvl1, hierarchy.lvl1),
        lvl2: getHighlightForField(fieldMapping.hierarchy?.lvl2, hierarchy.lvl2 || ''),
        lvl3: getHighlightForField(fieldMapping.hierarchy?.lvl3, hierarchy.lvl3 || ''),
        lvl4: getHighlightForField(fieldMapping.hierarchy?.lvl4, hierarchy.lvl4 || ''),
        lvl5: getHighlightForField(fieldMapping.hierarchy?.lvl5, hierarchy.lvl5 || ''),
        lvl6: getHighlightForField(fieldMapping.hierarchy?.lvl6, hierarchy.lvl6 || ''),
      },
      hierarchy_camel: originalHighlight.hierarchy_camel || [],
    },
    _snippetResult: {
      content: getSnippetForField(fieldMapping.content, content),
      hierarchy: {
        lvl0: getSnippetForField(fieldMapping.hierarchy?.lvl0, hierarchy.lvl0),
        lvl1: getSnippetForField(fieldMapping.hierarchy?.lvl1, hierarchy.lvl1),
        lvl2: getSnippetForField(fieldMapping.hierarchy?.lvl2, hierarchy.lvl2 || ''),
        lvl3: getSnippetForField(fieldMapping.hierarchy?.lvl3, hierarchy.lvl3 || ''),
        lvl4: getSnippetForField(fieldMapping.hierarchy?.lvl4, hierarchy.lvl4 || ''),
        lvl5: getSnippetForField(fieldMapping.hierarchy?.lvl5, hierarchy.lvl5 || ''),
        lvl6: getSnippetForField(fieldMapping.hierarchy?.lvl6, hierarchy.lvl6 || ''),
      },
      hierarchy_camel: originalSnippet.hierarchy_camel || [],
    },
  };

  // Add original record if requested
  if (preserveOriginal) {
    (docSearchHit as any)._original = record;
  }

  // Add custom metadata fields
  if (fieldMapping.metadata) {
    const metadata: Record<string, any> = {};
    for (const [key, mapping] of Object.entries(fieldMapping.metadata)) {
      metadata[key] = extractValue(record, mapping);
    }
    (docSearchHit as any)._metadata = metadata;
  }

  return docSearchHit;
}

// Batch mapping function for multiple records
export function mapRecordsToDocSearchHits(
  records: any[],
  config: RecordMapperConfig = {}
): DocSearchHit[] {
  return records.map(record => mapRecordToDocSearchHit(record, config));
}

// Validation function to check if mapping config is valid
export function validateFieldMapping(mapping: FieldMapping): string[] {
  const errors: string[] = [];

  // Check required mappings
  if (!mapping.content && !mapping.hierarchy?.lvl0) {
    errors.push('Either content or hierarchy.lvl0 mapping is required');
  }

  if (!mapping.url) {
    errors.push('URL mapping is required');
  }

  return errors;
}

// Utility function to generate mapping config from sample record
export function generateMappingFromSample(
  sampleRecord: any,
  options: {
    contentFields?: string[];
    urlFields?: string[];
    hierarchyFields?: string[];
  } = {}
): FieldMapping {
  const {
    contentFields = ['content', 'description', 'body', 'text'],
    urlFields = ['url', 'link', 'permalink', 'href'],
    hierarchyFields = ['category', 'section', 'title', 'name']
  } = options;

  const mapping: FieldMapping = {
    hierarchy: {}
  };

  // Auto-detect content field
  const contentField = contentFields.find(field => sampleRecord[field]);
  if (contentField) {
    mapping.content = contentField;
  }

  // Auto-detect URL field
  const urlField = urlFields.find(field => sampleRecord[field]);
  if (urlField) {
    mapping.url = urlField;
  }

  // Auto-detect hierarchy fields
  const availableHierarchyFields = hierarchyFields.filter(field => sampleRecord[field]);
  availableHierarchyFields.slice(0, 7).forEach((field, index) => {
    const level = `lvl${index}` as keyof NonNullable<FieldMapping['hierarchy']>;
    mapping.hierarchy![level] = field;
  });

  return mapping;
}

// Presets for common use cases
export const MAPPING_PRESETS = {
  ecommerce: {
    content: 'description',
    url: 'product_url',
    hierarchy: {
      lvl0: 'department',
      lvl1: 'category', 
      lvl2: 'brand',
      lvl3: 'title'
    },
    metadata: {
      price: 'price',
      rating: 'rating',
      availability: 'in_stock'
    }
  },
  
  blog: {
    content: 'excerpt',
    url: 'permalink',
    hierarchy: {
      lvl0: 'category',
      lvl1: 'title',
      lvl2: 'author'
    },
    metadata: {
      publishDate: 'published_at',
      tags: 'tags'
    }
  },
  
  documentation: {
    content: 'content',
    url: 'url',
    hierarchy: {
      lvl0: 'section',
      lvl1: 'page',
      lvl2: 'heading'
    }
  },
  
  knowledgeBase: {
    content: 'body',
    url: 'article_url',
    hierarchy: {
      lvl0: 'section',
      lvl1: 'subsection',
      lvl2: 'title'
    },
    metadata: {
      helpfulness: 'helpful_votes',
      lastUpdated: 'updated_at'
    }
  }
} as const;

