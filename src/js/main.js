import validate from 'validate.js';
import Inputmask from 'inputmask';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    Inputmask({
      onBeforeMask: (value) => {
        if (/^8\d{10}$/.test(value)) {
          return `+7${value.slice(1)}`;
        }

        return value;
      },
    }).mask(document.querySelectorAll('[data-inputmask]'));

    const constraints = {
      name: {
        presence: true,
      },
      email: {
        presence: true,
        email: true,
      },
      phone: {
        presence: true,
        format: {
          pattern: /^\+\d\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
        },
      },
    };

    const forms = document.querySelectorAll('[data-node="contact-form"]');

    Array.prototype.slice.call(forms).forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        handleSubmitForm(form);
      });

      const inputs = form.querySelectorAll('input');

      Array.prototype.slice.call(inputs).forEach((input) => {
        input.addEventListener('change', () => {
          const errors = validate(form, constraints);
          showErrorsForInput(input, errors && errors[input.name]);
        });
      });
    });

    const handleSubmitForm = (form) => {
      const errors = validate(form, constraints);
      showErrors(form, errors || {});

      if (!errors) {
        submitForm(
          form.getAttribute('data-source'),
          validate.collectFormValues(form),
        );
      }
    };

    const showErrors = (form, errors) => {
      Array.prototype.slice
        .call(form.querySelectorAll('input[name]:not([type=hidden])'))
        .forEach((input) => {
          showErrorsForInput(input, errors && errors[input.name]);
        });
    };

    const showErrorsForInput = (input, errors) => {
      const formGroup = closestParent(input.parentNode, 'form-group');

      resetFormGroup(formGroup);

      if (errors) {
        formGroup.classList.add('has-error');
      } else {
        formGroup.classList.add('has-success');
      }
    };

    const closestParent = (child, dataNode) => {
      if (!child || child === document) {
        return null;
      }

      if (child.getAttribute('data-node') === dataNode) {
        return child;
      } else {
        return closestParent(child.parent, dataNode);
      }
    };

    const resetFormGroup = (formGroup) => {
      formGroup.classList.remove('has-error');
      formGroup.classList.remove('has-success');
    };

    const submitForm = async (form, data) => {
      const response = await fetch('/api/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          ...data,
          type: form,
          phone: data.phone.replace(/\D/g, ''),
        }),
      });
      const responseObj = await response.json();

      hideElement(document.querySelector('[data-node="header"]'));
      hideElement(document.querySelector('[data-node="main"]'));

      if (responseObj.result) {
        showElement(document.querySelector('[data-node="success"]'));
      } else {
        showElement(document.querySelector('[data-node="fail"]'));
      }
    };

    const hideElement = (el) => {
      el.style.display = 'none';
    };

    const showElement = (el) => {
      el.style.display = 'block';
    };

    const reloadButton = document.querySelector('[data-node="reload"]');
    reloadButton.addEventListener('click', (e) => {
      e.preventDefault();

      window.location.reload();
    });
  });
})();
