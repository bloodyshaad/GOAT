const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Create transporter with multiple provider support
      const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
      
      let transportConfig;
      
      switch (emailProvider.toLowerCase()) {
        case 'gmail':
          transportConfig = {
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
            },
            secure: true,
            port: 465,
            tls: {
              rejectUnauthorized: false
            }
          };
          break;
          
        case 'outlook':
          transportConfig = {
            service: 'hotmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            },
            secure: false,
            port: 587,
            tls: {
              ciphers: 'SSLv3'
            }
          };
          break;
          
        case 'smtp':
          transportConfig = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          };
          break;
          
        case 'sendgrid':
          transportConfig = {
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
              user: 'apikey',
              pass: process.env.SENDGRID_API_KEY
            }
          };
          break;
          
        default:
          throw new Error(`Unsupported email provider: ${emailProvider}`);
      }

      this.transporter = nodemailer.createTransporter(transportConfig);
      
      // Verify connection
      await this.verifyConnection();
      console.log('✅ Email service initialized successfully');
      
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      throw error;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('📧 SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      throw new Error(`SMTP connection failed: ${error.message}`);
    }
  }

  // Generate secure verification token
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate secure reset token
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Load and compile email template
  async loadTemplate(templateName, variables = {}) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
      let template = await fs.readFile(templatePath, 'utf8');
      
      // Replace variables in template
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, variables[key]);
      });
      
      return template;
    } catch (error) {
      console.error(`❌ Failed to load email template ${templateName}:`, error);
      // Return fallback template
      return this.getFallbackTemplate(templateName, variables);
    }
  }

  // Fallback templates if file loading fails
  getFallbackTemplate(templateName, variables) {
    const baseStyle = `
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .logo { font-size: 32px; font-weight: bold; letter-spacing: 2px; }
      </style>
    `;

    switch (templateName) {
      case 'verification':
        return `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8">${baseStyle}</head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">GOAT</div>
                <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                <h2>Welcome to GOAT, ${variables.name}!</h2>
                <p>Thank you for joining the Greatest Of All Time e-commerce platform. To complete your registration and start shopping, please verify your email address.</p>
                <div style="text-align: center;">
                  <a href="${variables.verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${variables.verificationUrl}</p>
                <p><strong>This link will expire in 24 hours.</strong></p>
                <p>If you didn't create an account with GOAT, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 GOAT E-commerce. All rights reserved.</p>
                <p>Greatest Of All Time Fashion</p>
              </div>
            </div>
          </body>
          </html>
        `;

      case 'welcome':
        return `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8">${baseStyle}</head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">GOAT</div>
                <h1>Welcome to GOAT!</h1>
              </div>
              <div class="content">
                <h2>Hello ${variables.name}!</h2>
                <p>Your email has been successfully verified. Welcome to the GOAT family!</p>
                <p>You can now enjoy all the features of our platform:</p>
                <ul>
                  <li>Browse our premium collection</li>
                  <li>Add items to your cart and wishlist</li>
                  <li>Track your orders</li>
                  <li>Manage your account</li>
                </ul>
                <div style="text-align: center;">
                  <a href="${variables.shopUrl}" class="button">Start Shopping</a>
                </div>
              </div>
              <div class="footer">
                <p>&copy; 2024 GOAT E-commerce. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

      case 'password-reset':
        return `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8">${baseStyle}</head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">GOAT</div>
                <h1>Reset Your Password</h1>
              </div>
              <div class="content">
                <h2>Hello ${variables.name}!</h2>
                <p>We received a request to reset your password for your GOAT account.</p>
                <div style="text-align: center;">
                  <a href="${variables.resetUrl}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${variables.resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 GOAT E-commerce. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

      case 'order-confirmation':
        return `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8">${baseStyle}</head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">GOAT</div>
                <h1>Order Confirmation</h1>
              </div>
              <div class="content">
                <h2>Thank you for your order, ${variables.name}!</h2>
                <p>Your order has been confirmed and is being processed.</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Order Details</h3>
                  <p><strong>Order Number:</strong> ${variables.orderNumber}</p>
                  <p><strong>Total:</strong> $${variables.total}</p>
                  <p><strong>Estimated Delivery:</strong> ${variables.estimatedDelivery}</p>
                </div>
                <div style="text-align: center;">
                  <a href="${variables.trackingUrl}" class="button">Track Your Order</a>
                </div>
              </div>
              <div class="footer">
                <p>&copy; 2024 GOAT E-commerce. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

      default:
        return `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8">${baseStyle}</head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">GOAT</div>
                <h1>GOAT E-commerce</h1>
              </div>
              <div class="content">
                <h2>Hello ${variables.name || 'Valued Customer'}!</h2>
                <p>Thank you for being part of the GOAT community.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 GOAT E-commerce. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
    }
  }

  // Send verification email
  async sendVerificationEmail(email, name, verificationToken) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      const htmlContent = await this.loadTemplate('verification', {
        name,
        verificationUrl,
        supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER
      });

      const mailOptions = {
        from: {
          name: 'GOAT E-commerce',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: '🔐 Verify Your GOAT Account - Action Required',
        html: htmlContent,
        priority: 'high',
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(email, name) {
    try {
      const shopUrl = `${process.env.FRONTEND_URL}/shop`;
      
      const htmlContent = await this.loadTemplate('welcome', {
        name,
        shopUrl,
        supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER
      });

      const mailOptions = {
        from: {
          name: 'GOAT E-commerce',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: '🎉 Welcome to GOAT - Start Shopping Now!',
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, name, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const htmlContent = await this.loadTemplate('password-reset', {
        name,
        resetUrl,
        supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER
      });

      const mailOptions = {
        from: {
          name: 'GOAT E-commerce',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: '🔑 Reset Your GOAT Password',
        html: htmlContent,
        priority: 'high'
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(email, name, orderDetails) {
    try {
      const trackingUrl = `${process.env.FRONTEND_URL}/orders/${orderDetails.orderNumber}`;
      
      const htmlContent = await this.loadTemplate('order-confirmation', {
        name,
        orderNumber: orderDetails.orderNumber,
        total: orderDetails.total,
        estimatedDelivery: orderDetails.estimatedDelivery || '5-7 business days',
        trackingUrl,
        supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER
      });

      const mailOptions = {
        from: {
          name: 'GOAT E-commerce',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: `📦 Order Confirmation #${orderDetails.orderNumber} - GOAT`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Order confirmation email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      throw new Error(`Failed to send order confirmation email: ${error.message}`);
    }
  }

  // Send custom email
  async sendCustomEmail(to, subject, htmlContent, options = {}) {
    try {
      const mailOptions = {
        from: {
          name: options.fromName || 'GOAT E-commerce',
          address: process.env.EMAIL_USER
        },
        to,
        subject,
        html: htmlContent,
        ...options
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Custom email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ Failed to send custom email:', error);
      throw new Error(`Failed to send custom email: ${error.message}`);
    }
  }

  // Bulk email sending with rate limiting
  async sendBulkEmails(emails, subject, htmlContent, options = {}) {
    const results = [];
    const batchSize = options.batchSize || 10;
    const delay = options.delay || 1000; // 1 second delay between batches

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchPromises = batch.map(email => 
        this.sendCustomEmail(email, subject, htmlContent, options)
          .catch(error => ({ success: false, email, error: error.message }))
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get email service status
  async getStatus() {
    try {
      await this.verifyConnection();
      return {
        status: 'healthy',
        provider: process.env.EMAIL_PROVIDER || 'gmail',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;