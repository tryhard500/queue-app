axios.defaults.headers.post['Content-Type'] = 'application/json';


let container = document.querySelector(`.orders`);
let deskSelect = document.querySelector(`#desk`);
let statusSelect = document.querySelector(`#status`);


loadOrders();

deskSelect.addEventListener('input',async function() {
    loadOrders();
});

statusSelect.addEventListener('input',async function() {
    loadOrders();
});

async function loadOrders() {
    let desk = deskSelect.value;
    let status = statusSelect.value;
    let response = await axios.get('/orders/render',{
        params: {
            desk: desk,
            status: status
        } 
    });
    let orders = response.data;
    console.log(orders);
    renderOrders(orders);
}

function renderOrders(orders) {
    container.innerHTML = '';

    for (let i = 0; i < orders.length; i++){
        let order = orders[i];
        let status = order.status;
        let statusName;
        let className;

        if (status == 2) {
            statusName = 'В очереди';
            className = 'status_2';
        } else if (status == 1) {
            statusName = 'В работе';
            className = 'status_1';
        } else if (status == 3) {
            statusName = 'Завершено';
            className = 'status_3';
        }

        container.innerHTML += `
            <div class="card my-3">
                <div class="card-body d-flex">
                    <span class="ticket"> Талон # ${order.ticket} </span>
                    <span class="title ms-2"> Окно № ${order.desk} </span>
                    <button class="status btn ms-auto ${className}">
                        ${statusName}
                    </button>  
                </div>
            </div>
        `;  
    }

    let buttons = document.querySelectorAll(`.btn`);
    for (let i = 0; i < buttons.length; i++){
        let order = orders[i];
        let button = buttons[i];
        button.addEventListener('click',async ()=>{
            let status = order.status;
            if (status == 2) {
                status = 1
            } else if (status == 1) {
                status = 3
            }
            await axios.post('/order/update',{
                id: order._id,
                status: status
            });
            loadOrders();
        });
    }
}