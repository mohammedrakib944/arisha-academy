/**
 * Normalizes phone number by removing spaces, dashes, and handling country codes
 * Converts +880 to 880, removes leading +, and keeps only digits
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Handle country codes - if starts with +880, convert to 880
  if (cleaned.startsWith("+880")) {
    cleaned = cleaned.replace("+880", "880");
  } else if (cleaned.startsWith("880")) {
    // Already has 880 prefix
    cleaned = cleaned;
  } else if (cleaned.startsWith("+")) {
    // Remove + if present
    cleaned = cleaned.substring(1);
  }

  // Remove any remaining + signs
  cleaned = cleaned.replace(/\+/g, "");

  return cleaned;
}

/**
 * Validates if phone number is valid
 * Accepts formats: 880XXXXXXXXX, 01XXXXXXXXX, or international format
 */
export function validatePhoneNumber(phone: string): {
  isValid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = normalizePhoneNumber(phone);

  // Check if it's empty
  if (!normalized || normalized.length === 0) {
    return {
      isValid: false,
      normalized,
      error: "Phone number is required",
    };
  }

  // Check if it contains only digits
  if (!/^\d+$/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: "Phone number must contain only digits",
    };
  }

  // Check length - should be between 10 and 15 digits
  if (normalized.length < 10) {
    return {
      isValid: false,
      normalized,
      error: "Phone number must be at least 10 digits",
    };
  }

  if (normalized.length > 15) {
    return {
      isValid: false,
      normalized,
      error: "Phone number cannot exceed 15 digits",
    };
  }

  // For Bangladesh numbers (880 prefix), should be 13 digits total
  if (normalized.startsWith("880")) {
    if (normalized.length !== 13) {
      return {
        isValid: false,
        normalized,
        error: "Bangladesh phone number must be 13 digits (880 + 10 digits)",
      };
    }
  }

  return {
    isValid: true,
    normalized,
  };
}
