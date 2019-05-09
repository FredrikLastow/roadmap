// TODO: we need to be able to swap in the appropriate locale here
import 'number-to-text/converters/en-us';
import { isObject } from '../../utils/isType';
import { Tinymce } from '../../utils/tinymce';
import { eachLinks } from '../../utils/links';

$(() => {
  const newDepartmentFormSelector = '#new_department_form';
  const saveNewDepartmentButtonSelector = '#save_new_department_button';
  const departmentsTableSelector = '#departments_table';

  const toggleFeedback = () => {
    const editor = Tinymce.findEditorById('org_feedback_email_msg');
    if (isObject(editor)) {
      if ($('#org_feedback_enabled_true').is(':checked')) {
        editor.setMode('code');
      } else {
        editor.setMode('readonly');
      }
    }
  };

  $('#edit_org_feedback_form input[type="radio"]').click(() => {
    toggleFeedback();
  });

  // Initialises tinymce for any target element with class tinymce_answer
  Tinymce.init({ selector: '#org_feedback_email_msg' });
  toggleFeedback();


  // update the hidden org_type field based on the checkboxes selected
  const calculateOrgType = () => {
    let orgType = 0;
    $('input.org_types:checked').each((i, el) => {
      orgType += parseInt($(el).val(), 10);
    });
    $('#org_org_type').val((orgType === 0 ? '' : orgType.toString()));
  };
  $('input.org_types').on('click', calculateOrgType);

  $('#edit_org_profile_form').on('submit', () => {
    // Collect links
    const links = {};
    eachLinks((ctx, value) => {
      links[ctx] = value;
    }).done(() => {
      $('#org_links').val(JSON.stringify(links));
    });
  });

  const saveNewDepartmentHandler = (e) => {
    e.preventDefault();
    const jQueryForm = $(newDepartmentFormSelector);
    // const jQueryForm = $(e.target).parent('form');
    const method = jQueryForm.attr('method');
    const url = jQueryForm.attr('action');
    const data = jQueryForm.serializeArray();

    $.ajax({
      method,
      url,
      dataType: 'JSON',
      data,
      success: (result) => {
        $(departmentsTableSelector).html(result.html).show();
        jQueryForm.trigger('reset');
      },
    });
    return false;
  };

  const saveEditedDepartmentHandler = (e) => {
    e.preventDefault();
    const target = $(e.target);
    const method = target.attr('data-method');
    const url = target.attr('data-url');
    const id = target.attr('data-dept-id');
    const orgId = target.attr('data-org-id');
    const name = $(target)
      .parent()
      .siblings('td')
      .children('input.dept-name')
      .val();
    const code = $(target)
      .parent()
      .siblings('td')
      .children('input.dept-code')
      .val();
    const data = {
      department: {
        id,
        name,
        code,
        org_id: orgId,
      },
    };

    $.ajax({
      method,
      url,
      dataType: 'JSON',
      data,
      success: (result) => {
        $(departmentsTableSelector).html(result.html).show();
      },
    });
    return false;
  };

  const editDepartmentButtonHandler = (e) => {
    e.preventDefault();
    const target = $(e.target);
    // Un-edited name and code for department
    const originalDeptName = target.attr('data-dept-name');
    const originalDeptCode = target.attr('data-dept-code');
    // Get all the input elements in the same table row as the button
    const inputs = target.parent().siblings('td').children('input');
    const currentText = target.text().trim();
    const editText = target.attr('data-edit-text');
    const cancelText = target.attr('data-cancel-text');
    const saveLink = target.siblings('a');
    // Toggle text
    if (currentText === editText) {
      target.text(cancelText);
      $(saveLink).css('display', '');
    } else {
      target.text(editText);
      $(saveLink).css('display', 'none');
    }
    // Toggle enabling and disabling input, save and cancel links
    $(inputs).each((index, input) => {
      $(input).prop('disabled', !$(input).prop('disabled'));
      if ($(input).prop('disabled')) {
        $(input).css('border', '0');
        $(input).siblings('a').css('display', 'none');
        // Reset inputs
        if ($(input).is('.dept-name')) {
          $(input).val(originalDeptName);
        } else if ($(input).is('.dept-code')) {
          $(input).val(originalDeptCode);
        }
      } else {
        $(input).css('border', '');
        $(input).siblings('a > span').css('display', '');
        $(input).siblings('a').css('display', '');
      }
    });
    return false;
  };

  const deleteDepartmentHandler = (e) => {
    e.preventDefault();
    const target = $(e.target);
    const method = target.attr('data-method');
    const url = target.attr('data-url');

    $.ajax({
      method,
      url,
      dataType: 'JSON',
      success: (result) => {
        $(departmentsTableSelector).html(result.html).show();
      },
    });
    return false;
  };

  const departmentsTableHandler = (e) => {
    const source = $(e.target);
    if (source.is('.save-edited-department')) {
      saveEditedDepartmentHandler(e);
    } else if (source.is('.edit-department')) {
      editDepartmentButtonHandler(e);
    } else if (source.is('.delete-department')) {
      deleteDepartmentHandler(e);
    }
    return false;
  };

  const eventHandlers = () => {
    $(saveNewDepartmentButtonSelector).on('click', saveNewDepartmentHandler);
    $(departmentsTableSelector).on('click', departmentsTableHandler);
  };

  const initOrReload = () => {
    eventHandlers();
  };

  initOrReload();
});
