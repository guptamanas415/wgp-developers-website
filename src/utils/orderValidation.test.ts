/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateOrderReference,
  isValidEmail,
  isValidPhone,
  validateOrderInput,
  OrderInput,
} from './orderValidation';
import { generateOrderEmailHtml, OFFICIAL_BUSINESS_EMAIL } from './emailTemplate';

test('generateOrderReference creates formatted unique ID with date and prefix', () => {
  const ref = generateOrderReference(new Date('2026-11-05T12:00:00Z'));
  assert.match(ref, /^WGP-20261105-[A-Z0-9]{4}$/);
});

test('isValidEmail accepts valid addresses and rejects invalid formats', () => {
  assert.equal(isValidEmail('wgpdevelopers@gmail.com'), true);
  assert.equal(isValidEmail('client.name+tag@company.co.uk'), true);
  assert.equal(isValidEmail(''), false);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('user@'), false);
  assert.equal(isValidEmail('@domain.com'), false);
});

test('isValidPhone accepts standard numbers and rejects short/empty strings', () => {
  assert.equal(isValidPhone('+1234567890'), true);
  assert.equal(isValidPhone('1234567890'), true);
  assert.equal(isValidPhone('+44 20 7946 0991'), true);
  assert.equal(isValidPhone(''), false);
  assert.equal(isValidPhone('123'), false);
  assert.equal(isValidPhone('abcdefg'), false);
});

test('validateOrderInput returns errors when required fields are missing', () => {
  const result = validateOrderInput({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.serviceId);
  assert.ok(result.errors.projectTitle);
  assert.ok(result.errors.projectDescription);
  assert.ok(result.errors.budgetRange);
  assert.ok(result.errors.preferredRequirements);
});

test('validateOrderInput succeeds with sanitized valid payload', () => {
  const validPayload: OrderInput = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555-0199',
    serviceId: 'web-development',
    projectTitle: 'Modern SaaS Web Platform',
    projectDescription: 'We need a full-stack high-performance web platform built with 3D interactions and cloud database.',
    budgetRange: '₹50,000 - ₹1,00,000',
    preferredRequirements: 'React, Node, Three.js, completed within 6 weeks',
    additionalMessage: 'Looking forward to working together!',
  };

  const result = validateOrderInput(validPayload);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
  assert.ok(result.sanitized);
  assert.equal(result.sanitized.fullName, 'Jane Doe');
});

test('generateOrderEmailHtml embeds all mandatory order fields and official business email', () => {
  const mockOrder = {
    orderId: 'WGP-20261105-TEST',
    createdAt: '2026-11-05 10:00:00 UTC',
    status: 'PENDING_REVIEW' as const,
    emailNotificationStatus: 'CONFIG_REQUIRED' as const,
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555-0199',
    serviceId: 'ai-solutions',
    projectTitle: 'Customer AI Assistant',
    projectDescription: 'Intelligent workflow automation engine',
    budgetRange: '₹1,00,000 - ₹2,50,000',
    preferredRequirements: 'Fast delivery, enterprise security',
    additionalMessage: 'Please call me after 2 PM',
  };

  const html = generateOrderEmailHtml(mockOrder, 'AI Solutions');
  assert.ok(html.includes('WGP-20261105-TEST'));
  assert.ok(html.includes(OFFICIAL_BUSINESS_EMAIL));
  assert.ok(html.includes('Jane Doe'));
  assert.ok(html.includes('jane@example.com'));
  assert.ok(html.includes('+1 555-0199'));
  assert.ok(html.includes('AI Solutions'));
  assert.ok(html.includes('Customer AI Assistant'));
  assert.ok(html.includes('Intelligent workflow automation engine'));
  assert.ok(html.includes('₹1,00,000 - ₹2,50,000'));
});
