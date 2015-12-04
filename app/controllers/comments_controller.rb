class CommentsController < ApplicationController
  # shorthand for expanded 'respond_to' block- does same thing;
  # 'tells Rails about all the formats your action knows about'
  # 'usually, each action in your controller will work with the
  # same formats. placing respond_to here effects ENTIRE ctrl'
  respond_to :json

  def index
    respond_with Comment.all
  end

  def create
    respond_with Comment.create(comment_params)
  end

  private

  def comment_params
    params.require(:comment).permit(:author, :comment)
  end
end
