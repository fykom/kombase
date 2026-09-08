/* biome-ignore-all lint/suspicious/noConsole: CLI script console output */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const category = args[0];
const componentName = args[1];

const VALID_CATEGORIES = ['ui', 'components', 'form', 'hooks', 'lib'];

if (!category || !componentName) {
  console.error('\n❌ Usage: pnpm create:component <category> <component-name>');
  console.error(`   Categories: ${VALID_CATEGORIES.join(', ')}`);
  console.error('   Example: pnpm create:component ui status-badge\n');
  process.exit(1);
}

if (!VALID_CATEGORIES.includes(category)) {
  console.error(
    `\n❌ Invalid category: "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}\n`,
  );
  process.exit(1);
}

// Convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const componentPascal = toPascalCase(componentName);

// 1. Target file paths
const registryFileExt = category === 'hooks' || category === 'lib' ? 'ts' : 'tsx';
const registryFilePath = path.join(
  rootDir,
  'registry',
  category,
  `${componentName}.${registryFileExt}`,
);
const categoryManifestPath = path.join(rootDir, 'registry', category, 'registry.json');
const demoFilePath = path.join(rootDir, 'docs', 'app', 'examples', `${componentName}-demo.tsx`);
const mdxCategoryDir = category === 'ui' ? 'components' : category;
const mdxFilePath = path.join(
  rootDir,
  'docs',
  'app',
  'content',
  mdxCategoryDir,
  `${componentName}.mdx`,
);

console.log(`\n🚀 Generating boilerplate for "${componentName}" in "${category}"...\n`);

// 2. Create Component File
if (fs.existsSync(registryFilePath)) {
  console.warn(`⚠️  Registry file already exists: ${registryFilePath}`);
} else {
  let boilerplate = '';
  if (category === 'hooks') {
    boilerplate = `import { useState } from 'react';\n\nexport function use${componentPascal}() {\n  const [value, setValue] = useState(null);\n  return { value, setValue };\n}\n`;
  } else if (category === 'lib') {
    boilerplate = `export function ${componentPascal.toLowerCase()}Helper() {\n  return true;\n}\n`;
  } else {
    boilerplate = `import * as React from 'react';\nimport { cn } from '@/lib/utils';\n\nexport interface ${componentPascal}Props extends React.HTMLAttributes<HTMLDivElement> {}\n\nexport function ${componentPascal}({ className, ...props }: ${componentPascal}Props) {\n  return (\n    <div className={cn('p-4 border rounded-md', className)} {...props}>\n      <p>${componentPascal} Component</p>\n    </div>\n  );\n}\n`;
  }
  fs.writeFileSync(registryFilePath, boilerplate, 'utf8');
  console.log(
    `✅ Created component source: registry/${category}/${componentName}.${registryFileExt}`,
  );
}

// 3. Update Category Manifest (registry.json)
if (fs.existsSync(categoryManifestPath)) {
  try {
    const rawManifest = fs.readFileSync(categoryManifestPath, 'utf8');
    const manifest = JSON.parse(rawManifest);
    const exists = manifest.some((item) => item.name === componentName);
    if (!exists) {
      manifest.push({
        dependencies: [],
        description: `${componentPascal} component for Kombase.`,
        files: [
          {
            path: `${componentName}.${registryFileExt}`,
            target: `@${category}/${componentName}.${registryFileExt}`,
            type: `registry:${category === 'ui' ? 'ui' : category}`,
          },
        ],
        name: componentName,
        registryDependencies: category !== 'ui' ? ['button'] : [],
        title: componentPascal,
        type: `registry:${category === 'ui' ? 'ui' : category}`,
      });
      fs.writeFileSync(categoryManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      console.log(`✅ Registered in manifest: registry/${category}/registry.json`);
    } else {
      console.warn(`⚠️  Already registered in manifest: registry/${category}/registry.json`);
    }
  } catch (err) {
    console.error(`❌ Failed to update manifest: ${err.message}`);
  }
}

// 4. Create Demo Example File
if (
  !fs.existsSync(demoFilePath) &&
  (category === 'ui' || category === 'components' || category === 'form')
) {
  const demoBoilerplate = `import { ${componentPascal} } from '@/registry/${category}/${componentName}';\n\nexport default function ${componentPascal}Demo() {\n  return (\n    <div className="flex items-center justify-center p-4">\n      <${componentPascal} />\n    </div>\n  );\n}\n`;
  fs.mkdirSync(path.dirname(demoFilePath), { recursive: true });
  fs.writeFileSync(demoFilePath, demoBoilerplate, 'utf8');
  console.log(`✅ Created demo example: docs/app/examples/${componentName}-demo.tsx`);
}

// 5. Create MDX Documentation Page
if (!fs.existsSync(mdxFilePath)) {
  const mdxBoilerplate = `---
title: ${componentPascal}
description: ${componentPascal} component for Kombase design system.
---

## Installation

### CLI

\`\`\`bash
npx shadcn@latest add @kombase/${componentName}
\`\`\`

## Examples

### Basic Usage

<ComponentTabs name="${componentName}-demo" />

## Usage

\`\`\`tsx
import { ${componentPascal} } from "@/${mdxCategoryDir}/${componentName}";

export function Example() {
  return <${componentPascal} />;
}
\`\`\`
`;
  fs.mkdirSync(path.dirname(mdxFilePath), { recursive: true });
  fs.writeFileSync(mdxFilePath, mdxBoilerplate, 'utf8');
  console.log(
    `✅ Created documentation page: docs/app/content/${mdxCategoryDir}/${componentName}.mdx`,
  );
}

console.log('\n🎉 Component scaffolding complete! Next steps:');
console.log('   1. Run `pnpm build:registry` to compile the Shadcn CLI endpoint.');
console.log('   2. Run `pnpm dev:docs` to preview your component in the documentation site.\n');
