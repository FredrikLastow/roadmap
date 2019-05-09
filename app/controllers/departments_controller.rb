# frozen_string_literal: true

class DepartmentsController < ApplicationController

  after_action :verify_authorized
  respond_to  :json

  # POST /departments/create_or_update
  def create_or_update
    puts permitted_params
    if permitted_params[:id].nil?
      @department = Department.find_by(name: permitted_params[:name],
                                       org_id: permitted_params[:org_id])
    else
      @department = Department.find_by(id: permitted_params[:id],
                                       org_id: permitted_params[:org_id])
    end

    @org = Org.find(permitted_params[:org_id])
    
    puts @department.nil?

    if @department.nil?
      @department = Department.new(permitted_params)
      authorize @department
       
      if @department.save
        respond_to do |format|
          msg = success_message(@department, _("created"))
          flash[:notice] = msg
          format.json { render json: departments_json(@org, msg), status: :ok }
        end
      else
         # redirect_to admin_edit_org_path(@org) + "#departments",
         #    notice: failure_message(@department, _("created"))
         respond_to do |format|
           msg = failure_message(@department, _("create"))
           flash[:alert] = msg
           format.json { render json: departments_json(@org, msg), status => :unprocessable_entity }
         end
      end
    else
      authorize @department
    
      if @department.update(permitted_params)
         # redirect_to admin_edit_org_path(@org) + "#departments",
         #   notice: success_message(@department, _("updated"))
         respond_to do |format|
           msg = success_message(@department, _("updated"))
           flash[:notice] = msg
           format.json { render json: departments_json(@org, msg), status => :ok }
         end
      else
        msg = failure_message(@department, _("update"))
        flash[:alert] = msg
        format.json { render json: departments_json(@org, msg), status => :unprocessable_entity }
      end
    end
    
  end
  
  def destroy
    @department = Department.find(params[:id])
    authorize @department
    @org = Org.find(@department.org_id)

    if @department.destroy
      respond_to do |format|
        msg = success_message(@department, _("deleted"))
        flash[:notice] = msg
        format.json { render json: departments_json(@org, msg), status => :ok }
      end
    else
     respond_to do |format|
       msg = failure_message(@department, _("delete"))
       flash[:alert] = msg
       format.json { render json: departments_json(@org, msg), status: :unprocessable_entity }
     end
    end
  end

  private
  
    def permitted_params
      params.require(:department).permit(:id, :name, :code, :org_id)
    end
    
    def departments_json(org, msg)
      {
          html: render_to_string(partial: '/departments/index',
                                 locals: { departments: org.departments, org: org },
                                 formats: [:html]),
          msg: msg
      }.to_json
    end

end
