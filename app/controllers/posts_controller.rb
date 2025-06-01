class PostsController < ApplicationController
  def index
    @posts = Post.includes(:user, comments: :user).order(created_at: :desc).page(params[:page] || 1)
  end

  def show
    @post = Post.includes(:user, comments: :user).find(params[:id])
  end
end
