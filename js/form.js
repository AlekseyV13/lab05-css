document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('#crud-form');
    const successMsg = document.querySelector('#success-message');
    const submitBtn = document.querySelector('#submit-btn');
    const pageTitle = document.querySelector('h2'); // Заголовок над формою

    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        pageTitle.textContent = 'Редагувати запис';
        submitBtn.textContent = 'Оновити дані';
        
        try {
            const currentData = await fetchItemById(editId);
            
            form.elements['title'].value = currentData.title;
            form.elements['category'].value = currentData.category;
            form.elements['price'].value = currentData.price;
            form.elements['rating'].value = currentData.rating;
            if (currentData.image) form.elements['image'].value = currentData.image;
            form.elements['description'].value = currentData.description;
        } catch (error) {
            alert('Не вдалося завантажити дані для редагування.');
            window.location.href = 'catalog.html'; 
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const itemData = Object.fromEntries(formData.entries());

        itemData.price = Number(itemData.price);
        itemData.rating = Number(itemData.rating);

        try {
            submitBtn.textContent = 'Збереження...';
            submitBtn.disabled = true;

            if (editId) {
                await updateItem(editId, itemData);
                successMsg.innerHTML = '✅ Курс успішно оновлено! <a href="catalog.html">Повернутися до каталогу</a>';
            } else {
                await createItem(itemData);
            }

            form.hidden = true;
            successMsg.hidden = false;

        } catch (error) {
            alert('Сталася помилка при збереженні: ' + error.message);
        } finally {
            submitBtn.textContent = editId ? 'Оновити дані' : 'Зберегти в базу';
            submitBtn.disabled = false;
        }
    });
});