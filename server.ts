/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import {
  validateOrderInput,
  generateOrderReference,
  OrderRecord,
  isValidEmail,
} from './src/utils/orderValidation';
import {
  generateOrderEmailHtml,
  OFFICIAL_BUSINESS_EMAIL,
  COMPANY_NAME,
} from './src/utils/emailTemplate';

dotenv.config();

const TARGET_EMAIL = process.env.OFFICIAL_BUSINESS_EMAIL || OFFICIAL_BUSINESS_EMAIL;
const OWNER_EMAIL = 'gsheelu92@gmail.com';

function getNotificationRecipients(): string[] {
  const recipients = [TARGET_EMAIL];
  if (!recipients.includes(OWNER_EMAIL)) {
    recipients.push(OWNER_EMAIL);
  }
  if (process.env.GMAIL_USER && !recipients.includes(process.env.GMAIL_USER)) {
    recipients.push(process.env.GMAIL_USER);
  }
  return recipients;
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Initialize data files if not present
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helpers for persistent data access
function readOrders(): OrderRecord[] {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

function writeOrders(orders: OrderRecord[]): void {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function readMessages(): any[] {
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading messages file:', err);
    return [];
  }
}

function writeMessages(messages: any[]): void {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

// Services catalog
const SERVICES_DATA = [
  {
    id: 'web-development',
    title: 'Website Development',
    description: 'High-performance, futuristic responsive 3D web applications, SaaS platforms, and enterprise business websites crafted with cutting-edge frontends.',
    startingPrice: '₹25,000',
    iconName: 'Globe',
    features: [
      'Interactive 3D Three.js experiences',
      'Ultra-fast Vite & React architecture',
      'Mobile-first responsive design',
      'Full SEO & Performance optimization',
      'Custom backend APIs and CMS'
    ]
  },
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    description: 'Intelligent AI workflows, enterprise LLM agents, predictive data analytics, and custom machine learning integrations tailored for business growth.',
    startingPrice: '₹50,000',
    iconName: 'Cpu',
    features: [
      'Gemini & Custom LLM integrations',
      'Automated intelligence pipelines',
      'Semantic search and vector databases',
      'AI chatbot & virtual agents',
      'Automated business decision systems'
    ]
  },
  {
    id: 'android-app-development',
    title: 'Android App Development',
    description: 'Native and cross-platform high-performance Android applications built with modern UI, robust architecture, and smooth user experiences.',
    startingPrice: '₹35,000',
    iconName: 'Smartphone',
    features: [
      'Native Android & Kotlin/Flutter options',
      'Clean MVVM architecture',
      'Offline-first synchronization',
      'Play Store release preparation',
      'Push notifications and analytics'
    ]
  },
  {
    id: 'game-development',
    title: 'Game Development',
    description: 'Immersive 2D and 3D web and mobile game experiences with custom physics, procedural visual effects, and fluid gameplay mechanics.',
    startingPrice: '₹60,000',
    iconName: 'Gamepad2',
    features: [
      'WebGL / Three.js 3D game engines',
      'Custom particle systems & shaders',
      'Spatial 3D audio synthesis',
      'Cross-platform touch & gamepad controls',
      'Lossless frame pacing optimization'
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Award-winning digital product design, interactive 3D spatial prototypes, design systems, and user-centered conversion workflows.',
    startingPrice: '₹20,000',
    iconName: 'Palette',
    features: [
      'Futuristic dark & light design systems',
      'High-fidelity interactive prototypes',
      'WCAG AA accessible interfaces',
      'User journey mapping & usability audits',
      'Bespoke visual assets and brand guides'
    ]
  },
  {
    id: 'custom-software-development',
    title: 'Custom Software Development',
    description: 'End-to-end custom business software, scalable cloud microservices, database architecture, and mission-critical API platforms.',
    startingPrice: '₹55,000',
    iconName: 'Layers',
    features: [
      'Microservices & distributed systems',
      'Secure database & cloud migrations',
      'Enterprise security & RBAC systems',
      'Real-time data streaming & websockets',
      'Complete maintenance & SLA support'
    ]
  }
];

// Showcase Projects
const PROJECTS_DATA = [
  {
    id: 'project-1',
    name: 'Nexus AI Enterprise Platform',
    category: 'AI Solutions',
    description: 'Next-generation enterprise predictive analytics platform featuring real-time telemetry, neural monitoring, and autonomous insight agents.',
    image: '/src/assets/images/project_ai_analytics_1793900313289.jpg',
    technologies: ['React', 'Python', 'AI APIs', 'TypeScript', 'Tailwind CSS'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com'
  },
  {
    id: 'project-2',
    name: 'Quantum Flux Mobile Ecosystem',
    category: 'Android App Development',
    description: 'High-security mobile digital assets experience with biometric validation, real-time sync, and fluid micro-interactions.',
    image: '/src/assets/images/project_mobile_app_1793900313013.jpg',
    technologies: ['Android', 'Kotlin', 'Express', 'Databases', 'Cloud APIs'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com'
  },
  {
    id: 'project-3',
    name: 'SpatialView 3D Web Studio',
    category: 'Website Development',
    description: 'Browser-based 3D spatial engineering viewer with procedural geometry, real-time lighting shaders, and zero-latency inspection.',
    image: '/src/assets/images/project_3d_spatial_1793900313773.jpg',
    technologies: ['Three.js', 'WebGL', 'GSAP', 'HTML5', 'TypeScript'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com'
  },
  {
    id: 'project-4',
    name: 'CloudCore Distributed Architecture',
    category: 'Custom Software Development',
    description: 'High-throughput microservices pipeline delivering ultra-low latency transaction coordination and real-time event streaming.',
    image: '/src/assets/images/project_custom_software_1793900313954.jpg',
    technologies: ['Node.js', 'Express', 'Databases', 'GitHub CI/CD', 'Python'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com'
  }
];

// Check email configuration status
function isEmailConfigured(): boolean {
  return Boolean(
    (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

// Mail transporter factory
function getMailTransporter() {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
}

// Basic anti-spam rate limiter for order & contact submissions
const ipSubmissionTimestamps = new Map<string, number>();

app.use(express.json({ limit: '1mb' }));

// Health / Status endpoint
app.get('/api/system/status', (_req: Request, res: Response) => {
  const configured = isEmailConfigured();
  res.json({
    status: 'ONLINE',
    company: COMPANY_NAME,
    officialEmail: TARGET_EMAIL,
    emailService: {
      configured,
      provider: process.env.GMAIL_USER ? 'Gmail SMTP' : process.env.SMTP_HOST ? 'Custom SMTP' : 'Direct Stored Mode (Awaiting GMAIL_APP_PASSWORD)',
      recipient: getNotificationRecipients().join(', '),
      setupInstructions: configured
        ? 'Email service is configured and ready.'
        : 'To enable direct Gmail delivery, add GMAIL_USER and GMAIL_APP_PASSWORD in your environment variables. Orders are always safely preserved in the database regardless of email delivery.',
    },
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Services endpoint
app.get('/api/services', (_req: Request, res: Response) => {
  res.json({
    success: true,
    services: SERVICES_DATA,
  });
});

// Projects endpoint
app.get('/api/projects', (_req: Request, res: Response) => {
  res.json({
    success: true,
    projects: PROJECTS_DATA,
  });
});

// Customer Ordering System: POST /api/orders
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastSubmission = ipSubmissionTimestamps.get(clientIp);

    // Rate-limiting: max 1 submission every 5 seconds per client
    if (lastSubmission && now - lastSubmission < 5000) {
      return res.status(429).json({
        success: false,
        error: 'Please wait a few seconds before submitting another request.',
      });
    }

    // Validation
    const validation = validateOrderInput(req.body);
    if (!validation.isValid || !validation.sanitized) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed. Please correct the highlighted fields.',
        details: validation.errors,
      });
    }

    const sanitized = validation.sanitized;
    const orderId = generateOrderReference();
    const createdAt = new Date().toISOString();

    const selectedService = SERVICES_DATA.find((s) => s.id === sanitized.serviceId);
    const serviceTitle = selectedService ? selectedService.title : sanitized.serviceId;

    // Create the order record
    const newOrder: OrderRecord = {
      ...sanitized,
      orderId,
      createdAt,
      status: 'PENDING_REVIEW',
      emailNotificationStatus: 'CONFIG_REQUIRED',
    };

    // STEP 8: Save order to persistent store FIRST (guarantees no data loss)
    const existingOrders = readOrders();
    existingOrders.unshift(newOrder);
    writeOrders(existingOrders);
    ipSubmissionTimestamps.set(clientIp, now);

    console.log(`[WGP Order] New order created successfully: ${orderId} by ${sanitized.fullName} for ${serviceTitle}`);

    // STEP 9: Attempt official Gmail notification
    const transporter = getMailTransporter();
    const recipients = getNotificationRecipients();
    const recipientsListStr = recipients.join(', ');

    if (transporter) {
      try {
        const emailHtml = generateOrderEmailHtml(newOrder, serviceTitle);
        await transporter.sendMail({
          from: `"${COMPANY_NAME}" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
          to: recipientsListStr,
          subject: `New Customer Order — ${COMPANY_NAME} [${orderId}]`,
          html: emailHtml,
          text: `New Customer Order: ${orderId}\nCustomer: ${sanitized.fullName} (${sanitized.email}, ${sanitized.phone})\nService: ${serviceTitle}\nBudget: ${sanitized.budgetRange}\nTitle: ${sanitized.projectTitle}\nDescription:\n${sanitized.projectDescription}`,
        });

        newOrder.emailNotificationStatus = 'SENT';
        newOrder.emailNotificationDetails = `Dispatched successfully to ${recipientsListStr}`;
        // Update stored record
        writeOrders(existingOrders);
        console.log(`[WGP Order] Email notification delivered to ${recipientsListStr} for order ${orderId}`);
      } catch (mailErr: any) {
        console.error(`[WGP Order] Email dispatch error for order ${orderId}:`, mailErr.message);
        newOrder.emailNotificationStatus = 'FAILED';
        newOrder.emailNotificationDetails = `Email delivery failed: ${mailErr.message}. Order is securely stored in database.`;
        writeOrders(existingOrders);
      }
    } else {
      // Explain transparently: preserved in database, awaiting SMTP credentials
      newOrder.emailNotificationStatus = 'CONFIG_REQUIRED';
      newOrder.emailNotificationDetails = `Saved to database. Live SMTP dispatch requires GMAIL_APP_PASSWORD. Notification staged for ${recipientsListStr}.`;
      writeOrders(existingOrders);
      console.log(`[WGP Order] Order ${orderId} saved to database. Staged for ${recipientsListStr}. SMTP credentials not set.`);
    }

    // STEP 10 & 11: Return accurate confirmation with unique order reference
    return res.status(201).json({
      success: true,
      message: 'Your project order has been securely submitted and registered.',
      order: {
        orderId: newOrder.orderId,
        createdAt: newOrder.createdAt,
        fullName: newOrder.fullName,
        serviceId: newOrder.serviceId,
        serviceTitle,
        projectTitle: newOrder.projectTitle,
        status: newOrder.status,
        emailNotificationStatus: newOrder.emailNotificationStatus,
        emailNotificationDetails: newOrder.emailNotificationDetails,
      },
    });
  } catch (error: any) {
    console.error('[WGP Order] Unexpected server error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your order. Please try again.',
    });
  }
});

// Order status tracker endpoint: GET /api/orders/:orderId
app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const orders = readOrders();
  const found = orders.find((o) => o.orderId.toUpperCase() === (orderId || '').trim().toUpperCase());

  if (!found) {
    return res.status(404).json({
      success: false,
      error: 'Order reference not found. Please verify your reference ID.',
    });
  }

  const selectedService = SERVICES_DATA.find((s) => s.id === found.serviceId);

  return res.json({
    success: true,
    order: {
      orderId: found.orderId,
      createdAt: found.createdAt,
      fullName: found.fullName,
      serviceTitle: selectedService ? selectedService.title : found.serviceId,
      projectTitle: found.projectTitle,
      status: found.status,
      emailNotificationStatus: found.emailNotificationStatus,
    },
  });
});

// Contact Form endpoint: POST /api/contact
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedSubject = (subject || '').trim();
    const trimmedMessage = (message || '').trim();

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide your full name.' });
    }
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }
    if (!trimmedSubject || trimmedSubject.length < 3) {
      return res.status(400).json({ success: false, error: 'Please provide a subject.' });
    }
    if (!trimmedMessage || trimmedMessage.length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' });
    }

    const messageRecord = {
      id: `MSG-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      receivedAt: new Date().toISOString(),
      emailStatus: 'SAVED',
    };

    const messages = readMessages();
    messages.unshift(messageRecord);
    writeMessages(messages);

    // Attempt mail delivery if transporter available
    const transporter = getMailTransporter();
    const recipients = getNotificationRecipients();
    const recipientsListStr = recipients.join(', ');

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${COMPANY_NAME} Contact" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
          to: recipientsListStr,
          replyTo: trimmedEmail,
          subject: `Contact Inquiry: ${trimmedSubject} — from ${trimmedName}`,
          text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
        });
        messageRecord.emailStatus = 'SENT';
        writeMessages(messages);
      } catch (err: any) {
        console.error('[WGP Contact] Error forwarding message to email:', err.message);
        messageRecord.emailStatus = 'FAILED';
        writeMessages(messages);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. Your message has been received by WGP Developer\'s.',
      recipient: recipientsListStr,
    });
  } catch (err: any) {
    console.error('[WGP Contact] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to submit your inquiry at this moment. Please email us directly at ' + OFFICIAL_BUSINESS_EMAIL,
    });
  }
});

// Vite or Static file serving
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WGP Server] Running at http://localhost:${PORT} (${isProduction ? 'production' : 'development'})`);
    console.log(`[WGP Server] Official Business Email: ${OFFICIAL_BUSINESS_EMAIL}`);
  });
}

startServer().catch((err) => {
  console.error('[WGP Server] Failed to initialize server:', err);
  process.exit(1);
});
