document.addEventListener('DOMContentLoaded', () => {

    const yearSpan = document.querySelector('#current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        if (window.location.href.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    const menuBtn = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            navList.classList.toggle('is-open');
        });
    }

    const themeBtn = document.querySelector('#theme-toggle');
    const body = document.body;

    if (localStorage.getItem('siteTheme') === 'dark') {
        body.classList.add('theme-dark');
        if (themeBtn) themeBtn.querySelector('.icon').textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('theme-dark');
            localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
            themeBtn.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';
        });
    }

    const backBtn = document.querySelector('#back-to-top');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.hidden = window.scrollY < 300;
        });
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if (document.querySelector('.accordion')) initAccordion();
    if (document.querySelector('.filter-btn')) initFilters();
    if (document.querySelector('#contact-form')) initContactForm();
    if (document.querySelector('#modal-overlay')) initModal();
});


function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            document.querySelectorAll('.accordion-item').forEach(el => {
                if (el !== item) el.classList.remove('is-active');
            });
            item.classList.toggle('is-active');
        });
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.filter-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return; 

    const nameInput = document.querySelector('#user-name');
    const emailInput = document.querySelector('#user-email');
    const msgInput = document.querySelector('#user-message');
    const charCounter = document.querySelector('#char-counter');
    const successBlock = document.querySelector('#form-success');

    const savedDraft = JSON.parse(localStorage.getItem('contactDraft') || '{}');
    if (savedDraft.name) nameInput.value = savedDraft.name;
    if (savedDraft.email) emailInput.value = savedDraft.email;
    if (savedDraft.message) {
        msgInput.value = savedDraft.message;
        updateCharCounter();
    }

    form.addEventListener('input', () => {
        const draft = {
            name: nameInput.value,
            email: emailInput.value,
            message: msgInput.value
        };
        localStorage.setItem('contactDraft', JSON.stringify(draft));
        updateCharCounter();
    });

    function updateCharCounter() {
        charCounter.textContent = `Символів: ${msgInput.value.length} / 500`;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        let isValid = true;

        if (nameInput.value.trim().length < 2) {
            document.querySelector('#name-error').textContent = "Ім'я має містити мінімум 2 символи.";
            isValid = false;
        } else {
            document.querySelector('#name-error').textContent = "";
        }

        if (isValid) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            document.querySelector('#display-name').textContent = data.name;
            document.querySelector('#display-email').textContent = data.email;

            form.hidden = true;
            successBlock.hidden = false;

            localStorage.removeItem('contactDraft');
        }
    });
}

function initModal() {
    const openBtn = document.querySelector('#open-modal-btn');
    const modalOverlay = document.querySelector('#modal-overlay');
    const closeBtn = document.querySelector('.modal-close-btn');

    if (!openBtn || !modalOverlay || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        modalOverlay.hidden = false;
        document.body.style.overflow = 'hidden'; 
    });

    closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modalOverlay.hidden) {
            closeModal();
        }
    });

    function closeModal() {
        modalOverlay.hidden = true;
        document.body.style.overflow = ''; 
    }
}