class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :content
      t.references :course, index: true
      t.boolean :tag

      t.timestamps
    end
  end
end
