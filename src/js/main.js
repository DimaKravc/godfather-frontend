import validate from "validate.js";
import Inputmask from "inputmask";

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const constraints = {
            name: {
                presence: true
            },
            email: {
                presence: true,
                email: true
            },
            phone: {
                presence: true,
                format: {
                    pattern: /^\+\d\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/
                }
            }
        };

        const forms = document.querySelectorAll('[data-node="contact-form"]');

        Array.prototype.slice.call(forms).forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();

                handleSubmitForm(form);
            });
            
            const inputs = form.querySelectorAll('input');
            
            Array.prototype.slice.call(inputs).forEach(input => {
                input.addEventListener('change', e => {
                    const errors = validate(form, constraints);
                    showErrorsForInput(input, errors && errors[input.name])
                });
            });
        });

        const handleSubmitForm = form => {
            const errors = validate(form, constraints);
            showErrors(form, errors || {});

            if (!errors) {
                console.log(validate.collectFormValues(form))
                console.log(form.getAttribute('data-source'))
            }
        };

        const showErrors = (form, errors) => {
            Array.prototype.slice.call(form.querySelectorAll('input[name]')).forEach(input => {
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
                return null
            }

            if (child.getAttribute('data-node') === dataNode) {
                return child
            } else {
                return closestParent(child.parent, dataNode);
            }
        };
        
        const resetFormGroup = (formGroup) => {
            formGroup.classList.remove('has-error');
            formGroup.classList.remove('has-success');
        };
        
        Inputmask({
            onBeforeMask: (value, opts) => {
                if (/^8\d{10}$/.test(value)) {
                    return `+7${value.slice(1)}`
                }
                
                return value
            } 
        }).mask(document.querySelectorAll('[data-inputmask]'));
    })
})();