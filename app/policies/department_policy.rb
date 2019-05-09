class DepartmentPolicy < ApplicationPolicy
  attr_reader :user
  attr_reader :department

  def initialize(user, department)
    raise Pundit::NotAuthorizedError, "must be logged in" unless user
    @user = user
    @department = department
  end

  def create_or_update?
    puts "create_or_update?: @department"
    puts @department
    # Only org_admins can create or update a department
    @user.can_org_admin? && @user.org.id === @department.org_id
  end
  
  def destroy?
    puts "destroy?: @department"
    puts @department
    # Only org_admins can delete
    @user.can_org_admin? && @user.org.id === @department.org_id
  end
  
end
