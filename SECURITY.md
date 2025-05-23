# Security Policy

## Supported Versions

We actively support the following versions of the Expense Tracker application:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these guidelines:

### 🔒 Private Disclosure

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues privately by:

1. **Email**: Send details to me@esssam.com
2. **GitHub Security**: Use GitHub's [Private Vulnerability Reporting](https://github.com/essambarghsh/my-costs-aio/security/advisories/new) feature

### 📋 What to Include

When reporting a vulnerability, please provide:

- **Description**: Clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and attack scenarios
- **Environment**: Browser, OS, and application version
- **Supporting Material**: Screenshots, logs, or proof-of-concept code (if applicable)

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours of report
- **Status Update**: Within 5 business days
- **Resolution**: Target fix within 30 days (depending on complexity)

### 🛡️ Security Considerations

This application handles financial data, so we particularly care about:

- **Data Storage**: Local JSON file security
- **Input Validation**: XSS and injection prevention
- **Authentication**: Future user authentication features
- **Data Export**: Secure data handling and export

### 🙏 Responsible Disclosure

We kindly ask that you:

- Give us reasonable time to fix the issue before public disclosure
- Don't access or modify other users' data
- Don't perform DoS attacks or spam
- Don't social engineer our contributors or users

### 🎁 Recognition

Security researchers who responsibly disclose vulnerabilities will be:

- Acknowledged in our security advisory (if desired)
- Listed in our contributors section
- Given priority consideration for future collaboration

## Security Best Practices for Users

### 🔐 Data Protection

- **Backup Regularly**: Export your data regularly
- **Secure Environment**: Run the application in a secure environment
- **Updates**: Keep your installation updated to the latest version
- **Access Control**: Limit access to the data directory

### 🖥️ Self-Hosting Security

If self-hosting:

- Use HTTPS in production
- Secure your server and database
- Implement proper file permissions for the `data/` directory
- Regular security updates for your hosting environment

## Security Features

### Current Protections

- Input sanitization and validation
- Type-safe TypeScript implementation
- No external API dependencies for core functionality
- Local data storage (no cloud exposure by default)

### Planned Security Enhancements

- User authentication system
- Data encryption options
- Audit logging
- Session management

## Questions?

If you have questions about this security policy, please reach out to me@esssam.com.

---

**Thank you for helping keep Expense Tracker secure! 🔒**