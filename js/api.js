const API_URL = 'http://localhost:3000/items';

async function fetchItems() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Не вдалося отримати дані з сервера');
    return response.json();
}

async function fetchItemById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Не вдалося знайти запис');
    return response.json();
}

async function createItem(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Не вдалося створити запис');
    return response.json();
}

async function updateItem(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Не вдалося оновити запис');
    return response.json();
}

async function deleteItem(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Не вдалося видалити запис');
}