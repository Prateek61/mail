document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    clearComposition();

    // Handle Submission
    document.querySelector('#compose-form').onsubmit = () => {
        // Gets all form fields
        const formFields = getCompositionFields();
        // Gets alert element
        const alert = document.querySelector('#compose-form-alert');

        // Checks if form data is filled
        if (!(formFields.recipients && formFields.subject && formFields.body)) {
            // Show error
            alert.innerHTML = 'Please fill all fields';
            alert.style.display = 'block';
            return false;
        } else {
            fetch('/emails', {
                method: 'POST',
                body: JSON.stringify(formFields)
            })
            .then(response => {
                if (response.status === 201) {
                    // Clears form fields
                    clearComposition();
                    // Load sent
                    load_mailbox('sent');
                }
                return response.json();
            })
            .then(res => {
                if (res.error) {
                    // Show error
                    alert.innerHTML = res.error;
                    alert.style.display = 'block';
                }
            })
            .catch(error => {
                console.log(error)
            })
        }

        // Prevents form from submitting
        return false;
    }
}

function load_mailbox(mailbox) {
  
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        // Prints emails
        console.log(emails)
    })
    .catch(error => {
        console.log(error)
    });
}

// Clear composition fields
function clearComposition() {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    document.querySelector('#compose-form-alert').style.display = 'none';
}

// Gets composition field data
function getCompositionFields() {
    // Gets all form fields
    const recipients = document.querySelector('#compose-recipients').value;
    const subject =  document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    return {
        recipients: recipients,
        subject: subject,
        body: body
    }
}