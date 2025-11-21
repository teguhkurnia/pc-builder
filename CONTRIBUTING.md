# Contributing to PC Builder Platform

Thank you for your interest in contributing to the PC Builder Platform! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Guidelines](#coding-guidelines)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Suggesting Features](#suggesting-features)
9. [Code Review](#code-review)
10. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, intimidation, or discrimination
- Trolling, insulting, or derogatory comments
- Publishing others' private information
- Any conduct that could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- [x] Read the [README.md](./README.md)
- [x] Read the [SETUP.md](./SETUP.md) and set up your development environment
- [x] Familiarized yourself with the [ARCHITECTURE.md](./ARCHITECTURE.md)
- [x] Read the [DEVELOPMENT.md](./DEVELOPMENT.md) guide

### Setting Up Your Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/pc-builder.git
cd pc-builder

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/pc-builder.git

# 4. Install dependencies
pnpm install

# 5. Set up database
pnpm prisma:generate
cd packages/db
pnpm prisma migrate dev

# 6. Start development server
cd ../..
pnpm dev
```

---

## Development Process

### Finding Something to Work On

1. **Check Open Issues**: Look for issues labeled `good first issue` or `help wanted`
2. **Read the Roadmap**: Check our roadmap for planned features
3. **Ask Questions**: Not sure what to work on? Ask in discussions!

### Before You Start Coding

1. **Check for Existing Work**: Search issues and PRs to avoid duplicate work
2. **Discuss Major Changes**: Open an issue to discuss significant changes before implementing
3. **Claim an Issue**: Comment on the issue to let others know you're working on it

### Development Workflow

```bash
# 1. Sync your fork with upstream
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... code code code ...

# 4. Run tests and checks
pnpm lint
pnpm check-types
pnpm format

# 5. Commit your changes
git add .
git commit -m "feat: add your feature"

# 6. Push to your fork
git push origin feature/your-feature-name

# 7. Create a Pull Request
# Go to GitHub and create a PR from your branch
```

---

## Coding Guidelines

### TypeScript

- **Use TypeScript**: All new code should be in TypeScript
- **Avoid `any`**: Use proper types; avoid `any` unless absolutely necessary
- **Export Types**: Export types that might be useful to other parts of the codebase

```typescript
// ✅ Good
interface ComponentCardProps {
  component: Component;
  onEdit?: (id: number) => void;
}

export function ComponentCard({ component, onEdit }: ComponentCardProps) {
  // ...
}

// ❌ Bad
export function ComponentCard({ component, onEdit }: any) {
  // ...
}
```

### React

- **Functional Components**: Use functional components with hooks
- **Props Interface**: Always define props with TypeScript interfaces
- **Naming**: Use PascalCase for components, camelCase for functions

```typescript
// ✅ Good
export function ProductList({ products }: ProductListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ❌ Bad
export const ProductList = (props: any) => {
  const [selectedId, setSelectedId] = useState(null);
  
  return <div>{/* ... */}</div>;
}
```

### File Structure

```typescript
// Component file structure:
// 1. Imports (external, internal, types)
// 2. Types/Interfaces
// 3. Component definition
// 4. Helper functions (if any)
// 5. Exports

import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import type { Component } from '@repo/db';

interface ComponentListProps {
  filter?: string;
}

export function ComponentList({ filter }: ComponentListProps) {
  // Component implementation
}

// Helper functions
function filterComponents(components: Component[], filter: string) {
  // Implementation
}
```

### Styling

- **Tailwind CSS**: Use Tailwind classes for styling
- **cn() Utility**: Use the `cn()` utility for conditional classes
- **Component Variants**: Use CVA (class-variance-authority) for complex variants

```typescript
import { cn } from '@repo/ui/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-variant"
)}>
```

### API/tRPC

- **Input Validation**: Always validate inputs with Zod
- **Error Handling**: Provide meaningful error messages
- **Documentation**: Add JSDoc comments for complex endpoints

```typescript
/**
 * Creates a new component in the database
 * @throws {TRPCError} BAD_REQUEST if validation fails
 * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
 */
create: publicProcedure
  .input(z.object({
    name: z.string().min(1).max(255),
    type: z.enum(['CPU', 'GPU', 'RAM']),
    price: z.number().positive(),
    specifications: z.record(z.unknown()),
  }))
  .mutation(async ({ input }) => {
    return await db.component.create({ data: input });
  }),
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `revert`: Reverting previous commits

### Scopes

- `admin`: Admin dashboard
- `builder`: PC builder app
- `server`: Standalone server
- `api`: API layer
- `db`: Database layer
- `ui`: UI components
- `deps`: Dependencies

### Examples

```bash
# Feature
git commit -m "feat(admin): add component filtering by price range"

# Bug fix
git commit -m "fix(api): resolve duplicate component creation issue"

# Documentation
git commit -m "docs: update setup instructions for Windows users"

# Refactoring
git commit -m "refactor(ui): extract button variants to separate file"

# Performance
git commit -m "perf(db): add index on component type column"

# With body
git commit -m "feat(admin): add bulk component import

- Add CSV file upload
- Validate CSV format
- Show import progress
- Display import results"

# Breaking change
git commit -m "feat(api)!: change component schema structure

BREAKING CHANGE: specifications field now uses typed objects instead of JSON"
```

### Commit Best Practices

- **One logical change per commit**: Don't mix unrelated changes
- **Present tense**: Use "add feature" not "added feature"
- **Imperative mood**: Use "change" not "changes" or "changed"
- **Keep it concise**: Subject line should be 50 characters or less
- **Add details in body**: Explain "why" not "what" in the body

---

## Pull Request Process

### Before Submitting a PR

- [ ] Code follows the project's coding guidelines
- [ ] All tests pass (when implemented)
- [ ] No linting errors (`pnpm lint`)
- [ ] Type checking passes (`pnpm check-types`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Commit messages follow conventional commits
- [ ] Documentation is updated (if needed)
- [ ] Database migrations are included (if schema changed)

### PR Title Format

Use the same format as commit messages:

```
feat(admin): add component bulk import feature
fix(api): resolve price calculation rounding issue
docs: improve contributing guidelines
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes:
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated (if applicable)
```

### PR Review Process

1. **Submit PR**: Create PR with clear title and description
2. **Automated Checks**: CI/CD runs linting, type checking, tests
3. **Code Review**: Team members review your code
4. **Address Feedback**: Make requested changes
5. **Approval**: PR is approved by maintainers
6. **Merge**: Maintainer merges your PR

### Handling Review Feedback

- **Be responsive**: Address feedback promptly
- **Be open**: Accept constructive criticism gracefully
- **Ask questions**: Don't understand feedback? Ask!
- **Push updates**: Push new commits to the same branch
- **Mark resolved**: Mark conversations as resolved after addressing

---

## Reporting Bugs

### Before Reporting

1. **Check existing issues**: Search for similar issues first
2. **Try latest version**: Ensure you're using the latest code
3. **Reproduce**: Verify you can reproduce the bug consistently

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., macOS 12.0, Windows 11, Ubuntu 22.04]
- Node.js: [e.g., v24.0.0]
- Browser: [e.g., Chrome 120, Safari 17]
- Package Manager: [e.g., pnpm 9.0.0]

**Additional Context**
Any other relevant information.

**Error Messages**
```
Paste error messages here
```
```

---

## Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Problem it Solves**
What problem does this feature solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
What other solutions have you considered?

**Additional Context**
Mockups, examples, or references.

**Priority**
- [ ] Low
- [ ] Medium
- [ ] High
- [ ] Critical
```

---

## Code Review

### For Reviewers

**What to Look For:**

- **Correctness**: Does the code work as intended?
- **Design**: Is the code well-designed and maintainable?
- **Complexity**: Is the code unnecessarily complex?
- **Tests**: Are there appropriate tests? (when implemented)
- **Naming**: Are variables and functions well-named?
- **Comments**: Are comments clear and necessary?
- **Documentation**: Is documentation updated?
- **Style**: Does it follow project guidelines?

**Review Best Practices:**

- Be kind and constructive
- Explain the "why" behind suggestions
- Distinguish between "must fix" and "nice to have"
- Approve when ready, even if minor suggestions remain
- Use GitHub's suggestion feature for small changes

**Review Comments:**

```markdown
# ✅ Good review comment
This function could be simplified using Array.reduce(). This would improve readability and performance.

Suggested change:
```typescript
const total = items.reduce((sum, item) => sum + item.price, 0);
```

# ❌ Unhelpful review comment
This is bad. Fix it.
```

### For Authors

**Responding to Reviews:**

- Thank reviewers for their time
- Ask questions if feedback is unclear
- Explain your reasoning if you disagree
- Make requested changes promptly
- Re-request review after updates

---

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code review and collaboration

### Getting Help

- **Documentation**: Check our comprehensive docs first
- **Discussions**: Ask questions in GitHub Discussions
- **Issues**: Report bugs or request features
- **Team**: Contact maintainers for urgent issues

### Recognition

We appreciate all contributions! Contributors will be:

- Listed in our contributors page
- Mentioned in release notes
- Recognized in our community

---

## License

By contributing to PC Builder Platform, you agree that your contributions will be licensed under the same license as the project.

---

## Questions?

If you have questions not covered by this guide:

1. Check the [documentation](./README.md)
2. Search [existing issues](https://github.com/owner/pc-builder/issues)
3. Ask in [discussions](https://github.com/owner/pc-builder/discussions)
4. Contact the maintainers

---

**Thank you for contributing to PC Builder Platform!** 🎉

Every contribution, no matter how small, helps make this project better. We look forward to your contributions!

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: PC Builder Team