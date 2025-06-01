class CommentsController < ApplicationController
  before_action :set_post
  before_action :set_comment, only: [:edit, :update, :destroy]

  def create
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user

    if @comment.save
      respond_to do |format|
        format.html { redirect_to @post, notice: 'Comment was successfully added.' }
        format.json {
          render json: {
            id: @comment.id,
            content: @comment.content,
            user_name: @comment.user.name,
            created_at: @comment.created_at.iso8601,
            post_id: @post.id
          }, status: :created
        }
      end
    else
      respond_to do |format|
        format.html { redirect_to @post, alert: 'Comment could not be added.' }
        format.json { render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if @comment.update(comment_params)
      respond_to do |format|
        format.html { redirect_to @post, notice: 'Comment was successfully updated.' }
        format.json {
          render json: {
            id: @comment.id,
            content: @comment.content,
            user_name: @comment.user.name,
            created_at: @comment.created_at.iso8601
          }, status: :ok
        }
      end
    else
      respond_to do |format|
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @comment.destroy

    respond_to do |format|
      format.html { redirect_to @post, notice: 'Comment was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
