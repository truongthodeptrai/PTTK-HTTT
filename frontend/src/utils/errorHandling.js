// API Error Handler
export class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Handle API Errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    throw new APIError(
      data?.message || 'Có lỗi xảy ra từ máy chủ',
      status,
      data
    );
  } else if (error.request) {
    // Request made but no response received
    throw new APIError('Không thể kết nối đến máy chủ', 0);
  } else {
    // Error in request setup
    throw new APIError(error.message || 'Có lỗi xảy ra');
  }
};

// Retry logic for API calls
export const retryAPICall = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

// Validation helpers
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label} là bắt buộc`;
    } else if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label} phải có ít nhất ${rule.minLength} ký tự`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label} không được vượt quá ${rule.maxLength} ký tự`;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = `${rule.label} không hợp lệ`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
