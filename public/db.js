
let db;
const request = indexedDB.open('Budget', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const budgetStore = db.createObjectStore('BudgetStore', {autoIncrement: true});
};
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};
request.onerror = function (event) {
    console.log('Error' + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const objStore = transaction.objectStore('BudgetStore');
    objStore.add(record);
    transaction.oncomplete = function() {
        console.log('stored record!');
    }
}
function checkDatabase() {
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const objStore = transaction.objectStore('BudgetStore');
    const getAll = objStore.getAll();
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then(() => {
            const transaction = db.transaction(['BudgetStore'], 'readwrite');
            const store = transaction.objectStore('BudgetStore');
            const clearStore = store.clear();
        });
        }
    };
};
window.addEventListener('online', checkDatabase);