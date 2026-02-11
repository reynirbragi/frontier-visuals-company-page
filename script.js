document.addEventListener('DOMContentLoaded', () => {

    /* --- Navigation & Header Logic --- */
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    /* --- Intersection Observer for Fade Animations --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-up').forEach(el => {
        observer.observe(el);
    });


    /* --- Package Selection Modal Logic --- */
    const modal = document.getElementById('package-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const packageSelect = document.getElementById('modal-package');
    const packageButtons = document.querySelectorAll('a[data-package]');

    // Form & Success Elements
    const packageForm = document.getElementById('package-form');
    const modalHeader = document.querySelector('.modal-header');
    const successMessage = document.getElementById('modal-success');
    const successCloseBtn = document.getElementById('success-close-btn');

    // Helper: Reset Modal State
    const resetModal = () => {
        setTimeout(() => {
            // Restore visibility
            packageForm.style.display = 'grid';
            modalHeader.style.display = 'block';
            successMessage.style.display = 'none';

            // Reset form fields and button
            packageForm.reset();
            const submitBtn = packageForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Send Inquiry';
            submitBtn.disabled = false;

            // Restore hidden fields (General Inquiry reset)
            document.querySelector('#modal-business').closest('.form-group').style.display = 'flex';
            document.querySelector('#modal-package').closest('.form-group').style.display = 'flex';
            document.querySelector('label[for="modal-details"]').textContent = 'Tell us about your vision';
            document.querySelector('.modal-header h3').textContent = 'Start Your Project';
            document.getElementById('modal-details').placeholder = 'What are your goals? Any design preferences?';
        }, 300); // Wait for transition
    };

    // Open Modal
    const openModal = (packageName) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (packageName && packageSelect) {
            packageSelect.value = packageName;
        }
    };

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetModal(); // Reset state for next time
    };

    // Event Listeners
    packageButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const packageName = btn.getAttribute('data-package');
            openModal(packageName);
        });
    });

    const emailTriggers = document.querySelectorAll('.contact-trigger, #email-trigger');
    emailTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();

            // Hide Package & Business fields
            document.querySelector('#modal-business').closest('.form-group').style.display = 'none';
            document.querySelector('#modal-package').closest('.form-group').style.display = 'none';

            // Update Label & Text
            document.querySelector('label[for="modal-details"]').textContent = 'How can I help?';
            document.querySelector('.modal-header h3').textContent = 'Not sure what you need?';
            document.getElementById('modal-details').placeholder = 'Describe your project or ask a question...';
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    successCloseBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submission (Package Modal)
    packageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = packageForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Replace these with your actual Service ID and Template ID
        const serviceID = 'service_5pneddc';
        const templateID = 'template_pqe2wen';

        emailjs.sendForm(serviceID, templateID, packageForm)
            .then(() => {
                submitBtn.textContent = 'Sent!';
                // Hide Form and Header
                packageForm.style.display = 'none';
                modalHeader.style.display = 'none';

                // Show Success Message
                successMessage.style.display = 'flex';
            }, (err) => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Failed to send message. Please try again later.\nError: ' + JSON.stringify(err));
            });
    });

    // Handle Contact Form Submission (Landing Page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Replace these with your actual Service ID and Template ID
            const serviceID = 'service_5pneddc';
            const templateID = 'template_pqe2wen';

            emailjs.sendForm(serviceID, templateID, contactForm)
                .then(() => {
                    // Open the modal but show the success message immediately
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';

                    // Hide the modal form and header, show success
                    packageForm.style.display = 'none';
                    modalHeader.style.display = 'none';
                    successMessage.style.display = 'flex';

                    // Reset the contact form button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, (err) => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert('Failed to send message. Please try again later.\nError: ' + JSON.stringify(err));
                });
        });
    }

});
