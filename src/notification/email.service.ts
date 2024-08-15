// src/notification/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name); // Initialize Logger

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendRecommendationEmail(userEmail: string, recommendations: any[]) {
    const recommendationList = recommendations
      .map((item) => `<li><strong>${item.title}</strong> - ${item.description}</li>`)
      .join('');

    const mailOptions = {
      from: '"Recommendation System" <no-reply@recommendations.com>',
      to: userEmail,
      subject: 'Your Personalized Recommendations',
      html: `
        <h1>We have new recommendations for you!</h1>
        <ul>
          ${recommendationList}
        </ul>
        <p>Check them out on our platform!</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${userEmail}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${userEmail}`, error.stack);
    }
  }
}
