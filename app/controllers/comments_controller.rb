class CommentsController < ApplicationController
  def create
    @comment = Comment.new()
    @comment.content = params[:comment][:content]
    @comment.course = Course.find(session[:course_id])
    @comment.tag = true

    respond_to do |format|
      if @comment.save
        format.html { redirect_to :back, notice: 'Success!' }
      else
        format.html { redirect_to :back, notice: 'An error happened! Please try again.' }
      end
    end

  end
end