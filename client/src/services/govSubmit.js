/**
 * Submit government invoice to the API
 * @param {Object} payload - The invoice data to submit
 * @returns {Promise<{ok: boolean, status: number, data?: any, error?: string}>}
 */
export async function submitGovInvoice(payload) {
  const makeRequest = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:3000/api/gov-invoices", {
        method: "POST",
        headers,
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
          error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
          errors: data.errors || []
        };
      }
    } catch (error) {
      // Network or parsing error
      throw error;
    }
  };

  try {
    // First attempt
    return await makeRequest();
  } catch (error) {
    // Retry once on network failure
    try {
      console.log("First attempt failed, retrying...", error.message);
      return await makeRequest();
    } catch (retryError) {
      return {
        ok: false,
        status: 0,
        error: `Network error after retry: ${retryError.message}`,
      };
    }
  }
}

/**
 * Fetch all government invoices
 * @param {Object} params - Query parameters (page, limit, status, etc.)
 * @returns {Promise<{ok: boolean, status: number, data?: any, error?: string}>}
 */
export async function fetchGovInvoices(params = {}) {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:3000/api/gov-invoices${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        status: response.status,
        data: data.data,
        pagination: data.pagination
      };
    } else {
      return {
        ok: false,
        status: response.status,
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: `Network error: ${error.message}`,
    };
  }
}

/**
 * Fetch a single government invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<{ok: boolean, status: number, data?: any, error?: string}>}
 */
export async function fetchGovInvoice(id) {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:3000/api/gov-invoices/${id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        status: response.status,
        data: data.data
      };
    } else {
      return {
        ok: false,
        status: response.status,
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: `Network error: ${error.message}`,
    };
  }
}

/**
 * Update a government invoice
 * @param {string} id - Invoice ID
 * @param {Object} payload - Updated invoice data
 * @returns {Promise<{ok: boolean, status: number, data?: any, error?: string}>}
 */
export async function updateGovInvoice(id, payload) {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:3000/api/gov-invoices/${id}`, {
      method: "PUT",
      headers,
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
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        errors: data.errors || []
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: `Network error: ${error.message}`,
    };
  }
}

/**
 * Delete a government invoice
 * @param {string} id - Invoice ID
 * @returns {Promise<{ok: boolean, status: number, error?: string}>}
 */
export async function deleteGovInvoice(id) {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:3000/api/gov-invoices/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        ok: true,
        status: response.status,
        message: data.message
      };
    } else {
      return {
        ok: false,
        status: response.status,
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: `Network error: ${error.message}`,
    };
  }
} 