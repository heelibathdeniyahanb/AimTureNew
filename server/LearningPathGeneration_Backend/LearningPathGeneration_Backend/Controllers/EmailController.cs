﻿using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public EmailController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail([FromForm] string subject, [FromForm] string body, [FromForm] string[] recipients, [FromForm] List<IFormFile> attachments)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("aimture526@gmail.com"));

            foreach (var recipient in recipients)
            {
                email.To.Add(MailboxAddress.Parse(recipient));
            }

            email.Subject = subject;
            var builder = new BodyBuilder { HtmlBody = body };
            var emailModel = new Email
            {
                From = "aimture526@gmail.com",
                To = string.Join(",", recipients),
                Subject = subject,
                Body = body,
                SentDateTime = DateTime.UtcNow,
                Attachment = new List<Attachments>()
            };

            foreach (var attachment in attachments)
            {
                using (var ms = new MemoryStream())
                {
                    await attachment.CopyToAsync(ms);
                    var fileBytes = ms.ToArray();
                    builder.Attachments.Add(attachment.FileName, fileBytes);
                    emailModel.Attachment.Add(new Attachments
                    {
                        FileName = attachment.FileName,
                        Content = fileBytes
                    });
                }
            }

            email.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST");
            var smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587");
            var smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME");
            var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");

            client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            client.Authenticate(smtpUsername, smtpPassword); // Secure credentials
            _context.Emails.Add(emailModel);
            await _context.SaveChangesAsync();
            client.Send(email);
            client.Disconnect(true);

            return Ok();

            

        }
        [HttpPost("SendLoginDetails")]
        public async Task<IActionResult> SendLoginDetails([FromForm] string userEmail, [FromForm] string temporaryPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var subject = "Your Login Details for AimTure";
            var body = $@"
                Hello {user.FirstName} {user.LastName},

                Your login details for AimTure are as follows:

                Email: {user.Email}
                Password: {temporaryPassword}

                Please log in and change your password as soon as possible.
                ";

            await SendEmail(subject, body, new string[] { userEmail }, new List<IFormFile>());

            return Ok(new { message = "Login details sent to user via email" });
        }

        [HttpPost("SendResetCode")]
        public async Task<IActionResult> SendResetCode([FromForm] string email, [FromForm] string code)
        {
            var subject = "Password Reset Code";
            var body = $"Your password reset code is: {code}. It will expire in 15 minutes.";

            await SendEmail(subject, body, new string[] { email }, new List<IFormFile>());

            return Ok(new { message = "Send Verification code via email " });
        }



    }
}
