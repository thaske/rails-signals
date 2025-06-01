class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  def index
    render "layouts/application"
  end

  private

  def current_user
    @current_user ||= User.first || User.create!(
      name: "Demo User",
      email: "demo@example.com"
    )
  end

  helper_method :current_user
end
