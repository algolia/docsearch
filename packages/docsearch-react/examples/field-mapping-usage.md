# Field Mapping Usage Examples

This document shows how to use DocSearch's field mapping feature to work with custom record schemas.

## Basic E-commerce Example

### Your Index Records
```json
{
  "objectID": "product-123",
  "title": "MacBook Pro M3",
  "description": "Latest MacBook with M3 chip and enhanced performance",
  "category": "Laptops",
  "brand": "Apple", 
  "price": 1999,
  "permalink": "/products/macbook-pro-m3",
  "tags": ["premium", "professional"]
}
```

### DocSearch Configuration
```js
import { docsearch } from '@docsearch/js';

docsearch({
  appId: 'YOUR_APP_ID',
  indexName: 'products',
  apiKey: 'YOUR_API_KEY',
  container: '#docsearch',
  
  // Field mapping configuration
  fieldMapping: {
    content: 'description',           // Use 'description' as main content
    url: 'permalink',                 // Use 'permalink' as URL
    hierarchy: {
      lvl0: 'category',              // Top level = category
      lvl1: 'title',                 // Second level = product title
      lvl2: 'brand'                  // Third level = brand
    },
    metadata: {
      price: 'price',
      tags: 'tags'
    }
  },
  
  // Optional: Configure record transformation
  recordMapperConfig: {
    maxContentLength: 150,           // Truncate content to 150 characters
    preserveOriginal: true,          // Keep original record in _original field
    fallbackValues: {
      content: 'No description available',
      hierarchy: {
        lvl0: 'Uncategorized'
      }
    }
  }
});
```

### Result
DocSearch will automatically transform your records to:
```json
{
  "objectID": "product-123",
  "content": "Latest MacBook with M3 chip and enhanced performance",
  "url": "/products/macbook-pro-m3",
  "hierarchy": {
    "lvl0": "Laptops",
    "lvl1": "MacBook Pro M3", 
    "lvl2": "Apple",
    "lvl3": null,
    "lvl4": null,
    "lvl5": null,
    "lvl6": null
  },
  "_original": { /* your original record */ },
  "_metadata": {
    "price": 1999,
    "tags": ["premium", "professional"]
  }
}
```

## Advanced: Function Mappings

### Your Records
```json
{
  "objectID": "article-456",
  "headline": "Getting Started with React",
  "body": "Learn the basics of React development...",
  "author": {
    "name": "Jane Doe",
    "title": "Senior Developer"
  },
  "category": "Tutorials",
  "slug": "getting-started-react",
  "publishedAt": "2024-01-15"
}
```

### Configuration with Functions
```js
docsearch({
  // ... basic config
  
  fieldMapping: {
    content: 'body',
    url: (record) => `/blog/${record.slug}`,
    hierarchy: {
      lvl0: 'category',
      lvl1: 'headline',
      lvl2: (record) => `By ${record.author.name}`
    },
    metadata: {
      author: (record) => record.author.name,
      authorTitle: (record) => record.author.title,
      publishDate: 'publishedAt'
    }
  }
});
```

## Presets for Common Use Cases

### Using Built-in Presets
```js
import { MAPPING_PRESETS } from '@docsearch/react';

docsearch({
  // ... basic config
  fieldMapping: MAPPING_PRESETS.ecommerce
});

// Available presets:
// - MAPPING_PRESETS.ecommerce
// - MAPPING_PRESETS.blog  
// - MAPPING_PRESETS.documentation
// - MAPPING_PRESETS.knowledgeBase
```

### Custom Hit Rendering with Metadata
```js
docsearch({
  // ... config with fieldMapping
  
  hitComponent: ({ hit, children }) => (
    <div>
      {children}
      {hit._metadata && (
        <div className="custom-metadata">
          <span className="price">${hit._metadata.price}</span>
          <span className="rating">★ {hit._metadata.rating}</span>
        </div>
      )}
    </div>
  )
});
```

## Auto-Detection Helper

### Generate Mapping from Sample
```js
import { generateMappingFromSample } from '@docsearch/react';

const sampleRecord = {
  title: "Sample Product",
  description: "Product description",
  category: "Electronics", 
  permalink: "/products/sample"
};

const autoMapping = generateMappingFromSample(sampleRecord);

docsearch({
  // ... basic config
  fieldMapping: autoMapping
});
```

## Migration Strategy

### Phase 1: Start with Basic Mapping
```js
// Simple field mapping to get started
fieldMapping: {
  content: 'description',
  url: 'permalink',
  hierarchy: {
    lvl0: 'category',
    lvl1: 'title'
  }
}
```

### Phase 2: Add Custom Rendering
```js
// Add metadata and custom hit components
fieldMapping: {
  // ... existing mapping
  metadata: {
    price: 'price',
    availability: 'in_stock'
  }
},
hitComponent: CustomHitComponent
```

### Phase 3: Optimize for Your Use Case
```js
// Fine-tune with functions and advanced mappings
fieldMapping: {
  content: (record) => `${record.description} ${record.features.join(' ')}`,
  url: (record) => `/products/${record.category}/${record.slug}`,
  hierarchy: {
    lvl0: 'department',
    lvl1: 'category',
    lvl2: (record) => `${record.brand} ${record.title}`,
    lvl3: (record) => record.variants?.length > 1 ? 'Multiple Options' : null
  }
}
```

## Validation and Debugging

### Validate Your Mapping
```js
import { validateFieldMapping } from '@docsearch/react';

const errors = validateFieldMapping(yourMapping);
if (errors.length > 0) {
  console.error('Mapping validation errors:', errors);
}
```

### Common Issues

1. **Missing URL mapping**
   ```js
   // ❌ Wrong - no URL mapping
   fieldMapping: {
     content: 'description'
   }
   
   // ✅ Correct - include URL mapping
   fieldMapping: {
     content: 'description',
     url: 'permalink'
   }
   ```

2. **Nested field access**
   ```js
   // ✅ Use dot notation for nested fields
   fieldMapping: {
     content: 'content.body',
     url: 'metadata.permalink'
   }
   ```

3. **Fallback values**
   ```js
   docsearch({
     // ... config
     fieldMapping: yourMapping,
     recordMapperConfig: {
       fallbackValues: {
         content: 'No description available',
         hierarchy: {
           lvl0: 'Uncategorized'
         }
       }
     }
   });
   ```

## Performance Considerations

- Field mapping happens at search time, not index time
- Function mappings are called for each search result
- Consider caching computed values in your index if performance is critical
- The original record is preserved by default (set `preserveOriginal: false` to save memory) 