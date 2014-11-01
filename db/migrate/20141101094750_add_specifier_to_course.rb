class AddSpecifierToCourse < ActiveRecord::Migration
  def change
    add_column :courses, :specifier, :string
  end
end
