class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def random_string(length = 6)
    wait_list = '0123456789'
    result = ''
    length.times do
      result += wait_list[rand(wait_list.length)]
    end
    return result
  end
end
