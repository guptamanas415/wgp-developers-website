/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OrderInput {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  projectTitle: string;
  projectDescription: string;
  budgetRange: string;
  preferredRequirements: string;
  additionalMessage?: string;
}

export interface OrderRecord extends OrderInput {
  orderId: string;
  createdAt: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'IN_PROGRESS';
  emailNotificationStatus: 'SENT' | 'FAILED' | 'CONFIG_REQUIRED';
  emailNotificationDetails?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized?: OrderInput;
}

/**
 * Generates an official, human-readable unique order reference ID
 * Example: WGP-20261105-8F4A
 */
export function generateOrderReference(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WGP-${year}${month}${day}-${randomSuffix}`;
}

/**
 * Validates email with standard RFC compliance
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone numbers (international/domestic digits, plus symbol, min 7 digits)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return /^\+?[0-9]{7,16}$/.test(cleaned);
}

/**
 * Validates complete customer order submission
 */
export function validateOrderInput(input: Partial<OrderInput>): ValidationResult {
  const errors: Record<string, string> = {};

  const fullName = (input.fullName || '').trim();
  const email = (input.email || '').trim();
  const phone = (input.phone || '').trim();
  const serviceId = (input.serviceId || '').trim();
  const projectTitle = (input.projectTitle || '').trim();
  const projectDescription = (input.projectDescription || '').trim();
  const budgetRange = (input.budgetRange || '').trim();
  const preferredRequirements = (input.preferredRequirements || '').trim();
  const additionalMessage = (input.additionalMessage || '').trim();

  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters.';
  }

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Please provide a valid phone number (7-16 digits).';
  }

  if (!serviceId) {
    errors.serviceId = 'Please select a service for your order.';
  }

  if (!projectTitle || projectTitle.length < 3) {
    errors.projectTitle = 'Project title must be at least 3 characters.';
  } else if (projectTitle.length > 150) {
    errors.projectTitle = 'Project title must not exceed 150 characters.';
  }

  if (!projectDescription || projectDescription.length < 15) {
    errors.projectDescription = 'Project description must be at least 15 characters to explain your requirements.';
  } else if (projectDescription.length > 4000) {
    errors.projectDescription = 'Project description must not exceed 4000 characters.';
  }

  if (!budgetRange) {
    errors.budgetRange = 'Please select an estimated budget range.';
  }

  if (!preferredRequirements || preferredRequirements.length < 5) {
    errors.preferredRequirements = 'Please specify your key requirements (e.g. deadline, platforms, tech preferences).';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: isValid
      ? {
          fullName,
          email,
          phone,
          serviceId,
          projectTitle,
          projectDescription,
          budgetRange,
          preferredRequirements,
          additionalMessage,
        }
      : undefined,
  };
}
