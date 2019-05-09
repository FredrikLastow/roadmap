# == Schema Information
#
# Table name: departments
#
#  id         :integer          not null, primary key
#  code       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  org_id     :integer
#
# Indexes
#
#  index_departments_on_org_id  (org_id)
#

class Department < ActiveRecord::Base
  
  include ValidationMessages
  
  belongs_to :org
  
  has_many :users
  
  # ===============
  # = Validations =
  # ===============

  validates :org, presence: { message: PRESENCE_MESSAGE }
  
  validates :name, presence: { message: PRESENCE_MESSAGE },
                      uniqueness: { message: UNIQUENESS_MESSAGE,
                                    scope: :org_id }

  validates :name, uniqueness: { message: UNIQUENESS_MESSAGE,
                                 scope: :org_id }
  default_scope { order(name: :asc) }
  
end
