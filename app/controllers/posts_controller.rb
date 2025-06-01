class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.includes(:user, comments: :user).order(created_at: :desc).page(params[:page] || 1)

    respond_to do |format|
      format.html # Keep for fallback
      format.json {
        render json: @posts.map { |post|
          {
            id: post.id,
            title: post.title,
            content: post.content,
            user: { name: post.user.name },
            created_at: post.created_at.iso8601,
            comments_count: post.comments.count
          }
        }
      }
    end
  end

  def show
    @post = Post.includes(:user, comments: :user).find(params[:id])
    @comment = Comment.new

    respond_to do |format|
      format.html # Keep for fallback
      format.json {
        render json: {
          post: {
            id: @post.id,
            title: @post.title,
            content: @post.content,
            user: { name: @post.user.name },
            created_at: @post.created_at.iso8601
          },
          comments: @post.comments.order(:created_at).map { |comment|
            {
              id: comment.id,
              content: comment.content,
              user_name: comment.user.name,
              created_at: comment.created_at.iso8601
            }
          }
        }
      }
    end
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      respond_to do |format|
        format.html { redirect_to @post, notice: 'Post was successfully created.' }
        format.json {
          render json: {
            id: @post.id,
            title: @post.title,
            content: @post.content,
            user: { name: @post.user.name },
            created_at: @post.created_at.iso8601
          }, status: :created
        }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if @post.update(post_params)
      respond_to do |format|
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json {
          render json: {
            id: @post.id,
            title: @post.title,
            content: @post.content,
            user: { name: @post.user.name },
            created_at: @post.created_at.iso8601
          }, status: :ok
        }
      end
    else
      respond_to do |format|
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_path, notice: 'Post was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :content)
  end
end
