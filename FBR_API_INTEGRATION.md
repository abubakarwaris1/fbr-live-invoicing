# FBR API Integration Guide

## Overview

This document outlines the integration with Federal Board of Revenue (FBR) APIs for invoice validation and submission.

## API Endpoints

### Sandbox Environment
- **Base URL**: `https://gw.fbr.gov.pk/di_data/v1/di`
- **Validate Endpoint**: `/validateinvoicedata_sb`
- **Post Endpoint**: `/postinvoicedata_sb`

### Production Environment
- **Base URL**: `https://gw.fbr.gov.pk/di_data/v1/di`
- **Validate Endpoint**: `/validateinvoicedata`
- **Post Endpoint**: `/postinvoicedata`

## Authentication

Both APIs require OAuth 2.0 Bearer token authentication:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## API Testing Results

### ✅ What We Discovered

1. **Endpoints are accessible** and responding
2. **POST method only** - GET requests return 405 Method Not Allowed
3. **OAuth authentication required** - 401 Unauthorized without valid token
4. **WSO2 API Manager** protection
5. **CORS enabled** - APIs accept cross-origin requests

### ❌ Current Limitations

- **No access token** - Need OAuth credentials from FBR
- **Unknown request format** - Need API documentation for exact payload structure
- **Unknown response format** - Need to see actual success responses

## Integration Files

### 1. Test Scripts
- `test-fbr-apis.js` - Basic API testing
- `test-fbr-apis-with-auth.js` - Enhanced testing with authentication support

### 2. Service Integration
- `client/src/services/fbrApi.js` - FBR API service for the application

## Usage Examples

### Basic Validation
```javascript
import { validateInvoiceWithFbr } from '@/services/fbrApi';

const result = await validateInvoiceWithFbr(invoiceData, accessToken);
if (result.ok) {
  console.log('Validation successful:', result.data);
} else {
  console.error('Validation failed:', result.error);
}
```

### Complete Workflow
```javascript
import { processInvoiceWithFbr } from '@/services/fbrApi';

const result = await processInvoiceWithFbr(invoiceData, accessToken);
if (result.ok) {
  console.log('Invoice processed successfully');
} else {
  console.error('Workflow failed:', result.error);
}
```

## Next Steps

### 1. Obtain OAuth Credentials
- Contact FBR for API access
- Get OAuth client credentials
- Obtain access token

### 2. Test with Real Credentials
```bash
export FBR_ACCESS_TOKEN="your_actual_token_here"
node test-fbr-apis-with-auth.js
```

### 3. Understand API Format
Once you have access, test with real data to understand:
- Required fields
- Data format expectations
- Response structure
- Error handling

### 4. Update Integration
- Modify `transformInvoiceForFbr()` function based on actual API requirements
- Update error handling based on real responses
- Switch from sandbox to production URLs

### 5. Environment Configuration
Add to your `.env` file:
```env
FBR_ACCESS_TOKEN=your_access_token_here
FBR_CLIENT_ID=your_client_id_here
FBR_CLIENT_SECRET=your_client_secret_here
FBR_ENVIRONMENT=sandbox  # or production
```

## Error Handling

The service handles common error scenarios:

- **401 Unauthorized**: Invalid or missing access token
- **400 Bad Request**: Invalid invoice data format
- **409 Conflict**: Invoice already exists
- **Network Errors**: Connection issues

## Security Considerations

1. **Store tokens securely** - Use environment variables
2. **Token expiration** - Implement token refresh logic
3. **HTTPS only** - All API calls use HTTPS
4. **Input validation** - Validate data before sending to FBR
5. **Error logging** - Log errors for debugging (avoid logging sensitive data)

## Testing Checklist

- [ ] Obtain OAuth credentials from FBR
- [ ] Test validation endpoint with real token
- [ ] Test submission endpoint with real token
- [ ] Understand request/response format
- [ ] Test error scenarios
- [ ] Switch to production URLs
- [ ] Integrate with application workflow

## Support

For FBR API support, contact:
- FBR Technical Support
- API Documentation Team
- Integration Support

---

**Note**: This integration is currently in testing phase. Update this document as you discover more about the actual API requirements and responses. 