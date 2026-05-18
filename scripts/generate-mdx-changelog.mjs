import fs from 'node:fs';

const PACKAGE_CHANGELOG = './packages/CHANGELOG.md';
const OUTPUT_FILE = './docs/app/content/changelog.mdx';

if (!fs.existsSync(PACKAGE_CHANGELOG)) {
  console.error('CHANGELOG.md not found at', PACKAGE_CHANGELOG);
  process.exit(1);
}

const content = fs.readFileSync(PACKAGE_CHANGELOG, 'utf-8');

// Regex to find the latest version block from Changesets
const versionRegex = /## ([\d.]+)([\s\S]*?)(?=## [\d.]|$)/;
const match = versionRegex.exec(content);

if (match) {
  const version = match[1];
  const body = match[2].trim();
  const date = new Date().toISOString().split('T')[0];

  const newEntry = `\n## [v${version}] - ${date}\n\n${body}\n\n---\n`;

  if (!fs.existsSync(OUTPUT_FILE)) {
    console.error('Output file not found:', OUTPUT_FILE);
    process.exit(1);
  }

  let mdxContent = fs.readFileSync(OUTPUT_FILE, 'utf-8');
  
  // Prevent duplicate insertion
  if (mdxContent.includes(`## [v${version}]`)) {
    console.info(`Version v${version} already exists in changelog.mdx. Skipping.`);
    process.exit(0);
  }

  // Insert right after the frontmatter
  // Frontmatter ends with the second '---'
  const frontmatterEnd = mdxContent.indexOf('---', 4) + 3;
  
  const before = mdxContent.slice(0, frontmatterEnd);
  const after = mdxContent.slice(frontmatterEnd);

  // Update the date in frontmatter to today
  const updatedBefore = before.replace(/date: .*/, `date: ${date}`);

  const updatedContent = `${updatedBefore}\n${newEntry}${after}`;
  fs.writeFileSync(OUTPUT_FILE, updatedContent);

  console.info(`Successfully added v${version} to ${OUTPUT_FILE}`);
} else {
  console.info('No version entries found in CHANGELOG.md');
}
