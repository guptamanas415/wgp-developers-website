/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrderRecord } from './orderValidation';

export const OFFICIAL_BUSINESS_EMAIL = 'wgpdevelopers@gmail.com';
export const COMPANY_NAME = "WGP Developer's";
export const COMPANY_TAGLINE = 'Build • Innovate • Grow';

export function generateOrderEmailHtml(order: OrderRecord, serviceName: string): string {
  const safeText = (str?: string) => (str ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'None provided');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Customer Order — ${COMPANY_NAME}</title>
  <style>
    body {
      background-color: #05070B;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 620px;
      margin: 0 auto;
      background: #0B0F19;
      border: 1px solid #1E293B;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #05070B 0%, #0D162B 100%);
      padding: 32px 28px;
      border-bottom: 2px solid #0066FF;
      text-align: center;
    }
    .logo-badge {
      display: inline-block;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .accent {
      color: #00E5FF;
    }
    .tagline {
      font-size: 13px;
      color: #94A3B8;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
    }
    .content {
      padding: 32px 28px;
    }
    .order-banner {
      background: rgba(0, 102, 255, 0.12);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .order-ref {
      font-size: 18px;
      font-weight: 700;
      color: #00E5FF;
      font-family: monospace;
      letter-spacing: 1px;
      margin: 0 0 4px 0;
    }
    .order-date {
      font-size: 12px;
      color: #94A3B8;
      margin: 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #38BDF8;
      margin: 24px 0 12px 0;
      border-bottom: 1px solid #1E293B;
      padding-bottom: 6px;
    }
    .field-row {
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .field-label {
      font-size: 12px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .field-value {
      font-size: 15px;
      color: #F8FAFC;
      font-weight: 500;
    }
    .field-box {
      background: #070A12;
      border: 1px solid #1E293B;
      border-radius: 6px;
      padding: 12px 14px;
      font-size: 14px;
      line-height: 1.6;
      color: #E2E8F0;
      white-space: pre-wrap;
    }
    .footer {
      background: #05070B;
      padding: 20px 28px;
      border-top: 1px solid #1E293B;
      font-size: 12px;
      color: #64748B;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">WGP <span class="accent">DEVELOPER'S</span></div>
      <p class="tagline">${COMPANY_TAGLINE}</p>
    </div>
    <div class="content">
      <div class="order-banner">
        <p class="order-ref">Order Ref: ${order.orderId}</p>
        <p class="order-date">Submitted on: ${order.createdAt}</p>
      </div>

      <div class="section-title">Customer Information</div>
      <div class="field-row">
        <div class="field-label">Customer Full Name</div>
        <div class="field-value">${safeText(order.fullName)}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Customer Email Address</div>
        <div class="field-value"><a href="mailto:${safeText(order.email)}" style="color: #00E5FF; text-decoration: none;">${safeText(order.email)}</a></div>
      </div>
      <div class="field-row">
        <div class="field-label">Customer Phone Number</div>
        <div class="field-value">${safeText(order.phone)}</div>
      </div>

      <div class="section-title">Project & Service Details</div>
      <div class="field-row">
        <div class="field-label">Selected Service</div>
        <div class="field-value" style="color: #38BDF8; font-weight: 600;">${safeText(serviceName)}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Project Title</div>
        <div class="field-value">${safeText(order.projectTitle)}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Budget Range</div>
        <div class="field-value" style="color: #00E5FF; font-weight: 600;">${safeText(order.budgetRange)}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Project Description</div>
        <div class="field-box">${safeText(order.projectDescription)}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Preferred Requirements</div>
        <div class="field-box">${safeText(order.preferredRequirements)}</div>
      </div>
      ${
        order.additionalMessage
          ? `
      <div class="field-row">
        <div class="field-label">Additional Message</div>
        <div class="field-box">${safeText(order.additionalMessage)}</div>
      </div>`
          : ''
      }
    </div>
    <div class="footer">
      This notification was automatically dispatched to <strong>${OFFICIAL_BUSINESS_EMAIL}</strong> via WGP Developer's official website ordering system.
    </div>
  </div>
</body>
</html>
  `.trim();
}
