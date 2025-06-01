Rails.application.routes.draw do
  get 'up' => 'rails/health#show', as: :rails_health_check

  scope :api do
    resources :posts do
      resources :comments, only: %i[create update destroy]
    end
  end

  get '*path', to: 'application#index', constraints: ->(request) { !request.xhr? && request.format.html? }
  root 'application#index'
end
