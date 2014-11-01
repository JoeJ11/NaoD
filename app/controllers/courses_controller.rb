class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :edit, :update, :destroy, :fetch]

  # GET /courses
  # GET /courses.json
  def index
    if validate_course
      redirect_to '/courses/dashboard'
    end
    @courses = Course.all
  end

  # GET /courses/1
  # GET /courses/1.json
  def show
  end

  # GET /courses/new
  def new
    @course = Course.new
  end

  # GET /courses/1/edit
  def edit
  end

  # POST /courses
  # POST /courses.json
  def create
    @course = Course.new(course_params)
    @course.specifier = random_string

    respond_to do |format|
      if @course.save
        format.html { redirect_to @course, notice: 'Course was successfully created.' }
        format.json { render action: 'show', status: :created, location: @course }
      else
        format.html { render action: 'new' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courses/1
  # PATCH/PUT /courses/1.json
  def update
    respond_to do |format|
      if @course.update(course_params)
        format.html { redirect_to @course, notice: 'Course was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.json
  def destroy
    @course.comments.each do |comment|
      comment.destroy
    end
    @course.destroy
    respond_to do |format|
      format.html { redirect_to courses_url }
      format.json { head :no_content }
    end
  end

  # GET /courses/1/fetch
  def fetch
    @comments = []
    @course.comments.each do |comment|
      if comment.tag
        comment.tag = false
        comment.save
        @comments.append(comment)
      end
    end
    render json: @comments
  end

  # GET /courses/dashboard
  def dashboard
    if validate_course
      @course = Course.find(session[:course_id])
    else
      @course = Course.find(params[:id])
      if @course
        session[:course_id] = @course.id
        session[:course_specifier] = @course.specifier
      end
    end
    @comment = Comment.new(course: @course)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_course
      @course = Course.find(params[:id])
    end

    # Get course for a student
    def validate_course
      if session.has_key? :course_id
        @course = Course.find(session[:course_id])
        if @course and params[:course_specifier] == @course.specifier
          return true
        end
      end
      return false
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def course_params
      params.require(:course).permit(:name, :description)
    end
end
