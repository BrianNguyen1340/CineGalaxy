export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác thực email của bạn</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Xác thực email của bạn</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào!</p>
    <p>Cảm ơn bạn đã đăng ký! Mã xác nhận của bạn là:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Vui lòng sử dụng mã này để hoàn tất việc đăng ký của bạn.</p>
    <p>Mã này sẽ hết hạn sau 10 phút vì lý do bảo mật.</p>
    <p>Nếu bạn không tạo tài khoản với chúng tôi, vui lòng bỏ qua email này.</p>
    <p>Best regards,<br>CineGalaxy!</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là một tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thay đổi mật khẩu của bạn</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Thay đổi mật khẩu</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào!</p>
    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    <p>Để đặt lại mật khẩu của bạn, hãy nhấp vào nút bên dưới:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>Liên kết này sẽ hết hạn sau 1 giờ vì lý do bảo mật.</p>
    <p>Best regards,<br>CineGalaxy</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là một tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu thành công</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Đặt lại mật khẩu thành công!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào!</p>
    <p>Chúng tôi viết thư để xác nhận rằng mật khẩu của bạn đã được đặt lại thành công.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Nếu bạn không thực hiện việc đặt lại mật khẩu này, vui lòng liên hệ ngay với đội ngũ hỗ trợ của chúng tôi.</p>
    <p>Vì lý do bảo mật, chúng tôi khuyến nghị bạn:</p>
    <ul>
      <li>Sử dụng một mật khẩu mạnh và duy nhất</li>
      <li>Bật xác thực hai yếu tố nếu có sẵn</li>
      <li>Tránh sử dụng cùng một mật khẩu trên nhiều trang web khác nhau</li>
    </ul>
    <p>Cảm ơn bạn đã giúp chúng tôi giữ an toàn cho tài khoản của bạn.</p>
    <p>Best regards,<br>CineGalaxy!</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là một tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`
