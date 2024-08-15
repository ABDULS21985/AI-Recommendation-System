// src/notification/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // Or use another service like SendGrid
      auth: {
        user: process.env.EMAIL_USER, // Your email username
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });
  }

  async sendRecommendationEmail(userEmail: string, recommendations: any[]) {
    const recommendationList = recommendations
      .map(
        (item) => `<li><strong>${item.title}</strong> - ${item.description}</li>`
      )
      .join('');

    const mailOptions = {
      from: '"Recommendation System" <no-reply@recommendations.com>', // Sender address
      to: userEmail, // Recipient's email
      subject: 'Your Personalized Recommendations', // Subject line
      html: `
        <h1>We have new recommendations for you!</h1>
        <ul>
          ${recommendationList}
        </ul>
        <p>Check them out on our platform!</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
