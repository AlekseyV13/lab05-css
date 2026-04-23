let allItems = [];
let displayedCount = 4; 

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('#catalog-grid');
    const loading = document.querySelector('#loading-state');
    const errorState = document.querySelector('#error-state');

    if (!grid) return;

    try {
        const response = await fetch('../data/items.json');
        if (!response.ok) throw new Error('Помилка завантаження файлу даних');
        
        allItems = await response.json();

        loading.hidden = true;
        applyFilters(); 
        initListeners(); 
    } catch (err) {
        loading.hidden = true;
        errorState.hidden = false;
        console.error("Помилка:", err);
    }
});

function renderCatalog(items) {
    const grid = document.querySelector('#catalog-grid');
    const emptyState = document.querySelector('#empty-state');
    const favorites = JSON.parse(localStorage.getItem('catalogFavs') || '[]');

    grid.innerHTML = '';

    const toShow = items.slice(0, displayedCount);

    if (toShow.length === 0) {
        emptyState.hidden = false;
    } else {
        emptyState.hidden = true;
        toShow.forEach(item => {
            const isFav = favorites.includes(item.id);
            grid.innerHTML += `
                <div class="learning-card card">
                    <img src="${item.image}" alt="${item.title}" style="width:100%; border-radius: 8px 8px 0 0; object-fit: cover; height: 150px;">
                    <div class="card-body">
                        <h3>${item.title}</h3>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">${item.description}</p>
                        <p><strong>Ціна:</strong> ${item.price} грн | ⭐ ${item.rating}</p>
                        <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            <button class="btn-details" data-id="${item.id}">Деталі</button>
                            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Додати в обране">
                                ${isFav ? '❤️' : '🤍'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    initFavActions();
    initDetailButtons();
}

function initListeners() {
    const search = document.querySelector('#search-input');
    const category = document.querySelector('#category-filter');
    const sort = document.querySelector('#sort-select');
    const loadMore = document.querySelector('#load-more');

    const handleChange = () => {
        displayedCount = 4; 
        applyFilters();
    };

    if (search) search.addEventListener('input', handleChange);
    if (category) category.addEventListener('change', handleChange);
    if (sort) sort.addEventListener('change', handleChange);
    
    if (loadMore) {
        loadMore.addEventListener('click', () => {
            displayedCount += 4; 
            applyFilters();
        });
    }
}

function applyFilters() {
    const query = document.querySelector('#search-input').value.toLowerCase();
    const cat = document.querySelector('#category-filter').value;
    const sortBy = document.querySelector('#sort-select').value;

    let filtered = allItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(query);
        const matchesCat = (cat === 'all' || item.category === cat);
        return matchesSearch && matchesCat;
    });

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);

    renderCatalog(filtered);

    const loadMoreBtn = document.querySelector('#load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = (displayedCount >= filtered.length) ? 'none' : 'inline-block';
    }
}


function initFavActions() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            let favs = JSON.parse(localStorage.getItem('catalogFavs') || '[]');

            if (favs.includes(id)) {
                favs = favs.filter(fId => fId !== id);
            } else {
                favs.push(id);
            }

            localStorage.setItem('catalogFavs', JSON.stringify(favs));
            applyFilters(); 
        });
    });
}

function initDetailButtons() {
    const modal = document.querySelector('#details-modal');
    const modalContent = document.querySelector('#modal-content');
    const closeBtn = document.querySelector('.modal-close-btn');

    if (!modal || !modalContent || !closeBtn) return;

    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = allItems.find(i => i.id === id);

            if (item) {
                modalContent.innerHTML = `
                    <div class="modal-detail-view">
                        <img src="${item.image}" alt="${item.title}" style="width:100%; max-height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="margin-bottom: 10px;">${item.title}</h2>
                        <div style="margin-bottom: 15px; display: flex; gap: 20px; font-weight: bold;">
                            <span>Категорія: ${item.category.toUpperCase()}</span>
                            <span>⭐ Рейтинг: ${item.rating}</span>
                        </div>
                        <p style="line-height: 1.6; color: #444; margin-bottom: 20px;">
                            ${item.description}. Це розширений опис проєкту, який витягується з вашої бази даних JSON. 
                            Тут можна додати більше тексту про переваги цього курсу чи інструменти, які використовуються.
                        </p>
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 1.2rem; font-weight: bold; text-align: center; border: 1px solid var(--color-border);">
                            Ціна навчання: ${item.price} грн
                        </div>
                    </div>
                `;
                modal.hidden = false;
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    const closeModal = () => {
        modal.hidden = true;
        document.body.style.overflow = ''; 
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}