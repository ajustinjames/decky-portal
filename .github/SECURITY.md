# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Decky Portal, please report it responsibly.

### How to Report

**DO NOT** open a public issue for security vulnerabilities.

Instead, please report security issues via one of these methods:

1. **GitHub Security Advisories** (preferred):
   - Go to the [Security tab](https://github.com/ajustinjames/decky-portal/security)
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email**:
   - Send details to the repository maintainer
   - Include "SECURITY" in the subject line
   - Provide as much detail as possible

### What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (critical issues prioritized)

### Security Considerations

When contributing code, please be aware of:

- **Command Injection**: Sanitize any user input used in shell commands
- **XSS Vulnerabilities**: Properly escape user-provided URLs and content
- **Dependency Security**: Keep dependencies updated
- **Access Control**: Respect Steam Deck security boundaries
- **Data Privacy**: Don't log or transmit sensitive user data

### Scope

This security policy applies to:

- ✅ The Decky Portal plugin code
- ✅ Build and CI/CD processes
- ✅ Dependencies and supply chain
- ❌ Steam Deck OS itself (report to Valve)
- ❌ Decky Loader framework (report to Decky team)
- ❌ Third-party websites viewed in the browser

Thank you for helping keep Decky Portal secure!
