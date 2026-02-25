import resend
import os

def get_resend_key():
    return os.getenv("RESEND_API_KEY")

def send_otp_email(email: str, otp_code: str):
    """
    Sends a verification email with the OTP code using Resend.
    """
    api_key = get_resend_key()
    if not api_key:
        print("Error: RESEND_API_KEY not found in environment variables.")
        return None
    
    resend.api_key = api_key
    try:
        params = {
            "from": "Deploy Chat <onboarding@resend.dev>",
            "to": [email],
            "subject": "Verify your email - Deploy Chat",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h2 style="color: #1e293b; margin-bottom: 16px;">Welcome to Deploy Chat!</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Thank you for signing up. Please use the following 6-digit code to verify your email address:
                    </p>
                    <div style="background: #f1f5f9; padding: 24px; border-radius: 8px; text-align: center; margin: 32px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">{otp_code}</span>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">
                        This code will expire in 10 minutes. If you did not request this, please ignore this email.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                        &copy; 2026 Deploy Chat. Built with passion for autonomous agents.
                    </p>
                </div>
            """,
        }
        
        email_response = resend.Emails.send(params)
        return email_response
    except Exception:
        # Avoid logging the raw exception str(e) to prevent leaking sensitive info
        print("Error: Failed to send OTP email.")
        return None
