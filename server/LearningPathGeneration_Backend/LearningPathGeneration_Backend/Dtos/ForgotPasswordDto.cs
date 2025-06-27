namespace LearningPathGeneration_Backend.Dtos
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }

    public class VerifyResetCodeDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string NewPassword { get; set; }
    }
}
