class AuthController {
  constructor(
    registerUseCase,
    loginUseCase,
    getProfileUseCase,
    jwtService
  ) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
    this.getProfileUseCase = getProfileUseCase;
    this.jwtService = jwtService;
  }

  async register(req, res) {
    try {
      const result = await this.registerUseCase.execute(req.body);

      res.cookie('jwt', result.token, this.jwtService.getCookieOptions());

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result.user
      });

    } catch (error) {
      console.error('❌ Register error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const result = await this.loginUseCase.execute(req.body);

      res.cookie('jwt', result.token, this.jwtService.getCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result.user
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('jwt');

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('❌ Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Error during logout'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await this.getProfileUseCase.execute(req.user.id);

      res.status(200).json({
        success: true,
        data: profile
      });

    } catch (error) {
      console.error('❌ Get profile error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
