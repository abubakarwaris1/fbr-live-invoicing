/**
 * Submit government invoice to the API
 * @param {Object} payload - The invoice data to submit
 * @returns {Promise<{ok: boolean, status: number, data?: any, error?: string}>}
 */

import { API_ENDPOINTS, getAuthHeaders } from '../config/api.js';

export async function submitGovInvoice(payload) {
  const makeRequest = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GOV_INVOICES.BASE, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          ok: true,
          status: response.status,
          data: data.data,
          message: data.message
        };
      } else {
        return {
          ok: false,
          status: response.status,
          error: data.message || 'Failed to submit invoice'
        };
      }
    } catch (error) {
      return {
        ok: false,
        status: 0,
        error: `Network error: ${error.message}`
      };
    }
  };

  // Retry logic
  for (let attempt = 1; attempt <= 3; attempt++) {
    const result = await makeRequest();
    if (result.ok) {
      return result;
    }
    
    if (attempt < 3) {
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return await makeRequest(); // Final attempt
}

/**
 * Get all government invoices with pagination and filtering
 * @param {Object} filters - Filter options
 * @returns {Promise<{ok: boolean, data?: any, pagination?: any, error?: string}>}
 */
export async function getGovInvoices(filters = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const url = `${API_ENDPOINTS.GOV_INVOICES.BASE}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        data: data.data,
        pagination: data.pagination
      };
    } else {
      return {
        ok: false,
        error: data.message || 'Failed to fetch invoices'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Get a specific government invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function getGovInvoiceById(id) {
  try {
    const response = await fetch(API_ENDPOINTS.GOV_INVOICES.BY_ID(id), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        data: data.data
      };
    } else {
      return {
        ok: false,
        error: data.message || 'Failed to fetch invoice'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Update a government invoice
 * @param {string} id - Invoice ID
 * @param {Object} payload - Updated invoice data
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function updateGovInvoice(id, payload) {
  try {
    const response = await fetch(API_ENDPOINTS.GOV_INVOICES.BY_ID(id), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        data: data.data,
        message: data.message
      };
    } else {
      return {
        ok: false,
        error: data.message || 'Failed to update invoice'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Delete a government invoice
 * @param {string} id - Invoice ID
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function deleteGovInvoice(id) {
  try {
    const response = await fetch(API_ENDPOINTS.GOV_INVOICES.BY_ID(id), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        message: data.message
      };
    } else {
      return {
        ok: false,
        error: data.message || 'Failed to delete invoice'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Network error: ${error.message}`
    };
  }
}
