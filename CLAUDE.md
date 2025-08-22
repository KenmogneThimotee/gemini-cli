# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Essential Commands
- `npm run preflight` - Run full validation suite (build, test, typecheck, lint) - REQUIRED before submitting changes
- `npm run build` - Build all packages
- `npm run start` - Start the Gemini CLI
- `npm run test` - Run all tests across workspaces
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript type checking

### Testing Commands
- `npm run test:ci` - Run tests in CI mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:integration:all` - Run all integration tests including sandbox variants

### Single Test Execution
Tests use Vitest framework. To run individual tests:
- `npx vitest path/to/test.test.ts` - Run specific test file
- `npx vitest --ui` - Run tests with UI interface

## Architecture Overview

### Package Structure
The project uses a monorepo structure with these key packages:

- **`packages/cli/`** - Frontend user interface (Terminal UI using Ink)
  - User input processing and command handling
  - React-based terminal interface components
  - Theme management and UI customization
  - Slash commands (e.g., `/help`, `/auth`, `/settings`)

- **`packages/core/`** - Backend engine and API management
  - Gemini API client and request orchestration
  - Tool registration and execution logic
  - Conversation state management
  - Authentication handling (OAuth, API keys, Vertex AI)

- **`packages/vscode-ide-companion/`** - VS Code extension for IDE integration

### Data Flow
1. User input via CLI → `packages/cli`
2. Request processing → `packages/core`  
3. Gemini API interaction with tool execution
4. Response formatting → back to CLI for display

### Tool System
Tools are located in `packages/core/src/tools/` and extend Gemini's capabilities:
- File operations (read, write, edit, glob)
- Shell command execution
- Web fetching and search
- Memory management
- MCP (Model Context Protocol) integration

## Code Style and Patterns

### TypeScript Preferences
- Use plain objects with TypeScript interfaces instead of classes
- Prefer `unknown` over `any` for type safety
- Use type narrowing with `switch` statements and the `checkExhaustive` helper
- Leverage ES module import/export for encapsulation

### React Patterns (CLI UI uses Ink)
- Functional components with hooks only
- No class components or legacy lifecycle methods
- Keep components pure and side-effect-free during rendering
- Use `useEffect` only for synchronization with external state
- Avoid `setState` within `useEffect` for performance

### Testing with Vitest
- Test files co-located with source files (`*.test.ts`, `*.test.tsx`)
- Use `vi.mock()` for ES module mocking
- Place critical dependency mocks (os, fs) at top of test files
- Use `beforeEach` with `vi.resetAllMocks()` and `afterEach` with `vi.restoreAllMocks()`
- Test React components with `render()` from `ink-testing-library`

### Authentication Options
The system supports multiple authentication methods:
- OAuth with Google Account (recommended for individuals)
- Gemini API Key (for specific model control)
- Vertex AI (for enterprise teams)

## Memory and Context Management

### GEMINI.md Files
Projects can include `GEMINI.md` files for context-specific guidance. The existing `GEMINI.md` provides:
- Build command requirements
- Testing framework conventions
- TypeScript and React best practices
- Code style guidelines

### Context Discovery
The system automatically discovers and includes relevant context files when analyzing codebases.

## Development Workflow

1. **Before making changes**: Understand existing patterns by examining similar components
2. **Testing**: Write tests following existing Vitest patterns
3. **Validation**: Always run `npm run preflight` before submitting
4. **Dependencies**: Check existing usage before adding new libraries
5. **Security**: Never expose or log secrets/API keys

## Configuration and Extensions

### Settings Location
- Global settings: `~/.gemini/settings.json`
- Project-specific: `.gemini/` directory

### MCP Server Integration
Configure MCP servers in settings to extend functionality with custom tools and integrations.

### IDE Integration
VS Code companion extension provides seamless integration with the Gemini CLI for in-editor assistance.