axios.defaults.headers.post['Content-Type'] = 'application/json';

let form = document.querySelector(`#create-form`);
let result = document.querySelector(`#result`);

loadOrders();

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    let response = await axios.post('/order/create', form);
    let order = response.data;
    result.innerHTML = `
        Талон #${order.ticket}
    `;
    loadOrders();
});

async function loadOrders() {
    let response = await axios.get('/orders/queue');
    let orders = response.data;
    renderOrders(orders);
    console.log(orders);
}

function renderOrders(orders) {
    let container = document.querySelector(`.orders-container`);
    container.innerHTML = '';
    for (let i = 0; i < orders.length; i++){
        let order = orders[i];
        container.innerHTML += `
            <div class="card my-2">
                <div class="card-body d-flex justify-content-between">
                    <span class="ticket"> Талон #${order.ticket} </span>
                    <span class="desk"> Окно № ${order.desk} </span>
                </div>
            </div>
        `;
    }
}