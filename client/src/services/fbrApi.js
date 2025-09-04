// FBR API Service for integrating with Federal Board of Revenue
// Sandbox endpoints - switch to production URLs later

const FBR_CONFIG = {
  // Sandbox URLs
  BASE_URL: 'https://gw.fbr.gov.pk/di_data/v1/di',
  VALIDATE_ENDPOINT: 'https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb',
  POST_ENDPOINT: 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb',
  
  // Production URLs (uncomment when ready)
  // BASE_URL: 'https://gw.fbr.gov.pk/di_data/v1/di',
  // VALIDATE_ENDPOINT: 'https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata',
  // POST_ENDPOINT: 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata',
};

/**
 * Make authenticated request to FBR API
 * @param {string} url - API endpoint URL
 * @param {Object} data - Request payload
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Object>} API response
 */
async function makeFbrRequest(url, data, accessToken = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'FBR-Live-Invoicing/1.0'
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
      status: 0,
      data: null
    };
  }
}

/**
 * Validate invoice data with FBR
 * @param {Object} invoiceData - Invoice data to validate
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Object>} Validation result
 */
export async function validateInvoiceWithFbr(invoiceData, accessToken = null) {
  console.log('🔍 Validating invoice with FBR...', invoiceData);
  
  try {
    const result = await makeFbrRequest(
      FBR_CONFIG.VALIDATE_ENDPOINT, 
      invoiceData, 
      accessToken
    );

    if (result.ok) {
      console.log('✅ FBR validation successful:', result.data);
      return {
        ok: true,
        data: result.data,
        message: 'Invoice validated successfully with FBR'
      };
    } else {
      console.error('❌ FBR validation failed:', result);
      
      // Handle specific error cases
      if (result.status === 401) {
        return {
          ok: false,
          error: 'Authentication failed. Please check your access token.',
          details: result.data
        };
      } else if (result.status === 400) {
        return {
          ok: false,
          error: 'Invalid invoice data. Please check the format.',
          details: result.data
        };
      } else {
        return {
          ok: false,
          error: `FBR validation failed: ${result.statusText}`,
          details: result.data
        };
      }
    }
  } catch (error) {
    console.error('❌ Error validating with FBR:', error);
    return {
      ok: false,
      error: 'Network error while validating with FBR',
      details: error.message
    };
  }
}

/**
 * Submit invoice data to FBR
 * @param {Object} invoiceData - Invoice data to submit
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Object>} Submission result
 */
export async function submitInvoiceToFbr(invoiceData, accessToken = null) {
  console.log('📤 Submitting invoice to FBR...', invoiceData);
  
  try {
    const result = await makeFbrRequest(
      FBR_CONFIG.POST_ENDPOINT, 
      invoiceData, 
      accessToken
    );

    if (result.ok) {
      console.log('✅ FBR submission successful:', result.data);
      return {
        ok: true,
        data: result.data,
        message: 'Invoice submitted successfully to FBR'
      };
    } else {
      console.error('❌ FBR submission failed:', result);
      
      // Handle specific error cases
      if (result.status === 401) {
        return {
          ok: false,
          error: 'Authentication failed. Please check your access token.',
          details: result.data
        };
      } else if (result.status === 400) {
        return {
          ok: false,
          error: 'Invalid invoice data. Please check the format.',
          details: result.data
        };
      } else if (result.status === 409) {
        return {
          ok: false,
          error: 'Invoice already exists or conflicts with existing data.',
          details: result.data
        };
      } else {
        return {
          ok: false,
          error: `FBR submission failed: ${result.statusText}`,
          details: result.data
        };
      }
    }
  } catch (error) {
    console.error('❌ Error submitting to FBR:', error);
    return {
      ok: false,
      error: 'Network error while submitting to FBR',
      details: error.message
    };
  }
}

/**
 * Complete FBR workflow: Validate then Submit
 * @param {Object} invoiceData - Invoice data
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Object>} Workflow result
 */
export async function processInvoiceWithFbr(invoiceData, accessToken = null) {
  console.log('🔄 Starting FBR workflow...');
  
  try {
    // Step 1: Validate invoice
    const validationResult = await validateInvoiceWithFbr(invoiceData, accessToken);
    
    if (!validationResult.ok) {
      return {
        ok: false,
        step: 'validation',
        error: validationResult.error,
        details: validationResult.details
      };
    }

    // Step 2: Submit invoice
    const submissionResult = await submitInvoiceToFbr(invoiceData, accessToken);
    
    if (!submissionResult.ok) {
      return {
        ok: false,
        step: 'submission',
        error: submissionResult.error,
        details: submissionResult.details
      };
    }

    return {
      ok: true,
      step: 'completed',
      validation: validationResult.data,
      submission: submissionResult.data,
      message: 'Invoice processed successfully with FBR'
    };
    
  } catch (error) {
    console.error('❌ FBR workflow failed:', error);
    return {
      ok: false,
      step: 'workflow',
      error: 'FBR workflow failed',
      details: error.message
    };
  }
}

/**
 * Transform our invoice format to FBR format
 * @param {Object} ourInvoice - Our invoice format
 * @returns {Object} FBR-compatible invoice format
 */
export function transformInvoiceForFbr(ourInvoice) {
  // This is a placeholder transformation
  // You'll need to adjust this based on FBR's actual API requirements
  
  return {
    invoiceType: ourInvoice.invoiceType,
    invoiceDate: ourInvoice.invoiceDate,
    sellerBusinessName: ourInvoice.sellerBusinessName,
    sellerNTNCNIC: ourInvoice.sellerNTNCNIC,
    buyerBusinessName: ourInvoice.buyerBusinessName,
    buyerNTNCNIC: ourInvoice.buyerNTNCNIC,
    totalAmount: ourInvoice.totalAmount,
    items: ourInvoice.items?.map(item => ({
      itemName: item.itemName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      uom: item.uom
    })) || []
  };
}

/**
 * Get FBR configuration
 * @returns {Object} FBR configuration
 */
export function getFbrConfig() {
  return {
    ...FBR_CONFIG,
    isSandbox: FBR_CONFIG.VALIDATE_ENDPOINT.includes('_sb')
  };
}

export default {
  validateInvoiceWithFbr,
  submitInvoiceToFbr,
  processInvoiceWithFbr,
  transformInvoiceForFbr,
  getFbrConfig
}; 